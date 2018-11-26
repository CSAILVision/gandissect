#!/usr/bin/env bash

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

SCENE=livingroom

for SIZE in 10000 1000;
do

cat << '__EOF__' | while read -r LAYER UNITCOUNT;
layer1 512
layer4 512
layer7 256
layer10 128
__EOF__
do

OUTDIR=imagesample/layers/size_${SIZE}/${SCENE}/${LAYER}
mkdir -p ${OUTDIR}

if [ "$(ls -b ${OUTDIR}/unit_$((UNITCOUNT-1)) | wc -l)" -gt ${SIZE} ]
then
    echo "Skipping aleady done ${SCENE} ${LAYER}"
    continue
fi

echo "Doing ${SCENE} ${LAYER}"
python -m netdissect.tool.allunitsample \
  --model "proggan.from_pth_file('models/lsun_models/${SCENE}_lsun.pth')" \
  --outdir ${OUTDIR} \
  --layer ${LAYER} \
  --size ${SIZE}

done

done
