from datetime import timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
import sys
import os
from os.path import abspath, dirname
from teanga.operators import *
from teanga import Workflow 

if os.path.exists("/teanga/workflows/teanga_ui.json"):
    workflow = Workflow(workflow_filename="teanga_ui.json",
                        base_folder="/teanga")
    globals()["teanga_ui"] = workflow.description_to_dag()
