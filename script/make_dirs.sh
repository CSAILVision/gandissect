#!/usr/bin/env bash

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Within MIT bulk data can go here.
LOCALSCRATCH="/data/vision/torralba/scratch2/${USER}"

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

for BULKDIR in dataset models dissect
do

# Make dataset directory
if [ ! -e ${BULKDIR} ]
then
# Link dataset directory to scratch if available.
if [ -d "$(dirname "${LOCALSCRATCH}")" ] && [ ! -d "${LOCALSCRATCH}" ]
then
mkdir -p "${LOCALSCRATCH}"
fi
if [ -d "${LOCALSCRATCH}" ]
then
mkdir -p "${LOCALSCRATCH}/netdissect/${BULKDIR}"
ln -s "${LOCALSCRATCH}/netdissect/${BULKDIR}" -T ${BULKDIR}
else
# Otherwise just create the directory
mkdir -p ${BULKDIR}
fi
fi

done

notebooks/setup_notebooks.sh
