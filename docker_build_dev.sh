#!/bin/bash
docker build -qt teanga_backend:`date +"%d%m%Y"` ./teanga-core
