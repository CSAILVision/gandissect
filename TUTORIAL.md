# GANDissect Tutorial Setup

This tutorial branch of GAN Dissect can be cloned via

```
git clone --branch tutorial https://github.com/CSAILVision/gandissect.git
```

## Setup

To install everything needed from this repo, have `conda` available
(I happen to use conda 4.6.8, but it also works fine on conda 1.x).
Then go to the main folder `gandissect` and run the setup scripts:

```
cd gandissect
script/setup_env.sh      # Create a conda environment with dependencies
script/make_dirs.sh      # Create the dataset and dissect directories
source activate netd     # Enter the conda environment
pip install -v -e .      # Link the local netdissect package into the env
```

This will set up python 3.6, pytorch 1.1, torchvision 0.3, and cuda 9,
jupyter, and several other libraries that are used in gandissect.

Then switch to the `notebooks` directory and start jupyter:

```
cd notebooks
jupyter notebook &
```

Then run the notebook `dissect_progan.ipynb`

## Notes on running Jupyter remotely

If you are running on a remote server that you connect to via
ssh, then one way to access the Jupyter HTTP server is via ssh
tunnelling, as follows:

On the server:

```
jupyter notebook --no-browser --port=7000
```

On your local machine:

```
ssh [username]@[server_address] -N -f -L localhost:6007:localhost:7000
```

Open a browser in your local machine and use the corresponding URL
(make sure you specify the correct port):

```
http://localhost:6007/?token=[token_id]
```

## Slides

Slides to introduce the tutorial are here:
http://gandissect.csail.mit.edu/slides/ganocracy-dissect-tutorial.pptx
