'''
Utilities for instrumenting a torch model.

InstrumentedModel will wrap a pytorch model and allow hooking
arbitrary layers to monitor or modify their output directly.
'''

import torch, numpy, types, copy
from collections import OrderedDict, defaultdict

class InstrumentedModel(torch.nn.Module):
    '''
    A wrapper for hooking, probing and intervening in pytorch Modules.
    Example usage:

    ```
    model = load_my_model()
    with inst as InstrumentedModel(model):
        inst.retain_layer(layername)
        inst.edit_layer(layername, ablation=0.5, replacement=target_features)
        inst(inputs)
        original_features = inst.retained_layer(layername)
    ```
    '''

    def __init__(self, model):
        super().__init__()
        self.model = model
        self._retained = OrderedDict()
        self._detach_retained = {}
        self._editargs = defaultdict(dict)
        self._editrule = {}
        self._hooked_layer = {}
        self._old_forward = {}
        if isinstance(model, torch.nn.Sequential):
            self._hook_sequential()

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.close()

    def forward(self, *inputs, **kwargs):
        return self.model(*inputs, **kwargs)

    def retain_layer(self, layername, detach=True):
        '''
        Pass a fully-qualified layer name (E.g., module.submodule.conv3)
        to hook that layer and retain its output each time the model is run.
        A pair (layername, aka) can be provided, and the aka will be used
        as the key for the retained value instead of the layername.
        '''
        self.retain_layers([layername], detach=detach)

    def retain_layers(self, layernames, detach=True):
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
                self._detach_retained[aka] = detach

    def stop_retaining_layers(self, layernames):
        '''
        Removes a list of layers from the set retained.
        '''
        self.add_hooks(layernames)
        for layername in layernames:
            aka = layername
            if not isinstance(aka, str):
                layername, aka = layername
            if aka in self._retained:
                del self._retained[aka]
                del self._detach_retained[aka]

    def retained_features(self, clear=False):
        '''
        Returns a dict of all currently retained features.
        '''
        result = OrderedDict(self._retained)
        if clear:
            for k in result:
                self._retained[k] = None
        return result

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

    def edit_layer(self, layername, rule=None, **kwargs):
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

        # The default editing rule is apply_ablation_replacement
        if rule is None:
            rule = apply_ablation_replacement

        self.add_hooks([(layername, aka)])
        self._editargs[aka].update(kwargs)
        self._editrule[aka] = rule

    def remove_edits(self, layername=None):
        '''
        Removes edits at the specified layer, or removes edits at all layers
        if no layer name is specified.
        '''
        if layername is None:
            self._editargs.clear()
            self._editrule.clear()
            return

        if not isinstance(layername, str):
            layername, aka = layername
        else:
            aka = layername
        if aka in self._editargs:
            del self._editargs[aka]
        if aka in self._editrule:
            del self._editrule[aka]

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
        # Remove any retained data and any edit rules
        if aka in self._retained:
            del self._retained[aka]
            del self._detach_retained[aka]
        self.remove_edits(aka)
        # Restore the unhooked method for the layer
        layer, check, old_forward = self._old_forward[layername]
        assert check == aka
        if old_forward is None:
            if 'forward' in layer.__dict__:
                del layer.__dict__['forward']
        else:
            layer.forward = old_forward
        del self._old_forward[layername]
        del self._hooked_layer[aka]

    def _postprocess_forward(self, x, aka):
        '''
        The internal method called by the hooked layers after they are run.
        '''
        # Retain output before edits, if desired.
        if aka in self._retained:
            if self._detach_retained[aka]:
                self._retained[aka] = x.detach()
            else:
                self._retained[aka] = x
        # Apply any edits requested.
        rule = self._editrule.get(aka, None)
        if rule is not None:
            x = rule(x, self, **(self._editargs[aka]))
        return x

    def _hook_sequential(self):
        '''
        Replaces 'forward' of sequential with a version that takes
        additional keyword arguments: layer allows a single layer to be run;
        first_layer and last_layer allow a subsequence of layers to be run.
        '''
        model = self.model
        self._hooked_layer['.'] = '.'
        self._old_forward['.'] = (model, '.',
                model.__dict__.get('forward', None))
        def new_forward(this, x, layer=None, first_layer=None, last_layer=None):
            assert layer is None or (first_layer is None and last_layer is None)
            first_layer, last_layer = [str(layer) if layer is not None
                    else str(d) if d is not None else None
                    for d in [first_layer, last_layer]]
            including_children = (first_layer is None)
            for name, layer in this._modules.items():
                if name == first_layer:
                    first_layer = None
                    including_children = True
                if including_children:
                    x = layer(x)
                if name == last_layer:
                    last_layer = None
                    including_children = False
            assert first_layer is None, '%s not found' % first_layer
            assert last_layer is None, '%s not found' % last_layer
            return x
        model.forward = types.MethodType(new_forward, model)

    def close(self):
        '''
        Unhooks all hooked layers in the model.
        '''
        for aka in list(self._old_forward.keys()):
            self._unhook_layer(aka)
        assert len(self._old_forward) == 0

def apply_ablation_replacement(x, imodel, **buffers):
    if buffers is not None:
        # Apply any edits requested.
        a = make_matching_tensor(buffers, 'ablation', x)
        if a is not None:
            x = x * (1 - a)
            v = make_matching_tensor(buffers, 'replacement', x)
            if v is not None:
                x += (v * a)
    return x

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

def subsequence(sequential, first_layer=None, last_layer=None,
            share_weights=False):
    '''
    Creates a subsequence of a pytorch Sequential model, copying over
    modules together with parameters for the subsequence.  Only
    modules from first_layer to last_layer (inclusive) are included.

    If share_weights is True, then references the original modules
    and their parameters without copying them.  Otherwise, by default,
    makes a separate brand-new copy.
    '''
    included_children = OrderedDict()
    including_children = (first_layer is None)
    for name, layer in sequential._modules.items():
        if name == first_layer:
            first_layer = None
            including_children = True
        if including_children:
            included_children[name] = layer if share_weights else (
                    copy.deepcopy(layer))
        if name == last_layer:
            last_layer = None
            including_children = False
    if first_layer is not None:
        raise ValueError('Layer %s not found' % first_layer)
    if last_layer is not None:
        raise ValueError('Layer %s not found' % last_layer)
    if not len(included_children):
        raise ValueError('Empty subsequence')
    return torch.nn.Sequential(OrderedDict(included_children))

