'''
GanTester holds on to a specific model to test.

(1) loads and instantiates the GAN;
(2) instruments it at every layer so that units can be ablated
(3) precomputes z dimensionality, and output image dimensions.

'''

import torch, numpy, warnings, os, types, threading
from collections import OrderedDict, defaultdict
from torch.utils.data import TensorDataset, DataLoader
from . import proggan

warnings.filterwarnings("ignore", message="nn.Upsampling is deprecated.")


def test_main():
    tester = GanTester('model/lsun_models/churchoutdoor_lsun.pth',
            ['layer1', 'layer2', 'layer3', 'layer4', 'layer5', 'layer6'])
    z = tester.standard_z_sample(10)
    imgs = tester.run_z_batch(z)
    return (((imgs + 1) / 2) * 255).clamp(0, 255).byte()

class GanTester:
    def __init__(self, args, dissectdir=None, device=None):
        self.cachedir = cachedir if cachedir is not None else (
                os.path.join(os.path.dirname(pthfile), 'cache'))
        self.device = device if device is not None else torch.device('cpu')
        self.dissectdir = dissectdir if dissectdir is not None else (
                os.path.join(os.path.dirname(os.path.dirname(pthfile)),
                    'dissect'))
        self.modellock = threading.Lock()

        # Load the generator from the pth file.
        model = proggan.from_pth_file(
                pthfile,
                map_location=lambda storage, location: storage)
        model.eval()
        self.model = model

        # Get the set of layers of interest.
        # Default: all shallow children except last.
        if layers is None:
            layers = [name for name, module in model.named_children()][:-1]
        self.layers = layers

        # Modify model to instrument the given layers
        retain_layers(model, layers)
        ablate_layers(model, layers)

        # Move it to CUDA if wanted.
        model.to(device)

        # Determine z dimension.
        self.z_dimension = [c for c in model.modules()
                  if isinstance(c, torch.nn.Conv2d)][0].in_channels

        # Run the model on one sample input to determine output image size
        # as well as feature size of every layer
        z = torch.randn(self.z_dimension)[None, :, None, None].to(device)
        output = model(z)
        self.image_shape = output.shape[2:]
        self.layer_shape = {
                layer: tuple(model.retained[layer].shape) for layer in layers }

        self.quantiles = {
            layer: load_quantile_if_present(os.path.join(self.dissectdir,
                safe_dir_name(layer)), 'quantiles.npz',
                device=torch.device('cpu'))
            for layer in layers }

    def layer_shapes(self):
        return self.layer_shape

    def standard_z_sample(self, size=100, seed=1, device=None):
        '''
        Generate a standard set of random Z as a (size, z_dimension) tensor.
        With the same random seed, it always returns the same z (e.g.,
        the first one is always the same regardless of the size.)
        '''
        # Use numpy RandomState since it can be done deterministically
        # without affecting global state
        rng = numpy.random.RandomState(seed)
        result = torch.from_numpy(
                rng.standard_normal(size * self.z_dimension)
                .reshape(size, self.z_dimension)).float()
        if device is not None:
            result = result.to(device)
        return result

    def reset_intervention(self):
        for layer in self.layers:
            self.model.ablation[layer] = None
            self.model.replacement[layer] = None

    def apply_intervention(self, intervention):
        '''
        Applies an ablation recipe of the form [(layer, unit, alpha)...].
        '''
        self.reset_intervention()
        if not intervention:
            return
        for layer, (a, v) in intervention.items():
            self.model.ablation[layer] = a
            self.model.replacement[layer] = v

    def generate_images(self, z_batch, intervention=None):
        '''
        Makes some images.
        '''
        with torch.no_grad(), self.modellock:
            batch_size = 10
            self.apply_intervention(intervention)
            test_loader = DataLoader(TensorDataset(z_batch[:,:,None,None]),
                batch_size=batch_size,
                pin_memory=('cuda' == self.device.type
                    and z_batch.device.type == 'cpu'))
            result_img = torch.zeros(*((len(z_batch), 3) + self.image_shape),
                    dtype=torch.uint8, device=self.device)
            for batch_num, [batch_z,] in enumerate(test_loader):
                batch_z = batch_z.to(self.device)
                out = self.model(batch_z)
                result_img[batch_num*batch_size:
                        batch_num*batch_size+len(batch_z)] = (
                                (((out + 1) / 2) * 255).clamp(0, 255).byte())
            return result_img

    def get_layers(self):
        return self.layers

    def feature_stats(self, z_batch,
            masks=None, intervention=None, layers=None):
        feature_stat = defaultdict(dict)
        with torch.no_grad(), self.modellock:
            batch_size = 10
            self.apply_intervention(intervention)
            if masks is None:
                masks = torch.ones(z_batch.size(0), 1, 1, 1,
                        device=z_batch.device, dtype=z_batch.dtype)
            else:
                assert masks.shape[0] == z_batch.shape[0]
                assert masks.shape[1] == 1
            test_loader = DataLoader(
                TensorDataset(z_batch[:,:,None,None], masks),
                batch_size=batch_size,
                pin_memory=('cuda' == self.device.type
                    and z_batch.device.type == 'cpu'))
            processed = 0
            for batch_num, [batch_z, batch_m] in enumerate(test_loader):
                batch_z, batch_m = [
                        d.to(self.device) for d in [batch_z, batch_m]]
                # Run model but disregard output
                self.model(batch_z)
                processing = batch_z.shape[0]
                for layer, feature in self.model.retained.items():
                    if layers is not None:
                        if layer not in layers:
                            continue
                    # Compute max features touching mask
                    resized_max = torch.nn.functional.adaptive_max_pool2d(
                            batch_m,
                            (feature.shape[2], feature.shape[3]))
                    max_feature = (feature * resized_max).view(
                            feature.shape[0], feature.shape[1], -1
                            ).max(2)[0].max(0)[0]
                    if 'max' not in feature_stat[layer]:
                        feature_stat[layer]['max'] = max_feature
                    else:
                        torch.max(feature_stat[layer]['max'], max_feature,
                                    out=feature_stat[layer]['max'])
                    # Compute mean features weighted by overlap with mask
                    resized_mean = torch.nn.functional.adaptive_avg_pool2d(
                            batch_m,
                            (feature.shape[2], feature.shape[3]))
                    mean_feature = (feature * resized_mean).view(
                            feature.shape[0], feature.shape[1], -1
                            ).sum(2).sum(0) / (resized_mean.sum() + 1e-15)
                    if 'mean' not in feature_stat[layer]:
                        feature_stat[layer]['mean'] = mean_feature
                    else:
                        feature_stat[layer]['mean'] = (
                                processed * feature_mean[layer]['mean']
                                + processing * mean_feature) / (
                                        processed + processing)
                processed += processing
            # After summaries are done, also compute quantile stats
            for layer, stats in feature_stat.items():
                if self.quantiles.get(layer, None) is not None:
                    for statname in ['max', 'mean']:
                        stats['%s_quantile' % statname] = (
                            self.quantiles[layer].normalize(stats[statname]))
        return feature_stat

    def levels(self, layer, quantiles):
        return self.quantiles[layer].quantiles(quantiles)

    def feature_maps(self, z_batch, intervention=None, layers=None,
            quantiles=True):
        feature_map = defaultdict(list)
        with torch.no_grad(), self.modellock:
            batch_size = 10
            self.apply_intervention(intervention)
            test_loader = DataLoader(
                TensorDataset(z_batch[:,:,None,None]),
                batch_size=batch_size,
                pin_memory=('cuda' == self.device.type
                    and z_batch.device.type == 'cpu'))
            processed = 0
            for batch_num, [batch_z] in enumerate(test_loader):
                batch_z = batch_z.to(self.device)
                # Run model but disregard output
                self.model(batch_z)
                processing = batch_z.shape[0]
                for layer, feature in self.model.retained.items():
                    for single_featuremap in feature:
                        if quantiles:
                            feature_map[layer].append(self.quantiles[layer]
                                    .normalize(single_featuremap))
                        else:
                            feature_map[layer].append(single_featuremap)
        return feature_map

def load_quantile_if_present(outdir, filename, device):
    filepath = os.path.join(outdir, filename)
    if os.path.isfile(filepath):
        data = numpy.load(filepath)
        result = RunningQuantile(state=data)
        result.to(device)
        return result
    return None

if __name__ == '__main__':
    test_main()

