#!/bin/bash
rm -rf ./docs
cd ./docs-generator
python3 -m mkdocs build
mv -i ./site ../docs
cd ..
