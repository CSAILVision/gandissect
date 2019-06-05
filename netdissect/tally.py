'''
Batchwise tally functions, analogous to tensor.topk, mean+variance,
bincount, covaraince, and sort (for quantiles), implemented in a way
that permits fast computation of statistics over large data sets that
do not fit in memory at once.

These functions are useful because, while many statistics are much
cheaper to compute on the GPU than on the CPU, they may require too
much memory to compute all at once.  Instead the statistics need
to be computed in a running fashion, one batch at a time, and
accumulated in a way that economizes GPU memory.

Use the tally functions by passing a batch computation function and
an underlying dataset.  A DataLoader will be created, and then the
function will be called to compute samples of data to tally.

Underlying running statistics algorithms are implemented in the
runningstats package.
'''
import torch, numpy, os
from netdissect import sampler, runningstats, pbar
import warnings

def tally_topk(compute, dataset, sample_size=None, batch_size=10, k=100,
        cachefile=None, **kwargs):
    '''
    Computes the topk statistics for a large data sample that can be
    computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.

    k specifies the number of top samples to retain.
    Results are returned as a RunningTopK object.
    '''
    with torch.no_grad():
        args = dict(sample_size=sample_size, k=k)
        cached_state = load_cached_state(cachefile, args)
        if cached_state is not None:
            return runningstats.RunningTopK(state=cached_state)
        rtk = runningstats.RunningTopK(k=k)
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            rtk.add(sample)
        rtk.to_('cpu')
        save_cached_state(cachefile, rtk, args)
        return rtk

def tally_quantile(compute, dataset, sample_size=None, batch_size=10,
        r=4096, cachefile=None, **kwargs):
    '''
    Computes quantile sketch statistics for a large data sample that can
    be computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.

    The underlying quantile sketch is an optimal KLL sorted sampler that
    retains at least r samples (where r is the specified resolution).
    '''
    with torch.no_grad():
        args = dict(sample_size=sample_size, r=r)
        cached_state = load_cached_state(cachefile, args)
        if cached_state is not None:
            return runningstats.RunningQuantile(state=cached_state)
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        rq = runningstats.RunningQuantile()
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            rq.add(sample)
        rq.to_('cpu')
        save_cached_state(cachefile, rq, args)
        return rq

def tally_conditional_quantile(compute, dataset,
        sample_size=None, batch_size=1, gpu_cache=64, r=1024,
        cachefile=None, **kwargs):
    '''
    Computes conditional quantile sketches for a large data sample that
    can be computed from a dataset.  The compute function should return a
    sequence of sample batch tuples (condition, (sample, unit)-tensor),
    one for each condition relevant to the batch.
    '''
    with torch.no_grad():
        args = dict(sample_size=sample_size, r=r)
        cached_state = load_cached_state(cachefile, args)
        if cached_state is not None:
            return runningstats.RunningConditionalQuantile(state=cached_state)
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        cq = runningstats.RunningConditionalQuantile(r=r)
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
        save_cached_state(cachefile, cq, args)
        return cq

def conditional_samples(activations, segments):
    '''
    Helper function when defining generators for *_conditional tallies.
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

def tally_mean(compute, dataset, sample_size=None, batch_size=10,
        cachefile=None, **kwargs):
    '''
    Computes unitwise mean and variance stats for a large data sample that
    can be computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.
    '''
    with torch.no_grad():
        args = dict(sample_size=sample_size)
        cached_state = load_cached_state(cachefile, args)
        if cached_state is not None:
            return runningstats.RunningVariance(state=cached_state)
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        rv = runningstats.RunningVariance()
        for batch in pbar(loader):
            sample = call_compute(compute, batch)
            rv.add(sample)
        rv.to_('cpu')
        save_cached_state(cachefile, rv, args)
        return rv

def tally_conditional_mean(compute, dataset,
        sample_size=None, batch_size=1, cachefile=None, **kwargs):
    '''
    Computes conditional mean and variance for a large data sample that
    can be computed from a dataset.  The compute function should return a
    sequence of sample batch tuples (condition, (sample, unit)-tensor),
    one for each condition relevant to the batch.
    '''
    with torch.no_grad():
        args = dict(sample_size=sample_size)
        cached_state = load_cached_state(cachefile, args)
        if cached_state is not None:
            return runningstats.RunningConditionalVariance(state=cached_state)
        loader = make_loader(dataset, sample_size, batch_size, **kwargs)
        cv = runningstats.RunningConditionalVariance()
        for i, batch in enumerate(pbar(loader)):
            sample_set = call_compute(compute, batch)
            for cond, sample in sample_set:
                # Move uncommon conditional data to the cpu before collating.
                cv.add(cond, sample)
        # At the end, move all to the CPU
        cv.to_('cpu')
        save_cached_state(cachefile, cv, args)
        return cv

def tally_bincount(compute, dataset, sample_size=None, batch_size=10,
        multi_label_axis=None, cachefile=None, **kwargs):
    '''
    Computes bincount totals for a large data sample that can be
    computed from a dataset.  The compute function should return one
    batch of samples as a (sample, unit)-dimension tensor.
    '''
    with torch.no_grad():
        args = dict(sample_size=sample_size)
        cached_state = load_cached_state(cachefile, args)
        if cached_state is not None:
            return runningstats.RunningBincount(state=cached_state)
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
        save_cached_state(cachefile, rbc, args)
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

def iou_from_conditional_indicator_mean(condmv, cutoff=0.99, min_batches=2):
    '''
    Given a RunningConditionalVariance containing mean values of
    indictors, estimates all-pairs IoU statistics for all units
    between the conditions and the indicators.
    The result is a tensor of dimension (units, conditions)
    containing IoU estimates for each combination.

    Conditions that are sampled in fewer than min_batches are given IoU 0.
    '''
    uncond_size = condmv.conditional(0).size()
    units = condmv.conditional(0).depth
    scores = torch.zeros((units, max(condmv.keys()) + 1))
    # math: actlevel = level such that p(x > level) = cutoff
    actlevel = condq.conditional(0).quantiles(cutoff)
    # use a progress bar if it's going to be more than a few seconds.
    prog = pbar if scores.numel() > 1e8 else lambda x: x
    for c in prog(sorted(condmv.keys())):
        rmv = condmv.conditional(c)
        if c == 0 or rmv.batchcount < min_batches:
            continue
        # math: condp = p(x > actlevel | cond)
        condp = rmv.mean()
        truth = float(rmv.size()) / uncond_size
        isect = truth * (1 - condp)
        pred = (1 - cutoff)
        union = pred + truth - isect
        # Compute relative mutual information directly.
        arr = torch.stack([
            isect,         pred - isect,
            truth - isect, 1 - union]).view((2, 2) + isect.shape)
        scores[:,c,...] = intersection_over_union(arr)

def iou_from_conditional_quantile(condq, cutoff=0.95, min_batches=2):
    '''
    Given a RunningConditionalQuantile, estimates all-pairs
    IoU statistics for all units and conditions at the specified
    quantile cutoff.  Note that cutoff can be a list of cutoffs.
    The result is a tensor of dimension (units, conditions, cutoffs)
    containing IoU estimates for each combination.

    Conditions that are sampled in fewer than min_batches are given IoU 0.
    '''
    return intersection_from_conditional_quantile(condq,
            statistic=intersection_over_union,
            cutoff=cutoff, min_batches=min_batches)

def iqr_from_conditional_quantile(condq, cutoff=0.95, min_batches=2):
    '''
    Given a RunningConditionalQuantile, estimates all-pairs
    IQR statistics for all units and conditions at the specified
    quantile cutoff.  Similar to iou_from_conditional_quantile.
    '''
    return intersection_from_conditional_quantile(condq,
            statistic=information_quality_ratio,
            cutoff=cutoff, min_batches=min_batches)

def mi_from_conditional_quantile(condq, cutoff=0.95, min_batches=2):
    '''
    Given a RunningConditionalQuantile, estimates all-pairs
    mutual information for all units and conditions at the specified
    quantile cutoff.  Similar to iou_from_conditional_quantile.
    '''
    return intersection_from_conditional_quantile(condq,
            statistic=mutual_information,
            cutoff=cutoff, min_batches=min_batches)

def intersection_from_conditional_quantile(
        condq, statistic=lambda x: x[0,0], cutoff=0.95, min_batches=2):
    '''
    There are a variety of ways of scoring the intersection between a
    prediction (a) and a true variable (b) that are all expressions of
    [[p(a&b), p(a&!b)], [p(!a&b), p(!a&!b)]].  This computes any of
    them by passing the above array to a 'statistic' function.
    By default it returns p(a&b).
    '''
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', UserWarning)
        cutoff = torch.tensor(cutoff)
    uncond_size = condq.conditional(0).size()
    units = condq.conditional(0).depth
    scores = torch.zeros((units, max(condq.keys()) + 1) + cutoff.shape)
    # math: actlevel = level such that p(x > level) = cutoff
    actlevel = condq.conditional(0).quantiles(cutoff)
    # use a progress bar if it's going to be more than a few seconds.
    prog = pbar if cutoff.numel() * units > 1e5 else lambda x: x
    for c in prog(sorted(condq.keys())):
        rq = condq.conditional(c)
        if c == 0 or rq.batchcount < min_batches:
            continue
        # math: condp = p(x > actlevel | cond)
        condp = rq.normalize(actlevel)
        truth = float(rq.size()) / uncond_size
        isect = truth * (1 - condp)
        pred = (1 - cutoff)
        union = pred + truth - isect
        # Compute relative mutual information directly.
        arr = torch.stack([
            isect,         pred - isect,
            truth - isect, 1 - union]).view((2, 2) + isect.shape)
        scores[:,c,...] = statistic(arr)
    return scores

def intersection_over_union(arr):
    return arr[0,0] / (1 - arr[1,1])

def mutual_information(arr):
    total = 0
    for j in range(arr.shape[0]):
        for k in range(arr.shape[1]):
            joint = arr[j,k]
            ind = arr[j,:].sum(dim=0) * arr[:,k].sum(dim=0)
            term = joint * (joint / ind).log()
            term[torch.isnan(term)] = 0
            total += term
    return total.clamp_(0)

def joint_entropy(arr):
    total = 0
    for j in range(arr.shape[0]):
        for k in range(arr.shape[1]):
            joint = arr[j,k]
            term = joint * joint.log()
            term[torch.isnan(term)] = 0
            total += term
    return (-total).clamp_(0)

def information_quality_ratio(arr):
    iqr = mutual_information(arr) / joint_entropy(arr)
    iqr[torch.isnan(iqr)] = 0
    return iqr

def call_compute(compute, batch):
    '''Utility for passing a dataloader batch to a compute function.'''
    if isinstance(batch, list):
        return compute(*batch)
    elif isinstance(batch, dict):
        return compute(**batch)
    else:
        return compute(batch)

def make_loader(dataset, sample_size=None, batch_size=10, **kwargs):
    '''Utility for creating a dataloader on fixed sample subset.'''
    if isinstance(dataset, torch.Tensor):
        dataset = torch.utils.data.TensorDataset(dataset)
    if sample_size is not None:
        assert sample_size <= len(dataset)
    return torch.utils.data.DataLoader(
            dataset,
            sampler=sampler.FixedSubsetSampler(
                    list(range(sample_size))) if sample_size else None,
            batch_size=batch_size,
            **kwargs)

def load_cached_state(cachefile, args):
    if cachefile is None:
        return None
    try:
        dat = numpy.load(cachefile, allow_pickle=True)
        for a, v in args.items():
            if a not in dat or dat[a] != v:
                pbar.print('%s %s changed from %s to %s' % (
                    cachefile, a, dat[a], v))
                return None
    except:
        return None
    else:
        pbar.print('Loading cached %s' % cachefile)
        return dat

def save_cached_state(cachefile, obj, args):
    if cachefile is None:
        return
    dat = obj.state_dict()
    for a, v in args.items():
        if a in dat:
            assert(dat[a] == v)
        dat[a] = v
    numpy.savez(cachefile, **dat)
