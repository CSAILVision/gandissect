import json, os
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib.ticker import MaxNLocator
import matplotlib

from netdissect.easydict import EasyDict

metric = 'iqr'
basedir = 'dissect/ganunified'
scene = 'churchoutdoor'
classname = 'tree'
layername = 'layer4'
xlim = 30
test_metric = 'acez'

for scene, classname in [
        ('churchoutdoor', 'door'),
        ('churchoutdoor', 'tree'),
        ]:

    fig = Figure(figsize=(4.5,3.5))
    FigureCanvas(fig)
    ax = fig.add_subplot(111)
    for metric in [test_metric, 'iou']:

        # Plot line graph
        with open(os.path.join(basedir, scene, layername, 'pixablation',
                '%s-%s.json' % (classname, metric))) as f:
            data = EasyDict(json.load(f))
        ax.plot([0] +
                [(data.baseline - data.ablation_effects[i]) / data.baseline
                    for i in range(xlim)],
                label='Top units by IoU' if metric is 'iou' else
                      'Units by ACE')

    ax.set_title('Effect of ablating units for %s' % (classname))
    ax.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax.grid(True)
    ax.legend()
    ax.set_ylim(0, 1.0)
    ax.set_xlim(0, xlim)
    ax.set_xticks(range(0, xlim + 1, 5))
    ax.set_ylabel('Portion of %s pixels removed' % classname)
    ax.set_xlabel('Number of units ablated')
    fig.tight_layout()
    fig.savefig('dissect/figure/pixablation/%s-ablate-%s-%s-lines.svg' %
            (test_metric, scene, classname))
