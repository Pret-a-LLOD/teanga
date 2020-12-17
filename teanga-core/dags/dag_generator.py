from datetime import timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
import sys
import os
from os.path import abspath, dirname
from teanga import Workflow 

base_folder = dirname(dirname(abspath(__file__)))
workflow_filename = os.environ["TARGET_WORKFLOW"]
workflow = Workflow(workflow_filename=workflow_filename,
                    base_folder=base_folder)
globals()["teanga"] = workflow.description_to_dag()
