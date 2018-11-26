# Plot bar chart of 20-unit ablations in conference room of
# conference room ablation

from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

data = [
# person
# ('person', 0.06338605284690857, 0.018311036750674248),
('person', 0.614344596862793),
# window
# ('window', 0.025092652067542076, 0.00843511987477541),
('window', 0.5683056116104126),
# curtain
# ('curtain', 0.010211548767983913, 0.003340149065479636),
('curtain', 0.5497019290924072),
# table
# ('table', 0.08249933272600174, 0.05076080560684204),
('table', 0.2871387004852295),
# chair
# ('chair', 0.07171173393726349, 0.053527284413576126),
('chair', 0.12282001972198486),
]

fig = Figure(figsize=(4.5,2.5))
FigureCanvas(fig)
ax = fig.add_subplot(111)
index = range(len(data))
# ax.bar(index, [(1 - eff / base) for name, base, eff in data], color='teal')
ax.bar(index, [frac for name, frac in data], color='teal')
ax.set_title('Ablating Conference Room Generator Units')
ax.set_ylabel('Average Causal Effect')
ax.set_xticks(index)
ax.set_xticklabels([name for name, frac in data])
fig.savefig('dissect/figure/confroom_ablation/barchart.svg', format='svg')
