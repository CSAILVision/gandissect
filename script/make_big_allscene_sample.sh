#!/usr/bin/env bash

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

LAYER=layer4

for SIZE in 10000 1000;
do

for SCENE in \
    bedroom \
    conferenceroom \
    diningroom \
    churchoutdoor \
    kitchen
do

echo "Doing ${SCENE}"
python -m netdissect.tool.allunitsample \
  --model "netdissect.proggan.from_pth_file('models/lsun_models/${SCENE}_lsun.pth')" \
  --outdir imagesample/scenes/size_${SIZE}/${SCENE}/${LAYER} \
  --layer ${LAYER} \
  --size ${SIZE}

done

done
