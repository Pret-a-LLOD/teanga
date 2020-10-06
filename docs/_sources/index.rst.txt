.. _index: teanga documentation master file, created by
   sphinx-quickstart on Wed Mar  5 12:35:35 2014.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==================
Welcome to Teanga
==================


Teanga is a command-line tool that automates and facilitates using sequences of containerized rest api as a workflow. It aims at creation of complex Natural Language Processing workflows using Airflow, OpenAPI specification and docker.

.. _GitHub: https://github.com/pret-a-llod/teanga

Useful Links
=================

:ref:`Quick Start`

:ref:`Installation`

Others

.. toctree::
   :name: mastertoc
   :maxdepth: 1

   create_workflow
   create_service
   run_workflow

Installation
============

At the command line
    If you have wget command installed in your terminal::

        wget -O - https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

    If you have curl command installed in your terminal::

        curl https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

Quick Start
================================
1. Download the workflow `example <http://cnn.com>`_ 
   or Create your own workflow file following :ref:`how to create a workflow in Teanga<create-teanga-workflow>`

2. Run Workflow::

    teanga run workflow -f ./workflows/my_teanga_workflow.json -p 8080


Available Commands 
================================
1. teanga workflow run
    A. execute a workflow specification
        parameters:
            1. -f input workflow file
            2. -p port airflow will be available

Source code
===========

The project is hosted on GitHub_

Please feel free to file an issue on the `bug tracker
<https://github.com/pret-a-llod/teanga/issues>`_ if you have found a bug
or have some suggestion in order to improve the library.


Dependencies
============

- Python 3
- Docker

Authors and License
===================

The ``Teanga`` package is written mostly by Bernardo Stearns and John Mccrae. 

It's *Apache 2* licensed and freely available.

Feel free to improve this package and send a pull request to GitHub_.
