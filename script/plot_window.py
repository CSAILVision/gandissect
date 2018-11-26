# Plot bar chart of 20-unit ablations in conference room of
# conference room ablation

from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

data = [
# ('conference   ', 0.025092652067542076, 0.00843511987477541),
('conference   ', 0.5683056116104126),
# ('kitchen', 0.031040102243423462, 0.014645813964307308),
('kitchen', 0.5389571785926819),
# ('church', 0.0058178105391561985, 0.002890259027481079),
('church', 0.4741958975791931),
# ('restaurant', 0.02118084765970707, 0.010646240785717964),
# ('  bedroom', 0.03783990815281868, 0.02832513488829136),
('  bedroom', 0.2773325443267822),
# ('living rm', 0.06126990169286728, 0.03543371707201004),
('living rm', 0.26558423042297363),
]

fig = Figure(figsize=(4.5, 2.5))
FigureCanvas(fig)
ax = fig.add_subplot(111)
index = range(len(data))
# ax.bar(index, [(1 - eff / base) for name, base, eff in data], color='teal')
ax.bar(index, [frac for name, frac in data], color='teal')
ax.set_title('Ablating Window Units from Several Generators')
ax.set_ylabel('Average Causal Effect')
ax.set_xticks(index)
# ax.set_xticklabels([name for name, base, eff in data])
ax.set_xticklabels([name for name, frac in data])
fig.savefig('dissect/figure/window_ablation/barchart.svg', format='svg')
