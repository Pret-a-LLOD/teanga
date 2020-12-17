#!/bin/sh
service docker start &
airflow webserver &
airflow scheduler 
