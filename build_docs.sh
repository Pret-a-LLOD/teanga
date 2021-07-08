#!/bin/bash
rm -rf ./docs
cd ./docs-generator
sphinx-build . build
mv -i build/_static build/static
cd ./build
for f in `ls . | grep '.html'`;
do 
    echo $f
    sed -i -e 's/_static/static/g' $f
done
cd ..
mv -i build ../docs
touch ../docs/.nojekyll
cd ..
