#!/usr/bin/env bash

set -ex

pushd ../
rm -rf dist/ node_modules/ package-lock.json frameright-react-image-display-control-*.tgz
npm install
npm pack
popd

rm -rf dist/ node_modules/ package-lock.json .parcel-cache/
mv ../frameright-react-image-display-control-*.tgz frameright-react-image-display-control.tgz
npm install
npm run build
npm start
