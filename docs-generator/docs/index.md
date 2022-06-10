# ![image](/teanga/assets/teanga-logo.png)  Welcome to Teanga
Teanga is a command-line tool that automates and facilitates using sequences of containerized rest api as a workflow. It aims at creation of complex Natural Language Processing workflows using Airflow, OpenAPI specification and docker.
Our code is open-source and available in [GitHub](https://github.com/pret-a-llod/teanga).

## Installation

Teanga can be installed only through a Command Line Interface/Terminal and requires [Docker](https://docs.docker.com/get-docker/) to be installed on your computer.

If you have wget command installed in your terminal:

    sudo wget -O - https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

If you have curl command installed in your terminal:

    sudo curl https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

## Quick Start
1.Download the workflow [example](https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/workflows/dkpro_treetagger.json) 
   or Create your own workflow file following [Creating a new Workflow in Teanga](/create_new_workflow).

2.Start Teanga and Run Workflow:

    teanga start

    teanga create workflow -f ./workflows/my_teanga_workflow.json
    teanga run worflow {my_workflow_id}

## Commands

* `teanga start` - Start Teanga backend and UI.
* `teanga stop` - Stop Teanga backend and UI.
* `teanga create workflow -f {filepath}` -  creates a workflow through the command line
* `teanga run workflow --id {workflow_id}` -  Runs a workflow through the command line


## Tutorials (Under construction, Most tutorials are empty)

* [Teanga Start UI](/teanga/start_teanga/) - Start Teanga backend and UI.
* [Shutdown Teanga](/teanga/stop_teanga/) - Stop Teanga backend and UI.
* [Teanga Run Existing Workflow](/teanga/run_existing_workflow/) - Start Teanga backend and UI.
* [Creating a new Workflow in Teanga](/teanga/create_new_workflow/) - Create a workflow from a workflow description json file.
* [Creating a new Service in Teanga](/teanga/create_new_service/) - Step by step for developers create a rest api for teanga.
* [List of available services in teanga](/teanga/available_services/) - Existing teanga services.
* [List of example Workflows](/teanga/available_workflows/) - Start Teanga backend and UI.
