# Plot bar chart of 20-unit ablations in conference room of
# conference room ablation

from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

data = [
   ('door', 1.6060975836283062),
   ('window', 0.509714680649477),
   ('house', 0.1863726143823361),
   ('building', 0.0407623447973438),
   ('tree', -0.002643903288120474),
   ('sky', -0.01563103223232508)
]

fig = Figure(figsize=(5,3))
FigureCanvas(fig)
ax = fig.add_subplot(111)
index = range(len(data))
ax.bar(index, [eff for  name, eff in data], color='teal')
ax.set_title('Where Can a Door Go?')
ax.set_ylabel('Average Causal Effect')
ax.set_xticks(index)
ax.axhline(y=0, color='k',
         linewidth=0.5)
ax.set_xticklabels([name for name, eff in data])
fig.savefig('dissect/figure/door_insertion/barchart.svg', format='svg')
