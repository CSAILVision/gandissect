import PIL, torch
from netdissect import upsample, renormalize, segviz
from matplotlib import cm

class ImageVisualizer:
    def __init__(self, size, image_size=None, data_size=None,
            renormalizer=None, scale_offset=None, level=None, actrange=None,
            source=None, convolutions=None, quantiles=None,
            percent_level=None):
        if image_size is None and source is not None:
            image_size = upsample.image_size_from_source(source)
        if renormalizer is None and source is not None:
            renormalizer = renormalize.renormalizer(source=source, mode='byte')
        if scale_offset is None and convolutions is not None:
            scale_offset = upsample.sequence_scale_offset(convolutions)
        if data_size is None and convolutions is not None:
            data_size = upsample.sequence_data_size(convolutions, image_size)
        if level is None and quantiles is not None:
            level = quantiles.quantiles([percent_level or 0.95])[:,0]
        if actrange is None and quantiles is not None:
            actrange = quantiles.quantiles([0.01, 0.99])
        if isinstance(size, int):
            size = (size, size)
        self.size = size
        self.image_size = image_size
        self.data_size = data_size
        self.renormalizer = renormalizer
        self.scale_offset = scale_offset
        self.percent_level = percent_level
        self.level = level
        self.actrange = actrange
        self.quantiles = quantiles
        self.upsampler = None
        if self.data_size is not None:
            self.upsampler = upsample.upsampler(size, data_size,
                    image_size=self.image_size,
                    scale_offset=scale_offset)

    def heatmap(self, activations, unit=None, mode='bilinear'):
        amin, amax = self.range_for(activations, unit)
        if unit is None:
            a = activations
        else:
            a = activations[unit]
        upsampler = self.upsampler_for(a)
        a = upsampler(a[None,None,...], mode=mode)[0,0].cpu()
        return PIL.Image.fromarray(
                (cm.hot((a - amin) / (1e-10 + amax - amin)) * 255
                    ).astype('uint8'))

    def segmentation(self, segmentations, label=None):
        if label is not None:
            segmentations = segmentations.clone()
            segmentations[segmentations != label] = 0
        return segviz.seg_as_image(segmentations, size=self.size)

    def segment_key(self, segmentations, segmodel, num=None, label=None):
        if label is not None:
            segmentations = segmentations.clone()
            segmentations[segmentations != label] = 0
        if num is None:
            num = self.size[0] // 17
        return segviz.segment_key(segmentations, segmodel, num)

    def image(self, imagedata):
        return PIL.Image.fromarray(self.scaled_image(imagedata)
                .permute(1, 2, 0).byte().cpu().numpy())

    def masked_image(self, imagedata, activations, unit=None,
            level=None, percent_level=None):
        scaled_image = self.scaled_image(imagedata).float().cpu()
        mask = self.pytorch_mask(activations, unit, level=level,
                percent_level=percent_level).cpu()
        border = border_from_mask(mask)
        inside = (mask & (~border))
        outside = (~mask & (~border))
        inside, outside, border = [d.float() for d in [inside, outside, border]]
        yellow = torch.tensor([255.0, 255.0, 0],
                dtype=border.dtype, device=border.device)[:,None,None]
        result_image = (
                scaled_image * inside +
                yellow * border +
                0.5 * scaled_image * outside).clamp(0, 255).byte()
        return PIL.Image.fromarray(
            result_image.permute(1, 2, 0).cpu().numpy())

    def masked_segmentation(self, imagedata, activations, unit):
        # returns a dissection-style image overlay
        pass

    def pytorch_mask(self, activations, unit, level=None, percent_level=None):
        if unit is None:
            a = activations
        else:
            a = activations[unit]
        if level is None:
            level = self.level_for(activations, unit,
                    percent_level=percent_level)
        upsampler = self.upsampler_for(a)
        return (upsampler(a[None, None,...])[0,0] > level)

    def scaled_image(self, imagedata):
        if len(imagedata.shape) == 4:
            imagedata = imagedata[0]
        renormalizer = self.renormalizer_for(imagedata)
        return torch.nn.functional.interpolate(
                renormalizer(imagedata).float()[None,...],
                size=self.size)[0]

    def upsampler_for(self, a):
        if self.upsampler is not None:
            return self.upsampler
        return upsample.upsampler(self.size, a.shape,
                    image_size=self.image_size,
                    scale_offset=self.scale_offset,
                    dtype=a.dtype, device=a.device)

    def range_for(self, activations, unit):
        if unit is not None and self.actrange is not None:
            if hasattr(unit, '__len__'):
                unit = unit[1]
            return tuple(i.item() for i in self.actrange[unit])
        return activations.min(), activations.max()

    def level_for(self, activations, unit, percent_level=None):
        if unit is not None:
            if hasattr(unit, '__len__'):
                unit = unit[1]
            if percent_level is not None and self.quantiles is not None:
                return self.quantiles.quantiles(percent_level)[unit].item()
            if self.level is not None:
                return self.level[unit].item()
        s, _ = activations.view(-1).sort()
        if percent_level is None:
            percent_level = self.percent_level or 0.95
        return s[int(len(s) * percent_level)]

    def renormalizer_for(self, image):
        if self.renormalizer is not None:
            return self.renormalizer
        return renormalize.renormalizer('zc', 'byte')

def border_from_mask(a):
    out = torch.zeros_like(a)
    h = (a[:-1,:] != a[1:,:])
    v = (a[:,:-1] != a[:,1:])
    d = (a[:-1,:-1] != a[1:,1:])
    u = (a[1:,:-1] != a[:-1,1:])
    out[:-1,:-1] |= d
    out[1:,1:] |= d
    out[1:,:-1] |= u
    out[:-1,1:] |= u
    out[:-1,:] |= h
    out[1:,:] |= h
    out[:,:-1] |= v
    out[:,1:] |= v
    out &= ~a
    return out

