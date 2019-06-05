'''
Utilities for showing progress bars, controlling default verbosity, etc.
'''

# If the tqdm package is not available, then do not show progress bars;
# just connect print_progress to print.
import sys, types
try:
    from tqdm import tqdm, tqdm_notebook
except:
    tqdm = None

default_verbosity = True
next_description = None

def verbose(verbose):
    '''
    Sets default verbosity level.  Set to True to see progress bars.
    '''
    global default_verbosity
    default_verbosity = verbose

def post(**kwargs):
    '''
    When within a progress loop, pbar.post(k=str) will display
    the given k=str status on the right-hand-side of the progress
    status bar.  If not within a visible progress bar, does nothing.
    '''
    innermost = innermost_tqdm()
    if innermost:
        innermost.set_postfix(**kwargs)

def desc(desc):
    '''
    When within a progress loop, pbar.desc(str) changes the
    left-hand-side description of the loop toe the given description.
    '''
    innermost = innermost_tqdm()
    if innermost:
        innermost.set_description(str(desc))

def descnext(desc):
    '''
    Called before starting a progress loop, pbar.descnext(str)
    sets the description text that will be used in the following loop.
    '''
    global next_description
    if not default_verbosity or tqdm is None:
        return
    next_description = desc

def print(*args):
    '''
    When within a progress loop, will print above the progress loop.
    '''
    if default_verbosity:
        msg = ' '.join(str(s) for s in args)
        if tqdm is None:
            print(msg)
        else:
            tqdm.write(msg)

def tqdm_terminal(it, *args, **kwargs):
    '''
    Some settings for tqdm that make it run better in resizable terminals.
    '''
    return tqdm(it, *args, dynamic_ncols=True, ascii=True,
            leave=(not innermost_tqdm()), **kwargs)

def in_notebook():
    '''
    True if running inside a Jupyter notebook.
    '''
    # From https://stackoverflow.com/a/39662359/265298
    try:
        shell = get_ipython().__class__.__name__
        if shell == 'ZMQInteractiveShell':
            return True   # Jupyter notebook or qtconsole
        elif shell == 'TerminalInteractiveShell':
            return False  # Terminal running IPython
        else:
            return False  # Other type (?)
    except NameError:
        return False      # Probably standard Python interpreter

def innermost_tqdm():
    '''
    Returns the innermost active tqdm progress loop on the stack.
    '''
    if hasattr(tqdm, '_instances') and len(tqdm._instances) > 0:
        return max(tqdm._instances, key=lambda x: x.pos)
    else:
        return None

def __call__(x, *args, **kwargs):
    '''
    Invokes a progress function that can wrap iterators to print
    progress messages, if verbose is True.
   
    If verbose is False or tqdm is unavailable, then a quiet
    non-printing identity function is used.

    verbose can also be set to a spefific progress function rather
    than True, and that function will be used.
    '''
    global default_verbosity, next_description
    if not default_verbosity or tqdm is None:
        return x
    if default_verbosity == True:
        fn = tqdm_notebook if in_notebook() else tqdm_terminal
    else:
        fn = default_verbosity
    if next_description is not None:
        kwargs = dict(kwargs)
        kwargs['desc'] = next_description
        next_description = None
    return fn(x, *args, **kwargs)

class CallableModule(types.ModuleType):
    def __init__(self):
        # or super().__init__(__name__) for Python 3
        types.ModuleType.__init__(self, __name__)
        self.__dict__.update(sys.modules[__name__].__dict__)
    def __call__(self, x, *args, **kwargs):
        return __call__(x, *args, **kwargs)

sys.modules[__name__] = CallableModule()

