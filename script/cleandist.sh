#!/usr/bin/env bash
# Delete directories that are not part of the source

set -e

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

rm -rf build
rm -rf dist
rm -rf netdissect.egg-info
