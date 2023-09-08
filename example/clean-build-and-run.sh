#!/usr/bin/env bash

set -ex

option=$1

pushd ../
rm -rf dist/ node_modules/ package-lock.json frameright-react-image-display-control-*.tgz
npm install
npm pack
popd

rm -rf dist/ node_modules/ package-lock.json .parcel-cache/
mv ../frameright-react-image-display-control-*.tgz frameright-react-image-display-control.tgz
npm install
npx tsc --noEmit  # validate types
npm run build

if [ "$option" != "--build-only" ]; then
  npm start
fi
