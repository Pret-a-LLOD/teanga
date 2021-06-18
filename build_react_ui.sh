#!/bin/bash
cd ./teanga-ui
npm run build
cd ./build
sed 's/href="/href="{{ url_for('\''static'\'',filename='\''/g;s/src="/src="{{ url_for('\''static'\'',filename='\''/g;s/\.css"/.css'\'')}}"/g;s/\.js"/.js'\'')}}"/g;s/\.json"/.json'\'')}}"/g;s/\.ico"/.ico'\'')}}"/g;s/\/static\//react\//g' ./index.html > ./buildWorkflow_react.html
cd ..
cd ..
mv ./teanga-ui/build/buildWorkflow_react.html ./teanga-core/teanga-ui/www/templates/teanga/buildWorkflow_react.html 
cp -R ./teanga-ui/build/static/* ./teanga-core/teanga-ui/www/static/react/
