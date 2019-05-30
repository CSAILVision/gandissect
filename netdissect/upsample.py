import torch
from torchvision import transforms

def upsampler(target_shape, data_shape=None,
        image_size=None, scale_offset=None,
        source=None, convolutions=None, dtype=torch.float, device=None):
    '''
    Returns a function that will upsample a batch of torch data from the
    expected data_shape to the specified target_shape. Can use scale_offset
    and image_size to center the grid in a nondefault way: scale_offset
    maps feature pixels to image_size pixels, and it is assumed that
    the target_shape is a uniform downsampling of image_size.
    '''
    if source is not None:
        assert image_size is None
        image_size = image_size_from_source(source)
    if convolutions is not None:
        assert scale_offset is None
        scale_offset = sequence_scale_offset(convolutions)
        if image_size is not None and data_shape is None:
            data_shape = sequence_data_size(convolutions, image_size)
    assert data_shape is not None
    grid = upsample_grid(data_shape, target_shape, image_size, scale_offset,
            dtype, device)
    batch_grid = grid
    # padding mode could be 'border'
    def upsample_func(data, mode='bilinear', padding_mode='zeros'):
        nonlocal grid, batch_grid
        # Use the same grid over the whole batch
        if batch_grid.shape[0] != data.shape[0]:
            batch_grid = grid.expand((data.shape[0],) + grid.shape[1:])
        if batch_grid.device != data.device:
            batch_grid = batch_grid.to(data.device)
        return torch.nn.functional.grid_sample(data, batch_grid, mode=mode,
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
    return tuple(convconfig_scale_offset(d) for d in convconfigs(modulelist))

def sequence_data_size(modulelist, input_size):
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
    return tuple(convconfig_data_size(d, s)
            for d, s in zip(convconfigs(modulelist), input_size))

def convconfig_scale_offset(convconfigs):
    '''Composes a lists of [(k, d, s, p)...] into a single total scale and
    offset that returns to the input coordinates.
    '''
    if len(convconfigs) == 0:
        return (1, 0)
    scale, offset = convconfig_scale_offset(convconfigs[1:])
    kernel, dilation, stride, padding = convconfigs[0]
    scale *= stride
    offset *= stride
    offset += (kernel - 1) * dilation / 2.0 - padding
    return scale, offset

def convconfig_data_size(convconfigs, data_size):
    '''Applies a list of [(k, d, s, p)...] to the given input size to obtain
    an output size.
    '''
    for kernel, dilation, stride, padding in convconfigs:
        data_size = (1 + (data_size + 2 * padding
            - dilation * (kernel - 1) - 1) // stride)
    return data_size

def convconfigs(modulelist):
    '''Converts a list of modules to a pair of lists of
    [(kernel_size, dilation, stride, padding)...]: one for x, and one for y.'''
    result = []
    for module in modulelist:
        settings = tuple(getattr(module, n, d)
            for n, d in (('kernel_size', 1),
                ('dilation', 1), ('stride', 1), ('padding', 0)))
        settings = tuple((s if isinstance(s, tuple) else (s, s))
            for s in settings)
        if settings != ((1, 1), (1, 1), (1, 1), (0, 0)):
            result.append(zip(*settings))
    return list(zip(*result))

def upsample_grid(data_shape, target_shape, image_size=None,
        scale_offset=None, dtype=torch.float, device=None):
    '''Prepares a grid to use with grid_sample to upsample a batch of
    features in data_shape to the target_shape. Can use scale_offset
    and image_size to center the grid in a nondefault way: scale_offset
    maps feature pixels to image_size pixels, and it is assumed that
    the target_shape is a uniform downsampling of image_size.'''
    # Default is that nothing is resized.
    if target_shape is None:
        target_shape = data_shape
    # Make a default scale_offset to fill the image if there isn't one
    if scale_offset is None:
        scale = tuple(float(ts) / ds
                for ts, ds in zip(target_shape, data_shape))
        offset = tuple(0.5 * s - 0.5 for s in scale)
    else:
        scale, offset = (v for v in zip(*scale_offset))
        # Handle downsampling for different input vs target shape.
        if image_size is not None:
            scale = tuple(s * (ts - 1) / (ns - 1)
                    for s, ns, ts in zip(scale, image_size, target_shape))
            offset = tuple(o * (ts - 1) / (ns - 1)
                    for o, ns, ts in zip(offset, image_size, target_shape))
    # Pytorch needs target coordinates in terms of source coordinates [-1..1]
    ty, tx = (((torch.arange(ts, dtype=dtype, device=device) - o)
                  * (2 / (s * (ss - 1))) - 1)
        for ts, ss, s, o, in zip(target_shape, data_shape, scale, offset))
    # Whoa, note that grid_sample reverses the order y, x -> x, y.
    grid = torch.stack(
        (tx[None,:].expand(target_shape), ty[:,None].expand(target_shape)),2
       )[None,:,:,:].expand((1, target_shape[0], target_shape[1], 2))
    return grid

def image_size_from_source(source):
    sizer = find_sizer(source)
    size = sizer.size
    if hasattr(size, '__len__'):
        return size
    return (size, size)

def find_sizer(source):
    '''
    Crawl around the transforms attached to a dataset looking for
    the last crop or resize transform to return.
    '''
    if source is None:
        return None
    if isinstance(source, (transforms.Resize, transforms.RandomCrop,
        transforms.RandomResizedCrop, transforms.CenterCrop)):
        return source
    t = getattr(source, 'transform', None)
    if t is not None:
        return find_sizer(t)
    ts = getattr(source, 'transforms', None)
    if ts is not None:
        for t in reversed(ts):
            result = find_sizer(t)
            if result is not None:
                return result
    return None

