from datetime import timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
import sys
import os
from os.path import abspath, dirname
from teanga import Workflow 
import pickle

base_folder = dirname(dirname(abspath(__file__)))
workflow_filename = os.environ["TARGET_WORKFLOW"]
workflow_filepath = f'/teanga/workflows/{workflow_filename}'
workflow_pickle_filepath = workflow_filepath.replace(".json",".pickle")
if os.environ["TARGET_WORKFLOW"] and os.path.exists(f'/teanga/workflows/{workflow_filename}'):
    if os.path.exists(workflow_pickle_filepath):
        with open(workflow_pickle_filepath,"rb") as inpf:
            dag = pickle.load(inpf)
    else:
        workflow = Workflow(workflow_filename=workflow_filename,
                            base_folder=base_folder)
        dag = workflow.description_to_dag()
        with open(workflow_pickle_filepath,"wb") as outf:
            pickle.dump(dag, outf)
    globals()["teanga"] = dag 
