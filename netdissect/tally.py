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

def tally_conditional_quantile(compute, dataset,
        sample_size=None, batch_size=50, gpu_cache=64, resolution=2048):
    samp = (sampler.FixedSubsetSampler(list(range(sample_size))) if sample_size
            else None)
    loader = torch.utils.data.DataLoader(
            dataset, sampler=samp, batch_size=batch_size)
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
            cq.to_('cpu', [k for k in cq.running_quantiles.keys()
                    if k not in common_conditions])
    # At the end, move all to the CPU
    cq.to_('cpu', cq.running_quantiles.keys())
    return cq
