import numbers
import torch
from netdissect.autoeval import autoimport_eval
from netdissect.progress import print_progress
from netdissect.nethook import retain_layers, edit_layers
from netdissect.easydict import EasyDict

def create_instrumented_model(args, **kwargs):
    '''
    Creates an instrumented model out of a namespace of arguments that
    correspond to ArgumentParser command-line args:
      model: a string to evaluate as a constructor for the model.
      pthfile: (optional) filename of .pth file for the model.
      layers: a list of layers to instrument, defaulted if not provided.
      edit: True to instrument the layers for editing.
      gen: True for a generator model.  One-pixel input assumed.
      imgsize: For non-generator models, (y, x) dimensions for RGB input.
      cuda: True to use CUDA.
  
    The constructed model will be decorated with the following attributes:
      input_shape: (usually 4d) tensor shape for single-image input.
      output_shape: 4d tensor shape for output.
      feature_shape: map of layer names to 4d tensor shape for featuremaps.
      retained: map of layernames to tensors, filled after every evaluation.
      ablation: if editing, map of layernames to [0..1] alpha values to fill.
      replacement: if editing, map of layernames to values to fill.

    When editing, the feature value x will be replaced by:
        `x = (replacement * ablation) + (x * (1 - ablation))`
    '''

    args = EasyDict(vars(args), **kwargs)

    # Construct the network
    if args.model is None:
        print_progress('No model specified')
        return None
    if isinstance(args.model, torch.nn.Module):
        model = args.model
    else:
        model = autoimport_eval(args.model)
    # Unwrap any DataParallel-wrapped model
    if isinstance(model, torch.nn.DataParallel):
        model = next(model.children())

    # Load its state dict
    meta = {}
    if getattr(args, 'pthfile', None) is not None:
        data = torch.load(args.pthfile)
        if 'state_dict' in data:
            meta = {}
            for key in data:
                if isinstance(data[key], numbers.Number):
                    meta[key] = data[key]
            data = data['state_dict']
        model.load_state_dict(data)
    model.meta = meta

    # Decide which layers to instrument.
    if getattr(args, 'layer', None) is not None:
        args.layers = [args.layer]
    if getattr(args, 'layers', None) is None:
        # Skip wrappers with only one named model
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

    # Instrument the layers.
    retain_layers(model, args.layers)
    if getattr(args, 'edit', False):
        edit_layers(model, args.layers)
    model.eval()
    if args.cuda:
        model.cuda()

    # Annotate input, output, and feature shapes
    annotate_model_shapes(model,
            gen=getattr(args, 'gen', False),
            imgsize=getattr(args, 'imgsize', None))
    return model

def annotate_model_shapes(model, gen=False, imgsize=None):
    assert (imgsize is not None) or gen

    # Figure the input shape.
    if gen:
        # We can guess a generator's input shape by looking at the model.
        # Examine first conv in model to determine input feature size.
        first_layer = [c for c in model.modules()
                if isinstance(c, (torch.nn.Conv2d, torch.nn.ConvTranspose2d,
                    torch.nn.Linear))][0]
        # 4d input if convolutional, 2d input if first layer is linear.
        if isinstance(first_layer, (torch.nn.Conv2d, torch.nn.ConvTranspose2d)):
            input_shape = (1, first_layer.in_channels, 1, 1)
        else:
            input_shape = (1, first_layer.in_features)
    else:
        # For a classifier, the input image shape is given as an argument.
        input_shape = (1, 3) + tuple(imgsize)

    # Run the model once to observe feature shapes.
    device = next(model.parameters()).device
    dry_run = torch.zeros(input_shape).to(device)
    with torch.no_grad():
        output = model(dry_run)

    # Annotate shapes.
    model.input_shape = input_shape
    model.feature_shape = { layer: model.retained[layer].shape
            for layer in model.retained }
    model.output_shape = output.shape
    return model
