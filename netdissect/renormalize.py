import numpy, torch, PIL
from torchvision import transforms

def as_tensor(data, source=None, mode='zc'):
    renorm = renormalizer(source=source, mode=mode)
    return renorm(data)

def as_image(data, source='zc', mode='byte'):
    assert len(data.shape) == 3
    renorm = renormalizer(source=source, mode=mode)
    return PIL.Image.fromarray(renorm(data).
            permute(1,2,0).cpu().numpy())

def renormalizer(source=None, mode='zc'):
    '''
    Returns a function that imposes a standard normalization on
    the image data.  The returned renormalizer operates on either
    3d tensor (single image) or 4d tensor (image batch) data.
    The normalization mode choices are:

        zc (default) - zero centered [-1..1]
        pt - pytorch [0..1]
        imagenet - zero mean, unit stdev imagenet stats (approx [-2.1...2.6])
        byte - as from an image file, [0..255]

    If a source is provided (a dataset or transform), then, the renormalizer
    first reverses any normalization found in the data source before
    imposing the specified normalization.  When no source is provided,
    the input data is assumed to be pytorch-normalized (range [0..1]).
    '''
    if isinstance(source, str):
        oldoffset, oldscale = OFFSET_SCALE[source]
    else:
        normalizer = find_normalizer(source)
        oldoffset, oldscale = (
                (normalizer.mean, normalizer.std) if normalizer is not None
                else OFFSET_SCALE['pt'])
    newoffset, newscale = (mode if isinstance(mode, tuple)
            else OFFSET_SCALE[mode])
    return Renormalizer(oldoffset, oldscale, newoffset, newscale,
            tobyte=(mode == 'byte'))

# The three commonly-seed image normalization schemes.
OFFSET_SCALE=dict(
            pt=([0.0, 0.0, 0.0], [1.0, 1.0, 1.0]),
            zc=([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
            imagenet=([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
            byte=([0.0, 0.0, 0.0], [1.0/255, 1.0/255, 1.0/255]))

NORMALIZER={k: transforms.Normalize(*OFFSET_SCALE[k]) for k in OFFSET_SCALE}

def find_normalizer(source=None):
    '''
    Crawl around the transforms attached to a dataset looking for a
    Normalize transform to return.
    '''
    if source is None:
        return None
    if isinstance(source, (transforms.Normalize, Renormalizer)):
        return source
    t = getattr(source, 'transform', None)
    if t is not None:
        return find_normalizer(t)
    ts = getattr(source, 'transforms', None)
    if ts is not None:
        for t in reversed(ts):
            result = find_normalizer(t)
            if result is not None:
                return result
    return None

class Renormalizer:
    def __init__(self, oldoffset, oldscale, newoffset, newscale, tobyte=False):
        self.mul = torch.from_numpy(
                numpy.array(oldscale) / numpy.array(newscale))
        self.add = torch.from_numpy(
                (numpy.array(oldoffset) - numpy.array(newoffset))
                / numpy.array(newscale))
        self.tobyte = tobyte
        # Store these away to allow the data to be renormalized again
        self.mean = newoffset
        self.std = newscale

    def __call__(self, data):
        mul, add = [d.to(data.device, data.dtype) for d in [self.mul, self.add]]
        if data.ndimension() == 3:
            mul, add = [d[:, None, None] for d in [mul, add]]
        elif data.ndimension() == 4:
            mul, add = [d[None, :, None, None] for d in [mul, add]]
        result = data.mul(mul).add_(add)
        if self.tobyte:
            result = result.clamp(0, 255).byte()
        return result
