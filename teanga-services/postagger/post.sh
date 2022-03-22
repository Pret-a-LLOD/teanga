#!/bin/bash
curl -i  \
  --data-binary @/Users/kdu/projects/teanga_master/teanga-services/postagger/sample.conllu \
  -X POST localhost:8000/postagger
