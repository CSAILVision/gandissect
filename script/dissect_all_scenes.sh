#!/usr/bin/env bash

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

for SCENE in \
    livingroom
do
    echo "Doing ${SCENE}, all layers"
    PTHFILE="models/karras/${SCENE}_lsun.pth"
    python -m netdissect \
      --gan \
      --model "netdissect.proggan.from_pth_file('${PTHFILE}')" \
      --outdir "dissect/${SCENE}" \
      --layer layer1 layer2 layer3 layer4 layer5 layer6 layer7 \
              layer8 layer9 layer10 layer11 layer12 layer13 layer14 \
      --size 1000
done

# Run dissection on each scene
for SCENE in \
    churchoutdoor \
    bedroom \
    conferenceroom \
    kitchen \
    diningroom \
    restaurant
do
    echo "Doing ${SCENE}"
    PTHFILE="models/karras/${SCENE}_lsun.pth"
    python -m netdissect \
      --gan \
      --model "netdissect.proggan.from_pth_file('${PTHFILE}')" \
      --outdir "dissect/${SCENE}" \
      --layer layer4 \
      --size 1000
done

