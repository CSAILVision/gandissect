# GPU_ID=${1}
# DISPLAY_ID=$((GPU_ID*10+1))

# Needed code is in a different directory.
cd ~/git/gand/gandissect/dissect/

for SIZE in 10000 1000;
do

CONFIGS=(
    wgangp                       G128_simple
	pixelwise-normalization      G128_pixelwisenorm
    proggan                      G128_simple
	minibatch-stddev             G128_minibatch_disc
)

for (( idx=0 ; idx<${#CONFIGS[@]} ; idx+=2 )) ; do

EXPNAME=${CONFIGS[idx]}
MODELNAME=${CONFIGS[idx+1]}
MODEL_CONSTRUCTOR="models.networks.${MODELNAME}()"
PTHFILE="model/theano_ablations/${EXPNAME}.pth"

echo "Running $EXPNAME using model $MODELNAME"

python -m netdissect.tool.allunitsample \
      --model "${MODEL_CONSTRUCTOR}" \
      --pthfile "${PTHFILE}" \
      --outdir imagesample/compare_arch/size_${SIZE}/${EXPNAME}/layer4 \
      --layer features.3 \
      --size ${SIZE} \

done

done
    #wgangp                       G128_simple
    #proggan                      G128_simple
	#minibatch-stddev             G128_minibatch_disc
    #small-minibatch              G128_simple
