from teanga import Workflow
from os.path import abspath, dirname
import os

from teanga.operators import matching_function
base_folder = dirname(abspath(__file__))
workflow_filename = os.environ["TARGET_WORKFLOW"]
workflow = Workflow(workflow_filename=workflow_filename,
                    base_folder=base_folder)
workflow.description_to_dag()

# given_inputs [dict] 
# expected inputs dict
'''
given_inputs = [workflow.workflow['1'].get('input',{})]
expected_parameters =  dict([(d['name'],d) 
                    for d in 
                    workflow.workflow['1']['operation_spec'].get('parameters',[])])
expected_requestBody =  workflow.workflow['1']['operation_spec'].get('requestBody',None)
matching_function(given_inputs=given_inputs,
                  expected_parameters=expected_parameters,
                  expected_requestBody=expected_requestBody
                  )
import ipdb;ipdb.set_trace()
'''
