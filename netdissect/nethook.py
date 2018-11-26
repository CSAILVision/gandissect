'''
Utilities for instrumenting a torch model.

retain_layers(model, layer_names) will add a model.retained dictionary
with an entry for each layer.  Each time the model is run, the retained
dictionary will keep a detached copy of each specified layer's output.

edit_layers(model, layer_names) will add model.ablation and model.replacement
properties with an entry for each layer.  When the model is run, the
output of the specified layers will be blended with the contents of
model.replacement, at a (convex combination) rate specified by model.ablation.
'''

import torch, numpy, types

def retain_layer_output(dest, layer, name):
    '''Callback function to keep a reference to a layer's output in a dict.'''
    dest[name] = None
    def hook_fn(m, i, output):
        dest[name] = output.detach()
    layer.register_forward_hook(hook_fn)

def retain_layers(model, layer_names):
    '''
    Creates a 'retained' property on the model which will keep a record
    of the layer outputs for the specified layers.  Also computes the
    cumulative scale and offset for convolutions.

    The layer_names array should be a list of layer names, or tuples
    of (name, aka) where the name is the pytorch name for the layer,
    and the aka string is the name you wish to use for the dissection.
    '''
    model.retained = {}
    seen = set()
    sequence = []
    aka_map = {}
    for name in layer_names:
        aka = name
        if not isinstance(aka, str):
            name, aka = name
        aka_map[name] = aka
    for name, layer in model.named_modules():
        sequence.append(layer)
        if name in aka_map:
            seen.add(name)
            aka = aka_map[name]
            retain_layer_output(model.retained, layer, aka)
    for name in aka_map:
        assert name in seen, ('Layer %s not found' % name)

def edit_layer_output(alpha, value, layer, name):
    '''
    Overrides the forward method of the given layer, to replace the
    output with a convex combination of the output and the given value,
    as specified by the alpha mask.
    '''
    original_forward = layer.forward
    alpha[name] = None
    value[name] = None
    def new_forward(self, *inputs, **kwargs):
        original_x = original_forward(*inputs, **kwargs)
        x = original_x
        a = get_and_match_shape(alpha, name, x)
        v = get_and_match_shape(value, name, x)
        if a is not None:
            x = x * (1 - a)
            if v is not None:
                x += (v * a)
        return x
    layer.forward = types.MethodType(new_forward, layer)

def get_and_match_shape(valuedict, name, data):
    v = valuedict.get(name, None)
    if v is None:
        return None
    if not isinstance(v, torch.Tensor):
        # Accept non-torch data.
        v = torch.from_numpy(numpy.array(v))
        valuedict[name] = v
    if not v.device == data.device or not v.dtype == data.dtype:
        # Ensure device and type matches.
        assert not v.requires_grad, '%s wrong device or type' % (name)
        v = v.to(device=data.device, dtype=data.dtype)
        valuedict[name] = v
    if len(v.shape) < len(data.shape):
        # Ensure dimensions are unsqueezed as needed.
        assert not v.requires_grad, '%s wrong dimensions' % (name)
        v = v.view((1,) + tuple(v.shape) + (1,) * (3 - len(v.shape)))
        valuedict[name] = v
    if v.shape[1] < data.shape[1] and v.shape[1] > 1:
        # For the convenience of the caller, we will pad the
        # channel dimension with zeros if needed.
        v = torch.zeros((v.shape[0], data.shape[1],) + v.shape[2:],
                dtype=v.dtype, device=v.device)
        v[:, :v.shape[1]] = v
    if v.shape[2:] != data.shape[2:] and (v.shape[2] * v.shape[3] != 1):
        # Ensure shape is broadcastable.
        assert not v.requires_grad, '%s wrong shape' % (name)
        with torch.no_grad():
            v = torch.nn.functional.adaptive_max_pool2d(
                    v, (data.shape[2], data.shape[3]))
        valuedict[name] = v
    return v

def edit_layers(model, layer_names):
    '''
    Creates 'ablation' and 'replacement' properties on the model.
    The output of each layer is replaced by the convex combination
    of the actual output and the given replacement, where the weighting
    is given by the ablation mask (one for a full replacement, zero
    for the full original).  If the replacement is not given, it is
    assumed to be zero.

    The dimensions of ablation and replacement should match those of
    the layer that is being edited (channel, y, x).  If the channels
    are right but the dimensions do not match, the values will be
    resized via max pooling before being applied.
    '''
    model.ablation = {}
    model.replacement = {}
    seen = set()
    aka_map = {}
    for name in layer_names:
        aka = name
        if not isinstance(aka, str):
            name, aka = name
        aka_map[name] = aka
    for name, layer in model.named_modules():
        if name in aka_map:
            seen.add(name)
            aka = aka_map[name]
            edit_layer_output(model.ablation, model.replacement, layer, aka)
    for name in aka_map:
        assert name in seen, ('Layer %s not found' % name)

def clear_edit(model):
    for layer in model.ablation:
        model.ablation[layer] = None
        model.replacement[layer] = None
