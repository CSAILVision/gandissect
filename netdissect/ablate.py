import torch, sys, os, argparse, textwrap, numbers, numpy, json, PIL
from torchvision import transforms
from torch.utils.data import TensorDataset
from netdissect.progress import default_progress, post_progress, desc_progress
from netdissect.progress import verbose_progress, print_progress
from netdissect.nethook import edit_layers
from netdissect.gandissect import standard_z_sample, GanImageSegmenter
from netdissect.autoeval import autoimport_eval
from netdissect.easydict import EasyDict

help_epilog = '''\
Example:

python -m netdissect.ablation \
      --segmenter "netdissect.GanImageSegmenter(segvocab='lowres', segsizes=[160,288], segdiv='quad')" \
      --model "proggan.from_pth_file('models/lsun_models/${SCENE}_lsun.pth')" \
      --outdir dissect/dissectdir \
      --classes mirror coffeetable tree \
      --layers layer1 layer2 layer3 layer4 layer5 layer6 layer7 layer8 \
              layer9 layer10 \
      --size 1000

Output layout:
dissectdir/layer5/ablation/mirror-iqr.json
{ class: "mirror",
  classnum: 43,
  pixel_total: 41342300,
  class_pixels: 1234531,
  layer: "layer5",
  ranking: "mirror-iqr",
  ablation_units: [341, 23, 12, 142, 83, ...]
  ablation_pixels: [143242, 132344, 429931, ...]
}

'''

def main():
    # Training settings
    def strpair(arg):
        p = tuple(arg.split(':'))
        if len(p) == 1:
            p = p + p
        return p

    parser = argparse.ArgumentParser(description='Net dissect utility',
            epilog=textwrap.dedent(help_epilog),
            formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--model', type=str, default=None,
                        help='constructor for the model to test')
    parser.add_argument('--pthfile', type=str, default=None,
                        help='filename of .pth file for the model')
    parser.add_argument('--outdir', type=str, default='dissect',
                        help='directory for dissection output')
    parser.add_argument('--layers', type=strpair, nargs='+',
                        help='space-separated list of layer names to edit' + 
                        ', in the form layername[:reportedname]')
    parser.add_argument('--classes', type=str, nargs='+',
                        help='space-separated list of class names to ablate')
    parser.add_argument('--metric', type=str, default='iou',
                        help='ordering metric for selecting units')
    parser.add_argument('--startcount', type=int, default=1,
                        help='number of units to ablate')
    parser.add_argument('--unitcount', type=int, default=30,
                        help='number of units to ablate')
    parser.add_argument('--segmenter', type=str, default='dataset/broden',
                        help='directory containing segmentation dataset')
    parser.add_argument('--netname', type=str, default=None,
                        help='name for network in generated reports')
    parser.add_argument('--batch_size', type=int, default=5,
                        help='batch size for forward pass')
    parser.add_argument('--size', type=int, default=1000,
                        help='number of images to test')
    parser.add_argument('--no-cuda', action='store_true', default=False,
                        help='disables CUDA usage')
    parser.add_argument('--quiet', action='store_true', default=False,
                        help='silences console output')
    if len(sys.argv) == 1:
        parser.print_usage(sys.stderr)
        sys.exit(1)
    args = parser.parse_args()

    # Set up console output
    verbose_progress(not args.quiet)

    # Speed up pytorch
    torch.backends.cudnn.benchmark = True

    # Construct the network
    if args.model is None:
        print_progress('No model specified')
        sys.exit(1)

    # Set up CUDA
    args.cuda = not args.no_cuda and torch.cuda.is_available()
    if args.cuda:
        torch.backends.cudnn.benchmark = True

    model = autoimport_eval(args.model)
    # Unwrap any DataParallel-wrapped model
    if isinstance(model, torch.nn.DataParallel):
        model = next(model.children())

    # Load its state dict
    meta = {}
    if args.pthfile is None:
        print_progress('Dissecting model without pth file.')
    else:
        data = torch.load(args.pthfile)
        if 'state_dict' in data:
            meta = {}
            for key in data:
                if isinstance(data[key], numbers.Number):
                    meta[key] = data[key]
            data = data['state_dict']
        model.load_state_dict(data)

    # Instrument it and prepare it for eval
    if not args.layers:
        # Skip wrappers with only one named modele
        container = model
        prefix = ''
        while len(list(container.named_children())) == 1:
            name, container = next(container.named_children())
            prefix += name + '.'
        # Default to all nontrivial top-level layers except last.
        args.layers = [prefix + name
                for name, module in container.named_children()
                if type(module).__module__ not in [
                    # Skip ReLU and other activations.
                    'torch.nn.modules.activation',
                    # Skip pooling layers.
                    'torch.nn.modules.pooling']
                ][:-1]
        print_progress('Defaulting to layers: %s' % ' '.join(args.layers))
    edit_layers(model, args.layers)
    model.eval()
    if args.cuda:
        model.cuda()

    # Set up the output directory, verify write access
    if args.outdir is None:
        args.outdir = os.path.join('dissect', type(model).__name__)
        print_progress('Writing output into %s.' % args.outdir)
    os.makedirs(args.outdir, exist_ok=True)
    train_dataset = None

    # Examine first conv in model to determine input feature size.
    first_layer = [c for c in model.modules()
            if isinstance(c, (torch.nn.Conv2d, torch.nn.ConvTranspose2d,
                torch.nn.Linear))][0]
    # 4d input if convolutional, 2d input if first layer is linear.
    if isinstance(first_layer, (torch.nn.Conv2d, torch.nn.ConvTranspose2d)):
        sample = standard_z_sample(
                args.size, first_layer.in_channels)[:,:,None,None]
        train_sample = standard_z_sample(
                args.size, first_layer.in_channels, seed=2)[:,:,None,None]
    else:
        sample = standard_z_sample(args.size, first_layer.in_features)
        train_sample = standard_z_sample(args.size, first_layer.in_features,
                seed=2)
    dataset = TensorDataset(sample)
    train_dataset = TensorDataset(train_sample)
    recovery = autoimport_eval(args.segmenter)

    # Now do the actual work.
    device = next(model.parameters()).device
    labelnames, catnames = (
                recovery.get_label_and_category_names(dataset))
    label_category = [catnames.index(c) for l, c in labelnames]
    labelnum_from_name = {n[0]: i for i, n in enumerate(labelnames)}

    segloader = torch.utils.data.DataLoader(dataset,
                batch_size=args.batch_size, num_workers=10,
                pin_memory=(device.type == 'cuda'))

    with open(os.path.join(args.outdir, 'dissect.json'), 'r') as f:
        dissect = EasyDict(json.load(f))

    # Index the dissection layers by layer name.
    dissect_layer = {lrec.layer: lrec for lrec in dissect.layers}

    # First, collect a baseline
    for l in model.ablation:
        model.ablation[l] = None
    baseline = count_segments(recovery, segloader, model)

    # For each sort-order, do an ablation
    progress = default_progress()
    for classname in progress(args.classes):
        post_progress(c=classname)
        for layername in progress(model.ablation):
            post_progress(l=layername)
            rankname = '%s-%s' % (classname, args.metric)
            measurements = {}
            classnum = labelnum_from_name[classname]
            try:
                ranking = next(r for r in dissect_layer[layername].rankings
                        if r.name == rankname)
            except:
                print('%s not found' % rankname)
                sys.exit(1)
            ordering = numpy.argsort(ranking.score)
            # Check if already done
            ablationdir = os.path.join(args.outdir, layername, 'ablation')
            if os.path.isfile(os.path.join(ablationdir, '%s.json'%rankname)):
                with open(os.path.join(ablationdir, '%s.json'%rankname)) as f:
                    data = EasyDict(json.load(f))
                # If the unit ordering is not the same, something is wrong
                if not all(a == o
                        for a, o in zip(data.ablation_units, ordering)):
                    import pdb; pdb.set_trace();
                    continue
                if len(data.ablation_effects) >= args.unitcount:
                    continue # file already done.
                measurements = data.ablation_effects
            for count in progress(range(args.startcount,
                     min(args.unitcount, len(ordering))+1), desc='units'):
                if str(count) in measurements:
                    continue
                ablation = numpy.zeros(len(ranking.score), dtype='float32')
                ablation[ordering[:count]] = 1
                for l in model.ablation:
                    model.ablation[l] = ablation if layername == l else None
                m = count_segments(recovery, segloader, model)[classnum].item()
                print_progress('%s %s %d units (#%d), %g -> %g' %
                        (layername, rankname, count,
                            ordering[count - 1].item(),
                            baseline[classnum].item(), m))
                measurements[str(count)] = m
            os.makedirs(ablationdir, exist_ok=True)
            with open(os.path.join(ablationdir, '%s.json'%rankname), 'w') as f:
                json.dump(dict(
                    classname=classname,
                    classnum=classnum,
                    baseline=baseline[classnum].item(),
                    layer=layername,
                    metric=args.metric,
                    ablation_units=ordering.tolist(),
                    ablation_effects=measurements), f)

def count_segments(recovery, loader, model):
    total_bincount = 0
    data_size = 0
    progress = default_progress()
    for i, batch in enumerate(progress(loader)):
        im, seg, batch_label_counts, features, scale_offset_map = (
                recovery.recover_im_seg_bc_and_features(
                    batch, model))
        data_size += seg.shape[0] * seg.shape[2] * seg.shape[3]
        total_bincount += batch_label_counts.float().sum(0)
    normalized_bincount = total_bincount / data_size
    return normalized_bincount

# Many models use this normalization.
IMAGE_MEAN = [0.485, 0.456, 0.406]
IMAGE_STDEV = [0.229, 0.224, 0.225]

if __name__ == '__main__':
    main()
