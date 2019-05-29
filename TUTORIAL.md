# GANDissect Tutorial Setup

## Setup

To install everything needed from this repo, have `conda` available,
and run:

```
script/setup_env.sh      # Create a conda environment with dependencies
script/make_dirs.sh      # Create the dataset and dissect directories
source activate netd     # Enter the conda environment
pip install -v -e .      # Link the local netdissect package into the env
cd notebooks
./setup_notebooks.sh
```

Then within the `notebooks` directory:
```
jupyter notebook &
```

Then run the notebook `dissect_progan.ipynb`
