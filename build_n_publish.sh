#!/bin/bash
# $1 is the folder to be built and published
# $2 is a boolean development: true
case "$2" in
    dev) mode="development" ;;
    prod) mode="production" ;;
esac

if [ mode ] 
then
    IMGNAME=berstearns/$1-$mode:`date +"%m%Y"`
else
    IMGNAME=berstearns/$1:`date +"%m%Y"`
fi

IMGID=$(echo $(docker build --no-cache -qt $1:`date +"%d%m%Y"` $1) | sed "s/sha256://g")
echo "$DOCKERHUB_PASSWORD" | docker login --username=berstearns --password-stdin
docker tag $IMGID $IMGNAME  
docker push $IMGNAME 
echo $IMGNAME

