#!/usr/bin/env bash
# Another way to download the dataset.

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

set -e

# Within MIT the dataset exists here
LOCALDATA="/data/vision/torralba/datasets/broden"

if [ -f "${LOCALDATA}/broden1_224/index.csv" ] && [ ! -e dataset/broden ]
then
ln -s "${LOCALDATA}" -T dataset/broden
fi

# Download broden1_224
if [ ! -f dataset/broden/broden1_224/index.csv ]
then

echo "Downloading broden1_224"
mkdir -p dataset/broden
pushd dataset/broden
wget --progress=bar \
   http://netdissect.csail.mit.edu/data/broden1_224.zip \
   -O broden1_224.zip
unzip broden1_224.zip
rm broden1_224.zip
popd

fi

# Download broden1_227
if [ ! -f dataset/broden/broden1_227/index.csv ]
then

echo "Downloading broden1_227"
mkdir -p dataset/broden
pushd dataset/broden
wget --progress=bar \
   http://netdissect.csail.mit.edu/data/broden1_227.zip \
   -O broden1_227.zip
unzip broden1_227.zip
rm broden1_227.zip
popd

fi

# Download broden1_384
if [ ! -f dataset/broden/broden1_384/index.csv ]
then

echo "Downloading broden1_384"
mkdir -p dataset/broden
pushd dataset/broden
wget --progress=bar \
   http://netdissect.csail.mit.edu/data/broden1_384.zip \
   -O broden1_384.zip
unzip broden1_384.zip
rm broden1_384.zip
popd

fi

# Download segmodel
if [ ! -f dataset/segmodel/upp-resnet50-upernet/decoder_epoch_40.pth ]
then

echo "Downloading segmentation model"
mkdir -p dataset/segmodel/upp-resnet50-upernet
pushd dataset/segmodel/upp-resnet50-upernet
for F in \
    labels.json \
    encoder_epoch_40.pth \
    decoder_epoch_40.pth
do
wget --progress=bar \
 http://netdissect.csail.mit.edu/data/segmodel/upp-resnet50-upernet/${F} \
 -O ${F}
done
popd

fi

# Download example progressive gan models
if [ ! -f models/karras/restaurant_lsun.pth ]
then

echo "Downloading demo gan models to dissect"
mkdir -p models/karras
pushd models/karras
for S in \
    bedroom churchoutdoor conferenceroom \
    kitchen diningroom livingroom restaurant
do
wget --progress=bar \
 http://netdissect.csail.mit.edu/data/ganmodel/karras/${S}_lsun.pth \
 -O ${S}_lsun.pth
done
popd

fi

