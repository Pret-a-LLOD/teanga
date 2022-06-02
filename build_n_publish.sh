#!/bin/bash
# $1 is the folder to be built and published
# $2 is a boolean development: true
default_option=FAIL
case "$1" in 
    teanga-services/*) IMGNAME=teanga-`basename $1`;;
        *) IMGNAME=$1;;
esac
case "$2" in
    dev) mode="development" ;;
    prod) mode="production" ;;
    *) ;;
esac

if [ ! -z "$mode" ] 
then
    IMGNAME=pretallod/$IMGNAME-$mode\:latest
#`date +"%m%Y"`
else
    IMGNAME=pretallod/$IMGNAME\:latest
#`date +"%m%Y"`
fi

echo $IMGNAME
IMGID=$(echo $(docker build -qt $IMGNAME $1) | sed "s/sha256://g")
echo "$DOCKERHUB_PASSWORD" | docker login --username=berstearns --password-stdin
docker tag $IMGID $IMGNAME  
docker push $IMGNAME 
