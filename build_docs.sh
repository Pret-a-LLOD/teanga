#!/bin/bash
rm -rf ./docs
cd ./docs-generator
sphinx-build . build
mv -i build/_static build/static
mv -i build ../docs
touch ../docs/.nojekyll
cd ..
