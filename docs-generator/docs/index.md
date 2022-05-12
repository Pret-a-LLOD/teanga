# Welcome to Teanga
Teanga is a command-line tool that automates and facilitates using sequences of containerized rest api as a workflow. It aims at creation of complex Natural Language Processing workflows using Airflow, OpenAPI specification and docker.
[GitHub](https://github.com/pret-a-llod/teanga)

## Installation

Teanga can be installed only through a Command Line Interface/Terminal and requires [Docker](https://docs.docker.com/get-docker/) to be installed on your computer.

If you have wget command installed in your terminal:

    sudo wget -O - https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

If you have curl command installed in your terminal:

    sudo curl https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

## Quick Start
1. Download the workflow [example](https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/workflows/dkpro_treetagger.json) 
   or Create your own workflow file following [Teanga Run Existing Workflow Tutorial](/run_existing_workflow).

2. Start Teanga and Run Workflow:

    `
    teanga start
    teanga run workflow -f ./workflows/my_teanga_workflow.json
    `


## Commands

* `teanga start` - Start Teanga backend and UI.
* `teanga stop` - Stop Teanga backend and UI.
* `teanga run workflow -f {filepath}` -  Runs a workflow through the command line


## Tutorials

* [Teanga Start UI](/teanga_ui) - Start Teanga backend and UI.
* [Teanga Run Existing Workflow](/run_existing_workflow) - Start Teanga backend and UI.
* [Creating a new Workflow in Teanga](/create_new_workflow) - Start Teanga backend and UI.
* [Creating a new Service in Teanga](/create_new_workflow) - Start Teanga backend and UI.
* [List of available services in teanga](/create_new_workflow) - Start Teanga backend and UI.
* [List of example Workflows](/create_new_workflow) - Start Teanga backend and UI.
* [Shutdown Teanga](/stop_teanga) - Stop Teanga backend and UI.
