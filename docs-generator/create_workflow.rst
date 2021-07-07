.. _create-teanga-workflow:

How to create a workflow in Teanga
======

.. currentmodule:: teanga-workflow

Workflows are the main component in Teanga. Using a similar concept of `Airflow DAGS <https://airflow.apache.org/docs/stable/concepts.html#dags>`_ where a sequence of operations(snippets of code) are representated as a graph. In Teanga each operation is a requet to a local or remote service which is a dockerized rest API following the openAPI specification. If the service follows the openAPI specificitation, every endpoint will have an operation id so that by knowing the docker image informations (repository name, image id and image tag) Teanga can access and manage this image as necessary.  
Once you have those information for every endpoint you want to use in your workflow, you just need to specify the inputs for that endpoint and their dependencies. By default if an input is missing for a step in the workflow, Teanga will check it's dependencies inputs and outputs to try to have all the inputs necessary. If this matching fails and inputs still missing the operation will be flaged as failed.


A workflow file description look like this::

    {
        "1":{
            "operation_id":"upload",
            "input": {
            "id": "left_id",
            "files": ["left.rdf"]
            },
            "repo":"berstearns",
            "image_id":"naisc",
            "image_tag":"062020",
            "host_port":8001,
            "container_port":8080,
            "dependencies": []
        },
        "2":{
            "operation_id":"upload",
            "input": {
            "id": "right_id", 
            "files": ["right.rdf"]
            },
            "repo":"berstearns",
            "image_id":"naisc",
            "image_tag":"062020",
            "host_port":8002,
            "container_port":8080,
            "dependencies":[]
        }
    }

It's a json file describing each step of the workflow
