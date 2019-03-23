import torch, argparse, sys, os, numpy
from netdissect.sampler import FixedRandomSubsetSampler, FixedSubsetSampler
from torch.utils.data import DataLoader
from torchvision import transforms
from netdissect.progress import default_progress, verbose_progress
from netdissect import zdataset
from netdissect import segmenter
from netdissect import frechet_distance
from netdissect import parallelfolder

NUM_OBJECTS=336

def main():
    parser = argparse.ArgumentParser(description='Net dissect utility',
            prog='python -m netdissect.fsd')
    parser.add_argument('directory1')
    parser.add_argument('directory2')
    parser.add_argument('--size', type=int, default=10000)
    if len(sys.argv) == 1:
        parser.print_usage(sys.stderr)
        sys.exit(1)
    args = parser.parse_args()
    if len(sys.argv) != 3:
        parser.print_usage(sys.stderr)
        sys.exit(1)
    verbose_progress(True)
    directory1, directory2 = args.directory1, args.directory2
    t1, t2 = [cached_tally_directory(d, size=args.size)
            for d in [directory1, directory2]]
    fsd, meandiff, covdiff = frechet_distance.sample_frechet_distance(
            t1 * 100, t2 * 100, return_components=True)
    print('fsd: %f; meandiff: %f; covdiff: %f' % (fsd, meandiff, covdiff))

def cached_tally_directory(directory, size=10000):
    filename = '%s_segtally_%d.npy' % (directory, size)
    if os.path.isfile(filename):
        return numpy.load(filename)
    result = tally_directory(directory, size)
    numpy.save(filename, result)
    return result

def tally_directory(directory, size=10000):
    progress = default_progress()
    dataset = parallelfolder.ParallelImageFolders(
                [directory],
                transform=transforms.Compose([
                    transforms.Resize(256),
                    transforms.CenterCrop(256),
                    transforms.ToTensor(),
                    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
                    ]))
    loader = DataLoader(dataset,
                        sampler=FixedRandomSubsetSampler(dataset, end=size),
                        # sampler=FixedSubsetSampler(range(size)),
                        batch_size=10, pin_memory=True)
    upp = segmenter.UnifiedParsingSegmenter()
    labelnames, catnames = upp.get_label_and_category_names()
    result = numpy.zeros((size, NUM_OBJECTS), dtype=numpy.float)
    batch_result = torch.zeros(loader.batch_size, NUM_OBJECTS,
            dtype=torch.float).cuda()
    with torch.no_grad():
        batch_index = 0
        for [batch] in progress(loader):
            seg_result = upp.segment_batch(batch.cuda())
            for i in range(len(batch)):
                batch_result[i] = (
                    seg_result[i,0].view(-1).bincount(
                        minlength=NUM_OBJECTS).float()
                    / (seg_result.shape[2] * seg_result.shape[3])
                )
            result[batch_index:batch_index+len(batch)] = (
                    batch_result.cpu().numpy())
            batch_index += len(batch)
    return result

def tally_dataset_objects(dataset, size=10000):
    progress = default_progress()
    loader = DataLoader(dataset,
                        sampler=FixedRandomSubsetSampler(dataset, end=size),
                        batch_size=10, pin_memory=True)
    upp = segmenter.UnifiedParsingSegmenter()
    labelnames, catnames = upp.get_label_and_category_names()
    result = numpy.zeros((size, NUM_OBJECTS), dtype=numpy.float)
    batch_result = torch.zeros(loader.batch_size, NUM_OBJECTS,
            dtype=torch.float).cuda()
    with torch.no_grad():
        batch_index = 0
        for [batch] in progress(loader):
            seg_result = upp.segment_batch(batch.cuda())
            for i in range(len(batch)):
                batch_result[i] = (
                    seg_result[i,0].view(-1).bincount(
                        minlength=NUM_OBJECTS).float()
                    / (seg_result.shape[2] * seg_result.shape[3])
                )
            result[batch_index:batch_index+len(batch)] = (
                    batch_result.cpu().numpy())
            batch_index += len(batch)
    return result

def tally_generated_objects(model, size=10000):
    progress = default_progress()
    zds = zdataset.z_dataset_for_model(model, size)
    loader = DataLoader(zds, batch_size=10, pin_memory=True)
    upp = segmenter.UnifiedParsingSegmenter()
    labelnames, catnames = upp.get_label_and_category_names()
    result = numpy.zeros((size, NUM_OBJECTS), dtype=numpy.float)
    batch_result = torch.zeros(loader.batch_size, NUM_OBJECTS,
            dtype=torch.float).cuda()
    with torch.no_grad():
        batch_index = 0
        for [zbatch] in progress(loader):
            img = model(zbatch.cuda())
            seg_result = upp.segment_batch(img)
            for i in range(len(zbatch)):
                batch_result[i] = (
                    seg_result[i,0].view(-1).bincount(
                        minlength=NUM_OBJECTS).float()
                    / (seg_result.shape[2] * seg_result.shape[3])
                    )
            result[batch_index:batch_index+len(zbatch)] = (
                    batch_result.cpu().numpy())
            batch_index += len(zbatch)
    return result

if __name__ == '__main__':
    main()
