import torchvision
import torch.hub
from netdissect import oldresnet152
from netdissect import nethook
from netdissect import upsample
from netdissect import pbar
import torch, os

torch.backends.cudnn.benchmark = True

resdir = 'dissect/resnet152-places'
os.makedirs(resdir, exist_ok=True)
def resfile(filename):
    return os.path.join(resdir, filename)

# Download and instantiate the model.
model = oldresnet152.OldResNet152()
url = ('http://gandissect.csail.mit.edu/' +
       'models/resnet152_places365-f928166e5c.pth')
try:
    sd = torch.hub.load_state_dict_from_url(url) # pytorch 1.1
except:
    sd = torch.hub.model_zoo.load_url(url) # pytorch 1.0
model.load_state_dict(sd)

layername = '7'
sample_size = 36500

model = nethook.InstrumentedModel(model)
model = model.cuda()
model.retain_layer(layername)

# Load labels
from urllib.request import urlopen

synset_url = 'http://gandissect.csail.mit.edu/models/categories_places365.txt'
classlabels = [r.split(' ')[0][3:]
    for r in urlopen(synset_url).read().decode('utf-8').split('\n')]

# Load segmenter
from netdissect import segmenter
segmodel = segmenter.UnifiedParsingSegmenter(segsizes=[256])
seglabels = [l for l, c in segmodel.get_label_and_category_names()[0]]

# Load places dataset
from netdissect import parallelfolder, renormalize
from torchvision import transforms

center_crop = transforms.Compose([
        transforms.Resize((256,256)),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        renormalize.NORMALIZER['imagenet']
])

dataset = parallelfolder.ParallelImageFolders(
    ['dataset/places/val'], transform=[center_crop],
    classification=True,
    shuffle=True)

train_dataset = parallelfolder.ParallelImageFolders(
    ['dataset/places/train'], transform=[center_crop],
    classification=True,
    shuffle=True)

# Collect unconditional quantiles
from netdissect import tally

upfn = upsample.upsampler(
    (56, 56),                     # The target output shape
    (7, 7),
    source=dataset,
)

renorm = renormalize.renormalizer(dataset, mode='zc')

def compute_samples(batch, *args):
    image_batch = batch.cuda()
    _ = model(image_batch)
    acts = model.retained_layer(layername)
    hacts = upfn(acts)
    return hacts.permute(0, 2, 3, 1).contiguous().view(-1, acts.shape[1])

pbar.descnext('rq')
rq = tally.tally_quantile(compute_samples, dataset, sample_size=sample_size,
        r=8192, cachefile=resfile('rq.npz'))

if False:
    def compute_conditional_samples(batch, *args):
        image_batch = batch.cuda()
        _ = model(image_batch)
        acts = model.retained_layer(layername)
        seg = segmodel.segment_batch(renorm(image_batch), downsample=4)
        hacts = upfn(acts)
        return tally.conditional_samples(hacts, seg)

    pbar.descnext('condq')
    condq = tally.tally_conditional_quantile(compute_conditional_samples,
            dataset, sample_size=sample_size, cachefile=resfile('condq.npz'))

level_at_99 = rq.quantiles(0.99).cuda()[None,:,None,None]

def compute_conditional_indicator(batch, *args):
    image_batch = batch.cuda()
    seg = segmodel.segment_batch(renorm(image_batch), downsample=4)
    _ = model(image_batch)
    acts = model.retained_layer(layername)
    hacts = upfn(acts)
    iacts = (hacts > level_at_99).float() # indicator where > 0.99 percentile.
    return tally.conditional_samples(iacts, seg)

pbar.descnext('condi99')
condi99 = tally.tally_conditional_mean(compute_conditional_indicator,
        dataset, sample_size=sample_size, cachefile=resfile('condi99.npz'))

