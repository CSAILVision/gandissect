import torch
from netdissect import sampler, runningstats, pbar

def conditional_samples(activations, segments):
    '''
    Transforms a batch of activations and segmentations into a
    sequence of conditional statistics, i.e., activations that
    are at the same location as the segmentation label.
    Both activations nad segments should be 4d tensors with
    the same sample, y, and x dimensions.  Segments can be
    a multilabel segmentation.  The zero segmentation value is
    assumed to be unused.

    Returns a generator for a sequence of (condition, (sample, unit)-tensor)
    listing every condition present in the segments, along with the
    set of activations overlapping that condition.  The activation tensor
    is 2d in (sample, unit) order, where sample is the number of samples
    with for the condition.
    '''
    channels = activations.shape[1]
    activations_by_channel = activations.permute(0, 2, 3, 1).contiguous()
    segcounts = segments.view(-1).bincount()
    conditions = (segcounts[1:].nonzero() + 1)[:, 0]
    def sample_generator():
        # First yield the full set of activations, unconditioned
        yield (0, activations_by_channel.view(-1, channels))
        # Then a set of activations for each condition present in the image
        for condition in conditions:
            mask = (segments == condition).max(1)[0][...,None]
            mask = mask.expand(activations_by_channel.shape)
            yield (condition.item(),
                    activations_by_channel[mask].view(-1, channels))
    return sample_generator()

def tally_topk(compute, dataset, sample_size=None, batch_size=10, k=100,
        **kwargs):
    '''
    Computes the topk statistics for a large data sample that can be
    computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        rtk = runningstats.RunningTopK(k=k)
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            rtk.add(sample)
        rtk.to_('cpu')
        return rtk

def tally_quantile(compute, dataset, sample_size=None, batch_size=10,
        resolution=2048, **kwargs):
    '''
    Computes quantile sketch statistics for a large data sample that can
    be computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        rq = runningstats.RunningQuantile()
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            rq.add(sample)
        rq.to_('cpu')
        return rq

def tally_conditional_quantile(compute, dataset,
        sample_size=None, batch_size=1, gpu_cache=64, resolution=2048,
        **kwargs):
    '''
    Computes conditional quantile sketches for a large data sample that
    can be computed from a dataset.  The compute function should return a
    sequence of sample batch tuples (condition, (sample, unit)-tensor),
    one for each condition relevant to the batch.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        cq = runningstats.RunningConditionalQuantile(resolution=resolution)
        most_common_conditions = set()
        for i, batch in enumerate(pbar(loader)):
            sample_set = call_compute(compute, batch)
            for cond, sample in sample_set:
                # Move uncommon conditional data to the cpu before collating.
                if cond not in most_common_conditions:
                    sample = sample.cpu()
                cq.add(cond, sample)
            # Move uncommon conditions off the GPU.
            if i and not i & (i - 1):  # if i is a power of 2:
                common_conditions = set(cq.most_common_conditions(gpu_cache))
                cq.to_('cpu', [k for k in cq.keys()
                        if k not in common_conditions])
        # At the end, move all to the CPU
        cq.to_('cpu')
        return cq

def tally_variance(compute, dataset, sample_size=None, batch_size=10, **kwargs):
    '''
    Computes unitwise mean and variance stats for a large data sample that
    can be computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        rv = runningstats.RunningVariance()
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            rv.add(sample)
        rv.to_('cpu')
        return rv

def tally_conditional_variance(compute, dataset,
        sample_size=None, batch_size=1, **kwargs):
    '''
    Computes conditional mean and variance for a large data sample that
    can be computed from a dataset.  The compute function should return a
    sequence of sample batch tuples (condition, (sample, unit)-tensor),
    one for each condition relevant to the batch.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        cv = runningstats.RunningConditionalVariance()
        for i, batch in enumerate(pbar(loader)):
            sample_set = call_compute(compute, batch)
            for cond, sample in sample_set:
                # Move uncommon conditional data to the cpu before collating.
                cv.add(cond, sample)
        # At the end, move all to the CPU
        cv.to_('cpu')
        return cv

def tally_bincount(compute, dataset, sample_size=None, batch_size=10,
        multi_label_axis=None, **kwargs):
    '''
    Computes bincount totals for a large data sample that can be
    computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        rbc = runningstats.RunningBincount()
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            if multi_label_axis:
                multilabel = sample.shape[multi_label_axis]
                size = sample.numel() // multilabel
            else:
                size = None
            rbc.add(sample, size=size)
        rbc.to_('cpu')
        return rbc

def tally_cat(compute, dataset, sample_size=None, batch_size=10,
        **kwargs):
    '''
    Computes a concatenated tensor for data batches that can be
    computed from a dataset.  The compute function should return
    a tensor that should be concatenated to the others along its
    first dimension.
    '''
    with torch.no_grad():
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        result = []
        for batch in pbar(loader):
            result.append(call_compute(compute, batch).cpu())
        return torch.cat(result)

def iou_from_conditional_quantile(condq, cutoff=0.95):
    '''
    Given a RunningConditionalQuantile, estimates all-pairs
    IoU statistics for all units and conditions at the specified
    quantile cutoff.
    '''
    uncond_size = condq.conditional(0).size()
    units = condq.conditional(0).depth
    iouscores = torch.zeros((units, max(condq.keys()) + 1))
    actlevel = condq.conditional(0).quantiles([cutoff])[:,0]
    for c in sorted(condq.keys()):
        if c == 0 or condq.conditional(c).batchcount <= 1:
            continue
        levelp = condq.conditional(c).normalize(actlevel)
        cp = float(condq.conditional(c).size()) / uncond_size
        iouscores[:,c] = cp * (1 - levelp) / (1 - cutoff + cp * levelp)
    return iouscores

def call_compute(compute, batch):
    '''Utility for passing a dataloader batch to a compute function.'''
    if isinstance(batch, list):
        return compute(*batch)
    elif isinstance(batch, dict):
        return compute(**batch)
    else:
        return compute(batch)

def make_loader(dataset, sample_size=None, batch_size=10, *kwargs):
    '''Utility for creating a dataloader on fixed sample subset.'''
    if isinstance(dataset, torch.Tensor):
        dataset = torch.utils.data.TensorDataset(dataset)
    return torch.utils.data.DataLoader(
            dataset,
            sampler=sampler.FixedSubsetSampler(
                    list(range(sample_size))) if sample_size else None,
            batch_size=batch_size,
            *kwargs)
