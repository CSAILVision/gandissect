import torch

def upsampler(data_shape, target_shape, input_shape=None, scale_offset=None,
        modules=None, mode='bilinear', padding_mode='border',
        dtype=torch.float, device=None):
    '''
    Returns a function that will upsample a batch of torch data from the
    expected data_shape to the specified target_shape. Can use scale_offset
    and input_shape to center the grid in a nondefault way: scale_offset
    maps feature pixels to input_shape pixels, and it is assumed that
    the target_shape is a uniform downsampling of input_shape.
    '''
    if modules is not None:
        assert scale_offset is None
        scale_offset = sequence_scale_offset(modules)
    grid = upsample_grid(data_shape, target_shape, input_shape, scale_offset,
            dtype, device)
    def upsample_func(data):
        nonlocal grid
        if data.device != grid.device:
            grid = grid.to(data.device)
        # Use the same grid over the whole batch
        if grid.shape[0] != data.shape[0]:
            grid = grid.expand((data.shape[0],) + grid.shape[1:])
        return torch.nn.functional.grid_sample(data, grid, mode=mode,
                padding_mode=padding_mode)
    return upsample_func

def sequence_scale_offset(modulelist):
    '''Returns (yscale, yoffset), (xscale, xoffset) given a list of modules.
    To convert output coordinates back to input coordinates while preserving
    centers of receptive fields, the affine transformation is:
        inpx = outx * xscale + xoffset
        inpy = outy * yscale + yoffset
    In both coordinate systems, (0, 0) refers to the upper-left corner
    of the first pixel, (0.5, 0.5) refers to the center of that pixel,
    and (1, 1) refers to the lower-right corner of that same pixel.

    Modern convnets tend to add padding to keep receptive fields centered
    while scaling, which will result in zero offsets.  For example, after resnet
    does five stride-2 reductions, the scale_offset is just ((32, 0), (32, 0)).
    However, AlexNet does not pad every layer, and after five stride-2
    reductions, the scale_offset is ((32, 31), (32, 31)).
    '''
    return tuple(dilation_scale_offset(d) for d in dilations(modulelist))

def dilation_scale_offset(dilations):
    '''Composes a lists of [(k, s, p)...] into a single total scale and offset
    that returns to the input coordinates.
    '''
    if len(dilations) == 0:
        return (1, 0)
    scale, offset = dilation_scale_offset(dilations[1:])
    kernel, stride, padding = dilations[0]
    scale *= stride
    offset *= stride
    offset += (kernel - 1) / 2.0 - padding
    return scale, offset

def dilations(modulelist):
    '''Converts a list of modules to a pair of lists of
    [(kernel_size, stride, padding)...]: one for x, and another for y.'''
    result = []
    for module in modulelist:
        settings = tuple(getattr(module, n, d)
            for n, d in (('kernel_size', 1), ('stride', 1), ('padding', 0)))
        settings = tuple((s if isinstance(s, tuple) else (s, s))
            for s in settings)
        if settings != ((1, 1), (1, 1), (0, 0)):
            result.append(zip(*settings))
    return list(zip(*result))

def upsample_grid(data_shape, target_shape, input_shape=None,
        scale_offset=None, dtype=torch.float, device=None):
    '''Prepares a grid to use with grid_sample to upsample a batch of
    features in data_shape to the target_shape. Can use scale_offset
    and input_shape to center the grid in a nondefault way: scale_offset
    maps feature pixels to input_shape pixels, and it is assumed that
    the target_shape is a uniform downsampling of input_shape.'''
    # Default is that nothing is resized.
    if target_shape is None:
        target_shape = data_shape
    # Make a default scale_offset to fill the image if there isn't one
    if scale_offset is None:
        scale = tuple(float(ts) / ds
                for ts, ds in zip(target_shape, data_shape))
        offset = tuple(0.0 for s in scale)
    else:
        scale, offset = (v for v in zip(*scale_offset))
        # Handle downsampling for different input vs target shape.
        if input_shape is not None:
            scale = tuple(s * (ts - 1) / (ns - 1)
                    for s, ns, ts in zip(scale, input_shape, target_shape))
            offset = tuple(o * (ts - 1) / (ns - 1)
                    for o, ns, ts in zip(offset, input_shape, target_shape))
    # Pytorch needs target coordinates in terms of source coordinates [-1..1]
    ty, tx = (((torch.arange(ts, dtype=dtype, device=device) - o)
                  * (2 / (s * (ss - 1))) - 1)
        for ts, ss, s, o, in zip(target_shape, data_shape, scale, offset))
    # Whoa, note that grid_sample reverses the order y, x -> x, y.
    grid = torch.stack(
        (tx[None,:].expand(target_shape), ty[:,None].expand(target_shape)),2
       )[None,:,:,:].expand((1, target_shape[0], target_shape[1], 2))
    return grid

