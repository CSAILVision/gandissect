#!/usr/bin/env bash
set -e

# Start from parent directory of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Verify npm is available
if ! type -p npm > /dev/null
then
  echo 'npm needed and not installed: install node >= v8.'
  echo 'https://github.com/nodesource/distributions/blob/master/README.md'
  exit
fi

cd client
npm install
npm install git+ssh://git@github.com:HendrikStrobelt/paint_widget_js.git
npm run wp # For once only
# npm run ww # for live development
