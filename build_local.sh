#!/bin/bash
# $1 is the folder to be built and published
case "$1" in 
    teanga-services/*) IMGNAME=teanga-`basename $1`;;
        *) IMGNAME=$1;;
esac

IMGNAME=pretallod/$IMGNAME:test
echo $IMGNAME
IMGID=$(echo $(docker build --no-cache -qt $IMGNAME $1) | sed "s/sha256://g")
echo "$DOCKERHUB_PASSWORD" | docker login --username=berstearns --password-stdin
docker tag $IMGID $IMGNAME  
