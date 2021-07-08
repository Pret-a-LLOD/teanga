.. _create-teanga-service:

How to create a service in Teanga
======

.. currentmodule:: teanga-services

Teanga is a workflow manager and service  in a Teanga workflow is a dockerized application which Teanga can make requests to in some port.

Services in Teanga must be a REST API that returns JSON-LD outputs.
There are 4 essential steps to make a rest api to work in Teanga:

#. Creating a Rest API app

    * Create an application that receives http requests

    * Expose your application in some port (8080 is recommended)

    * Return a valid json format as output

#. Describing the Rest API with OpenAPI specification

    * Inform the port of the application in the info section of the file

    * Describe all your endpoints in the paths section of the file

#. Dockerizing your api

    * Copy the openapi.yaml file to the root of the docker container “/openapi.yaml”

#. Publishing the Docker Image on Docker Hub

    * create an account in Docker Hub

    * upload docker image


As an pratical example we will go through a step by step process to how to make one python application you might have suitable for running in Teanga.

In the end of the tutorial our service will be published in docker hub and have a folder with the following files :

.. image:: servicefolder.png


The whole code is the Teanga official repository here 

Where app.py is a simple application that will run on port 8080 inside of the docker image we will create using a Dockerfile and described with the openapi.yaml file.


