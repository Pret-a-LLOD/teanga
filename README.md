# Docs

## Teanga-Backend

Teanga backend is the core component of Teanga which coordinates a sequence of services(implemented as docker containers) by matching input and output based on services dependencies. 

## Understanding Teanga-Backend

This repository contains three different parts:

1. [Teanga-backend core](https://github.com/Pret-a-LLOD/teanga-executor-service)
    1.  use this repo if you want to build teanga-backend from scratch
2. [Teanga-backend services](https://github.com/berstearns/teanga_services)
    1. if  you want create teanga-services use this repo to see templates examples
3. [Teanga-backend client](https://github.com/berstearns/teanga-client) (cli):
    1. use this repo if you want to use pre-built teanga docker image in a workflow you have

## Requirements

- docker
- access to docker.sock file
- having ports 8080, 800{1...number_of_services} available

## Quick start

```bash
git clone https://github.com/berstearns/teanga-client ./teanga-client
```

```bash
cd ./teanga-client
```

```bash
source docker-run.sh
```

Then airflow should be accessible at [http://localhost:8080](http://localhost:8080) , With a example Teanga workflow.

[]()

![https://i.ibb.co/jyvypZ1/Screenshot-2020-05-08-at-05-16-21.png](https://i.ibb.co/jyvypZ1/Screenshot-2020-05-08-at-05-16-21.png)

## manually using the backend

### init Teanga-backend (airflow container)

### turn on airflow webserver and scheduler

### generate airflow dag ( there's a dummy one created already)

### acess webserver (localhost:8080)

### run dag

### get output

