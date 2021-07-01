import docker
import os
import datetime
import time
from io import BytesIO 
import tarfile
import json
import yaml
from teanga.operators import *
from airflow.utils.dates import days_ago
from datetime import timedelta
from airflow import DAG

class Workflow:
    def __init__(self, workflow_filename, base_folder):#{{
        self.docker_client = docker.from_env()
        self.base_folder=    base_folder#os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
        self.workflow_filename = workflow_filename#os.environ['TARGET_WORKFLOW'] 
        self.today_date =    datetime.datetime.now().strftime("%d%m%Y")

        self.workflow_filepath = os.path.join(base_folder,"workflows",workflow_filename)
        self.workflow_creation_timeStr = datetime.datetime.now().strftime("%d_%m_%Y_%H-%M-%S")

        self.workflow, self.services = self.load_workflow()
        self.load_services_description()
        #}}

    def load_workflow(self):#{
        with open(self.workflow_filepath) as workflow_input:
            workflow = json.load(workflow_input)
            unique_services = {}
            for workflow_id, d in workflow.items():
                service_id = f'{d["repo"]}/{d["image_id"]}:{d["image_tag"]}'\
                             if d['repo'] else f'{d["image_id"]}:{d["image_tag"]}'
                if unique_services.get(service_id, False):
                       unique_services[service_id].append([workflow_id, d])  
                else:
                       unique_services[service_id] = [[workflow_id, d]]  

            for service_id in unique_services.keys():
                for workflow_id, instance_info in unique_services[service_id]:
                    workflow[workflow_id]['host_port'] = unique_services[service_id][0][1]['host_port'] 
                    workflow[workflow_id]['container_port'] = unique_services[service_id][0][1]['container_port'] 
        return workflow, unique_services# #}

    def load_services_description(self):#{{
        for service_id, steps_using_service in self.services.items():
            try: 
                docker_image = self.docker_client.images.get(service_id)
            except:
                docker_image = self.docker_client.images.pull(service_id)
            if docker_image in self.docker_client.images.list():
                container = self.docker_client.containers.create(docker_image)
                stream, stats = container.get_archive("/openapi.yaml")
                openapi_filename = service_id.replace("/","_")
                file_obj = BytesIO()
                for i in stream:
                    file_obj.write(i)
                file_obj.seek(0)
                tar = tarfile.open(mode='r', fileobj=file_obj)
                tar.extractall("/teanga/OAS")
                tar.close()
                os.rename("/teanga/OAS/openapi.yaml",f'/teanga/OAS/{openapi_filename}')
                container.stop()
                container.remove()
                service_openapi_spec = yaml.load(open(f'/teanga/OAS/{openapi_filename}'),Loader=yaml.FullLoader)
                for (workflow_id, d) in steps_using_service:
                    operation_id  = d["operation_id"]
                    self.workflow[workflow_id]["operation_spec"] = self.get_spec_from_operationId(service_openapi_spec, operation_id) 
    #}}

    def get_spec_from_operationId(self, OAS, operationId):#{
        flatten = {}
        for url in OAS['paths'].keys():
            for request_method in OAS['paths'][url].keys():
                operation_data=OAS['paths'][url][request_method]
                if operation_data["operationId"] == operationId:
                    flatten["operation_id"] = operationId
                    flatten["endpoint"] = url
                    flatten["request_method"] = request_method
                    flatten["parameters"] =  operation_data.get("parameters",[])
                    flatten["requestBody"] =  operation_data.get("requestBody",{})
                    flatten["sucess_response"] = operation_data["responses"].get("200",operation_data["responses"].get(200,None))
                    if not flatten["sucess_response"]: raise Error("Missing sucess response schema") 

                    flatten["response_schema"] = \
                            flatten["sucess_response"]['content']['application/json']['schema']\
                            if flatten["sucess_response"].get('content',False) else None
                    if flatten["response_schema"]:
                        if flatten["response_schema"].get("type",False) == "array":
                            flatten["response_schema_item_name"] = \
                                    flatten["sucess_response"]['content']['application/json']['schema']["items"]["$ref"].split("/")[-1]
                        elif flatten["response_schema"].get("$ref",False):
                            flatten["response_schema_name"] = \
                                    flatten["sucess_response"]['content']['application/json']['schema']["$ref"].split("/")[-1]
        flatten["schemas"] = OAS.get('components',{}).get('schemas',{})
        return flatten 
    #}

    def init_dag(self, name="teanga_workflow"):#{{
        name=self.workflow_filename
        default_args = {#{{ 
            'owner': 'teanga',
            'depends_on_past': False,
            'start_date': days_ago(2),
            'schedule_interval': None,
            'email': ['airflow@example.com'],
            'email_on_failure': False,
            'email_on_retry': False,
            'retries': 1,
            'retry_delay': timedelta(minutes=5),
            # 'queue': 'bash_queue',
            # 'pool': 'backfill',
            # 'priority_weight': 10,
            # 'end_date': datetime(2016, 1, 1),
            # 'wait_for_downstream': False,
            # 'dag': dag,
            # 'sla': timedelta(hours=2),
            # 'execution_timeout': timedelta(seconds=300),
            # 'on_failure_callback': some_function,
            # 'on_success_callback': some_other_function,
            # 'on_retry_callback': another_function,
            # 'sla_miss_callback': yet_another_function,
            # 'trigger_rule': 'all_success'
        }
        #}}
        dag = DAG(
            name,
            default_args=default_args,

            schedule_interval=None,
            is_paused_upon_creation=False,
        )
        operators_instances = {}
        return dag, operators_instances
#}}

    def description_to_dag(self):#{{
        self.dag, self.operators_instances = self.init_dag()
        self.operators_instances["pull_operators_instances"] = generate_pull_operators(self.services, self.dag)

        # services setup operators_instances
        self.operators_instances["setup_operators_instances"] = generate_setup_operators(self.services, self.dag)
        self.operators_instances[f"generate_endpointRequest_operator"] = []
        for workflow_step, step_description in self.workflow.items():
            self.operators_instances[f"generate_endpointRequest_operator"].append(generate_endpointRequest_operator(workflow_step, step_description["operation_id"], step_description, self.dag))


        pull_operators_instances  =    [operator for operator in self.operators_instances["pull_operators_instances"].values()]
        setup_operators_instances =    [operator for operator in self.operators_instances["setup_operators_instances"].values()]
        rq_operators_instances    =    [operator for operator in self.operators_instances["generate_endpointRequest_operator"]]

        for pull_operators_instance in pull_operators_instances:
            pull_operators_instance >> setup_operators_instances

        # MAPPING each step on the workflow to a set of airflow operators    
        for workflow_step, step_description in list(self.workflow.items()):#{{
           print(f'{workflow_step}:{step_description["dependencies"]}')
           pre_operator = matching_operator(f'step-{workflow_step}', self.dag)
           pre_operator >> rq_operators_instances[int(workflow_step)-1]
           pre_operator.op_kwargs.update(step_description)
           rq_operators_instances[int(workflow_step)-1].op_kwargs.update({"step_description":step_description})
           given_inputs = [self.workflow[str(workflow_step)].get('input',{})]
           expected_parameters =  dict([(d['name'],d) 
                               for d in 
                               self.workflow[str(workflow_step)]['operation_spec'].get('parameters',[])])
           expected_requestBody =  self.workflow[str(workflow_step)]['operation_spec'].get('requestBody',None)
           if not step_description["dependencies"]:
               setup_operators_instances >> pre_operator 
           else:
               for dependency in step_description["dependencies"]: #{{
                   if dependency["operator"] == "wait": 
                       for dependency_step in dependency["steps"]:
                           rq_operators_instances[int(dependency_step)-1] >> pre_operator

                   elif dependency["operator"] == "pass":
                       for dependency_step in dependency["steps"]:
                           rq_operators_instances[int(dependency_step)-1] >> pre_operator 
                           operation_name = self.workflow[str(dependency_step)]['operation_spec']['operation_id']
                           dependency_endpoint_operator_id =  f'step-{dependency_step}-endpoint-{operation_name}'
                           given_inputs.append(dependency_endpoint_operator_id)

                   elif dependency["operator"] == "flatten": 
                       flatten_inputs = []
                       flatten_operator_ = flatten_operator(f'step-{workflow_step}', self.dag)
                       for dependency_step in dependency["steps"]:
                           rq_operators_instances[int(dependency_step)-1] >> flatten_operator_ 
                           flatten_operator_ >> pre_operator   
                           pre_operator >> rq_operators_instances[int(workflow_step)-1] 

                           operation_name = self.workflow[str(dependency_step)]['operation_spec']['operation_id']
                           dependency_endpoint_operator_id =  f'step-{dependency_step}-endpoint-{operation_name}'
                           flatten_inputs.append(dependency_endpoint_operator_id)

                       flatten_operator_.op_kwargs.update({
                           "given_inputs": flatten_inputs  
                           })

                   elif dependency["operator"] == "concatenate": 
                       concat_operator = concatenate_operator(f'step-{workflow_step}', self.dag)
                       for dependency_step in dependency["steps"]:
                        if isinstance(dependency_step,dict):
                           groupby_operator_ = groupby_operator(f'step-{workflow_step}', self.dag)
                           for dependency_step_ in dependency_step["steps"]:
                               rq_operators_instances[int(dependency_step_)-1] >> groupby_operator_ 
                           groupby_operator_ >> concat_operator
                           concat_operator >> pre_operator
                           pre_operator >>  rq_operators_instances[int(workflow_step)-1]
                        elif isinstance(dependency_step,str):
                           rq_operators_instances[int(dependency_step)-1] >> concat_operator 

                   elif dependency["operator"] == "compose": 
                       compose_operator_ = compose_operator(f'step-{workflow_step}', self.dag)
                       for dependency_step in dependency["steps"]:
                           rq_operators_instances[int(dependency_step)-1] >> compose_operator_
                       compose_operator_ >> pre_operator 
                #}}

           pre_operator.op_kwargs.update({"given_inputs":given_inputs,
                                          "expected_parameters":expected_parameters,
                                          "expected_requestBody":expected_requestBody
                                        })
        #}}

        print(self.dag.tree_view())
        return self.dag
#}}
