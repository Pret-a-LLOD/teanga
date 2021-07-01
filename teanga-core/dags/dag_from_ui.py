from datetime import timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
import sys
import os
from os.path import abspath, dirname
from teanga.operators import *
from teanga import Workflow 
import pickle

if os.path.exists("/teanga/workflows/teanga_ui.json"):
    base_folder = dirname(dirname(abspath(__file__)))
    workflow_filename = "teanga_ui.json"
    workflow_pickle_filepath = f'/teanga/workflows/{workflow_filename}'.replace(".json",".pickle")
    if os.path.exists(workflow_pickle_filepath):
        with open(workflow_pickle_filepath,"rb") as inpf:
            dag = pickle.load(inpf)
    else:
        workflow = Workflow(workflow_filename=workflow_filename,
                            base_folder=base_folder)
        dag = workflow.description_to_dag()
        with open(workflow_pickle_filepath,"wb") as outf:
            pickle.dump(dag, outf)
    globals()["teanga_ui"] = dag 
