#!/bin/bash
cd ./docs-generator
sphinx-build . build
mv -i build ../docs
cd ..
