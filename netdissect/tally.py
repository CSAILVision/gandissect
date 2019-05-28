import torch
from netdissect import sampler, runningstats, pbar

def conditional_samples(activations, segments):
    '''
    Takes a set of activations and segmentations, both 4d tensors with
    the same spatial resultion.

    Returns a generator for a sequence of (condition, 2d-tensor),
    listing every condition present in the segments, along with the
    set of activations under that condition.  The activation tensor is
    in [sample, channel] order, where sample is the number of samples
    with for the condition.
    '''
    channels = activations.shape[1]
    activations_by_channel = activations.permute(0, 2, 3, 1).contiguous()
    conditions = (segments.view(-1).bincount()[1:].nonzero() + 1)[:, 0]
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

def tally_topk(compute, dataset, sample_size=None, batch_size=10, k=100):
    '''
    Pass a batch stats computation function and a dataset, and will
    tally up the top k for each.
    '''
    loader = torch.utils.data.DataLoader(dataset,
            sampler=sampler.FixedSubsetSampler(
                list(range(sample_size))) if sample_size else None,
            batch_size=batch_size)
    rtk = runningstats.RunningTopK(k=k)
    for batch in pbar(loader):
        sample = compute(batch)
        rtk.add(sample)
    rtk.to_('cpu')
    return rtk

def tally_quantile(compute, dataset, sample_size=None, batch_size=10,
        resolution=2048):
    '''
    Pass a batch stats computation function and a dataset, and will
    tally up estimated quantile stats for each of the computed features.

    The compute function should take a batch (as returned by a dataloder)
    and return a 2d tensor with axes (samplesize, featurenum).
    '''
    loader = torch.utils.data.DataLoader(dataset,
            sampler=sampler.FixedSubsetSampler(
                list(range(sample_size))) if sample_size else None,
            batch_size=batch_size)
    rq = runningstats.RunningQuantile()
    for batch in pbar(loader):
        sample = compute(batch)
        rq.add(sample)
    rq.to_('cpu')
    return rq

def tally_conditional_quantile(compute, dataset,
        sample_size=None, batch_size=1, gpu_cache=64, resolution=2048):
    '''
    Pass a batch stats computation function and a dataset, and will
    tally up estimated conditional quantile stats for each of the
    computed features, over all of the supplied conditions.

    The compute function should take a batch (as returned by a dataloder)
    and return a generator that returns an iteration over
    (condition, 2d-tensor) pairs, where condition is an arbitrary hashable
    indicating the condition being tested, and the tensor tensor contains
    features with axes (samplesize, featurenum).
    '''
    loader = torch.utils.data.DataLoader(dataset,
            sampler=sampler.FixedSubsetSampler(
                list(range(sample_size))) if sample_size else None,
            batch_size=batch_size)
    cq = runningstats.RunningConditionalQuantile(resolution=resolution)
    most_common_conditions = set()
    for i, batch in enumerate(pbar(loader)):
        sample_set = compute(batch)
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

def tally_variance(compute, dataset, sample_size=None, batch_size=10):
    '''
    Pass a batch stats computation function and a dataset, and will
    tally up estimated mean and variance for each of the computed features.
    '''
    loader = torch.utils.data.DataLoader(dataset,
            sampler=sampler.FixedSubsetSampler(
                list(range(sample_size))) if sample_size else None,
            batch_size=batch_size)
    rv = runningstats.RunningVariance()
    for batch in pbar(loader):
        sample = compute(batch)
        rv.add(sample)
    rv.to_('cpu')
    return rq

def tally_conditional_variance(compute, dataset,
        sample_size=None, batch_size=1):
    '''
    Pass a batch stats computation function and a dataset, and will
    tally up estimated conditional quantile stats for each of the
    computed features, over all of the supplied conditions.

    The compute function should take a batch (as returned by a dataloder)
    and return a generator that returns an iteration over
    (condition, 2d-tensor) pairs, where condition is an arbitrary hashable
    indicating the condition being tested, and the tensor tensor contains
    features with axes (samplesize, featurenum).
    '''
    loader = torch.utils.data.DataLoader(dataset,
            sampler=sampler.FixedSubsetSampler(
                list(range(sample_size))) if sample_size else None,
            batch_size=batch_size)
    cv = runningstats.RunningConditionalVariance()
    for i, batch in enumerate(pbar(loader)):
        sample_set = compute(batch)
        for cond, sample in sample_set:
            # Move uncommon conditional data to the cpu before collating.
            cv.add(cond, sample)
    # At the end, move all to the CPU
    cv.to_('cpu')
    return cv

def tally_bincount(compute, dataset, sample_size=None, batch_size=10,
        multi_label_axis=None):
    '''
    Pass a batch stats computation function and a dataset, and will
    tally up the top k for each.
    '''
    loader = torch.utils.data.DataLoader(dataset,
            sampler=sampler.FixedSubsetSampler(
                list(range(sample_size))) if sample_size else None,
            batch_size=batch_size)
    rbc = runningstats.RunningBincount()
    for batch in pbar(loader):
        sample = compute(batch)
        if multi_label_axis:
            multilabel = sample.shape[multi_label_axis]
            size = sample.numel() // multilabel
        else:
            size = None
        rbc.add(sample, size=size)
    rbc.to_('cpu')
    return rbc

