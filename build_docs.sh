#!/bin/bash
rm -rf ./docs
cd ./docs-generator
sphinx-build . build
mv -i build ../docs
touch ../docs/.nojekyll
cd ..
