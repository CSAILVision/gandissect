'''
Utilities for instrumenting a torch model.

InstrumentedModel will wrap a pytorch model and allow hooking
arbitrary layers to monitor or modify their output directly.
'''

import torch, numpy, types
from collections import OrderedDict

class InstrumentedModel(torch.nn.Module):
    '''
    A wrapper for hooking, probing and intervening in pytorch Modules.
    Example usage:

    ```
    model = load_my_model()
    with inst as InstrumentedModel(model):
        inst.retain_layer(layername)
        inst.edit_layer(layername, 0.5, target_features)
        inst(inputs)
        original_features = inst.retained_layer(layername)
    ```
    '''

    def __init__(self, model):
        super(InstrumentedModel, self).__init__()
        self.model = model
        self._retained = OrderedDict()
        self._ablation = {}
        self._replacement = {}
        self._hooked_layer = {}
        self._old_forward = {}

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.close()

    def forward(self, *inputs, **kwargs):
        return self.model(*inputs, **kwargs)

    def retain_layer(self, layername):
        '''
        Pass a fully-qualified layer name (E.g., module.submodule.conv3)
        to hook that layer and retain its output each time the model is run.
        A pair (layername, aka) can be provided, and the aka will be used
        as the key for the retained value instead of the layername.
        '''
        self.retain_layers([layername])

    def retain_layers(self, layernames):
        '''
        Retains a list of a layers at once.
        '''
        self.add_hooks(layernames)
        for layername in layernames:
            aka = layername
            if not isinstance(aka, str):
                layername, aka = layername
            if aka not in self._retained:
                self._retained[aka] = None

    def retained_features(self):
        '''
        Returns a dict of all currently retained features.
        '''
        return OrderedDict(self._retained)

    def retained_layer(self, aka=None, clear=False):
        '''
        Retrieve retained data that was previously hooked by retain_layer.
        Call this after the model is run.  If clear is set, then the
        retained value will return and also cleared.
        '''
        if aka is None:
            # Default to the first retained layer.
            aka = next(self._retained.keys().__iter__())
        result = self._retained[aka]
        if clear:
            self._retained[aka] = None
        return result

    def edit_layer(self, layername, ablation=None, replacement=None):
        '''
        Pass a fully-qualified layer name (E.g., module.submodule.conv3)
        to hook that layer and modify its output each time the model is run.
        The output of the layer will be modified to be a convex combination
        of the replacement and x interpolated according to the ablation, i.e.:
        `output = x * (1 - a) + (r * a)`.
        '''
        if not isinstance(layername, str):
            layername, aka = layername
        else:
            aka = layername

        # The default ablation if a replacement is specified is 1.0.
        if ablation is None and replacement is not None:
            ablation = 1.0
        self.add_hooks([(layername, aka)])
        self._ablation[aka] = ablation
        self._replacement[aka] = replacement
        # If needed, could add an arbitrary postprocessing lambda here.

    def remove_edits(self, layername=None):
        '''
        Removes edits at the specified layer, or removes edits at all layers
        if no layer name is specified.
        '''
        if layername is None:
            self._ablation.clear()
            self._replacement.clear()
            return

        if not isinstance(layername, str):
            layername, aka = layername
        else:
            aka = layername
        if aka in self._ablation:
            del self._ablation[aka]
        if aka in self._replacement:
            del self._replacement[aka]

    def add_hooks(self, layernames):
        '''
        Sets up a set of layers to be hooked.

        Usually not called directly: use edit_layer or retain_layer instead.
        '''
        needed = set()
        aka_map = {}
        for name in layernames:
            aka = name
            if not isinstance(aka, str):
                name, aka = name
            if self._hooked_layer.get(aka, None) != name:
                aka_map[name] = aka
                needed.add(name)
        if not needed:
            return
        for name, layer in self.model.named_modules():
            if name in aka_map:
                needed.remove(name)
                aka = aka_map[name]
                self._hook_layer(layer, name, aka)
        for name in needed:
            raise ValueError('Layer %s not found in model' % name)

    def _hook_layer(self, layer, layername, aka):
        '''
        Internal method to replace a forward method with a closure that
        intercepts the call, and tracks the hook so that it can be reverted.
        '''
        if aka in self._hooked_layer:
            raise ValueError('Layer %s already hooked' % aka)
        if layername in self._old_forward:
            raise ValueError('Layer %s already hooked' % layername)
        self._hooked_layer[aka] = layername
        self._old_forward[layername] = (layer, aka,
                layer.__dict__.get('forward', None))
        editor = self
        original_forward = layer.forward
        def new_forward(self, *inputs, **kwargs):
            original_x = original_forward(*inputs, **kwargs)
            x = editor._postprocess_forward(original_x, aka)
            return x
        layer.forward = types.MethodType(new_forward, layer)

    def _unhook_layer(self, aka):
        '''
        Internal method to remove a hook, restoring the original forward method.
        '''
        if aka not in self._hooked_layer:
            return
        layername = self._hooked_layer[aka]
        layer, check, old_forward = self._old_forward[layername]
        assert check == aka
        if old_forward is None:
            if 'forward' in layer.__dict__:
                del layer.__dict__['forward']
        else:
            layer.forward = old_forward
        del self._old_forward[layername]
        del self._hooked_layer[aka]
        if aka in self._ablation:
            del self._ablation[aka]
        if aka in self._replacement:
            del self._replacement[aka]
        if aka in self._retained:
            del self._replacement[aka]

    def _postprocess_forward(self, x, aka):
        '''
        The internal method called by the hooked layers after they are run.
        '''
        # Retain output before edits, if desired.
        if aka in self._retained:
            self._retained[aka] = x.detach()
        # Apply any edits requested.
        a = make_matching_tensor(self._ablation, aka, x)
        if a is not None:
            x = x * (1 - a)
            v = make_matching_tensor(self._replacement, aka, x)
            if v is not None:
                x += (v * a)
        return x

    def close(self):
        '''
        Unhooks all hooked layers in the model.
        '''
        for aka in list(self._old_forward.keys()):
            self._unhook_layer(aka)
        assert len(self._old_forward) == 0


def make_matching_tensor(valuedict, name, data):
    '''
    Converts `valuedict[name]` to be a tensor with the same dtype, device,
    and dimension count as `data`, and caches the converted tensor.
    '''
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
        v = v.view((1,) + tuple(v.shape) +
                (1,) * (len(data.shape) - len(v.shape) - 1))
        valuedict[name] = v
    return v



###
# Older-style API below.
# TODO: replace usage of the old API calls with the safer version above.
###

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
