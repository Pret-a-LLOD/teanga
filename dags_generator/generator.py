from datetime import timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago

import sys
import logging
import os
import json
import datetime

def generate_dag(name, description): #{{
    """
    """
    dag = DAG(
        name,
        default_args=default_args,
        description=description,
        schedule_interval=None,
        is_paused_upon_creation=False,
    )
    return dag
#}}

def generate_pull_operators(unique_services): #{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = full_imagePath.replace("/","--").replace(":","--") 
        task_id=f"pull--{airflow_imageName}--{d['port']}"
        check_imageExists = f'$(docker images -q {full_imagePath})'
        pull_command=f'docker pull {full_imagePath}'
        command=f'if [[ {check_imageExists} != "" ]]; then echo {check_imageExists};else {pull_command}; fi'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    '''
    today_date = datetime.datetime.now().strftime("%d%m%Y")
    repo=""# #{
    name="rq_manager"
    tag=today_date
    full_imagePath = f"{name}:{tag}"  
    task_id=f"pull--{repo}--{name}--{tag}"
    command=f'docker pull {full_imagePath}'
    print(command);
    operators[task_id] = BashOperator(
            task_id=task_id,
            bash_command=command,
            dag=dag,
            xcom_push=True,
    )# #}
    '''
    return operators
#}}

def generate_setup_operators(unique_services): #{{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = full_imagePath.replace("/","--").replace(":","--") 
        task_id=f"setup-{airflow_imageName}--{d['port']}"
        command=f"docker run --rm --name {{airflow_imageName}} -d -p {d['host_port']}:{d['container_port']} -e PORT={d['container_port']} {full_imagePath}"
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    return operators
#}}

def generate_setupOperator_rqService(): #{{
        operators = {}
        task_id=f"setup--requestService"
        today_date = datetime.datetime.now().strftime("%d%m%Y")
        command=f'docker run --rm --name requests_manager -dt --network="host" -v {os.environ["TEANGA_DIR"]}/files:/teanga/files -v {os.environ["TEANGA_DIR"]}/OAS:/teanga/OAS -v {os.environ["TEANGA_DIR"]}/IO:/teanga/IO -v {os.environ["TEANGA_DIR"]}/workflows:/teanga/workflows -v {os.environ["TEANGA_DIR"]}/services:/teanga/services  rq_manager:{today_date}'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
        return operators
    #}}

def generate_initWebserver_operators(list_of_containers): #{
    """
    """
    operators = {}
    for workflow_id,service_info in list_of_containers:
        d = service_info
        if d['repo']:
            image_localId = f"{d['repo']}/{d['image_id']}:{d['image_tag']}" 
        else:
            image_localId = f"{d['image_id']}:{d['image_tag']}" 
        setup_task_id=f"setup--workflow_{workflow_id}--{d['image_id']}--{d['image_tag']}--{d['port']}"
        task_id=f"initWebserver--{d['image_id']}--{d['image_tag']}--{d['port']}"

        command=f'docker exec -d {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}} sh -c "/app/webserver.sh {d["port"]}"'
        #f'echo {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}} >> /teanga/text.txt'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    return operators
#}}

def generate_dockercp_operators(workflow_steps): #{
    """
    """
    operators = {}
    for workflow_id,service_instance_info in workflow_steps.items():
        d = service_instance_info
        if d['repo']: full_imagePath = f"{d['repo']}/{d['image_id']}:{d['image_tag']}" 
        else: full_imagePath         = f"{d['image_id']}:{d['image_tag']}" 
        airflow_imageName            = full_imagePath.replace("/","--").replace(":","--") 
        setup_task_id                =f"setup-{airflow_imageName}--{d['port']}"
        task_id                      =f"dockercp-OAS--{airflow_imageName}--{d['port']}--{workflow_id}"

        command=f'docker cp {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}:/openapi.yaml /teanga/OAS/{workflow_id}_{{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}'
        #f'echo {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}} >> /teanga/text.txt'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    return operators
#}}

def generate_executeRequests_operator(): #{
    """
    """
    operators = {}    
    task_id=f"exec--requestService"
    command=f'docker exec {{{{ task_instance.xcom_pull(task_ids="setup--requestService") }}}} sh -c "python3 /teanga/request_manager.py"'
    operators[task_id] = BashOperator(
            task_id=task_id,
            bash_command=command,
            dag=dag,
            xcom_push=True,
    )
    return operators
#}}

def generate_echo_operators(list_of_containers): #{
    """
    """
    operators = {}
    for workflow_id,service_info in list_of_containers:
        d = service_info
        if d['repo']:
            image_localId = f"{d['repo']}/{d['image_id']}:{d['image_tag']}" 
        else:
            image_localId = f"{d['image_id']}:{d['image_tag']}" 
        setup_task_id=f"setup--workflow_{workflow_id}--{d['image_id']}--{d['image_tag']}"
        task_id=f"echo--{d['image_id']}--{d['image_tag']}"
        command=f'echo {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}} >> /teanga/text.txt'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    return operators
#}}

def generate_stop_operators(unique_services): #{{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = full_imagePath.replace("/","--").replace(":","--") 
        setup_task_id=f"setup-{airflow_imageName}--{d['port']}"
        task_id=f"stop-{airflow_imageName}--{d['port']}"
        command=f'docker stop {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
        )
    return operators
#}}

def groupby_services(workflow_filepath):
    import json# #{
    with open(workflow_filepath) as workflow_input:
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
                workflow[workflow_id]['port'] = unique_services[service_id][0][1]['port'] 
                workflow[workflow_id]['host_port'] = unique_services[service_id][0][1]['host_port'] 
                workflow[workflow_id]['container_port'] = unique_services[service_id][0][1]['container_port'] 
    return workflow, unique_services# #}


#{{ dynamic dag setup
global default_args
#{{
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': days_ago(2),
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


dagCreation_timeStr = datetime.datetime.now().strftime("%d_%m_%Y_%H-%M-%S")
global dag
dag = generate_dag(f"teangaWorkflow","runs the workflow described in given workflow json file ")

base_folder=os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
today_date = datetime.datetime.now().strftime("%d%m%Y")
workflow_filename = f'dev_naisc_workflow_{today_date}.json'#"dev_workflow.json"
workflow_filepath = os.path.join(base_folder,"workflows",workflow_filename)
operators_instances = {}

workflow, unique_services = groupby_services(workflow_filepath)
with open(os.path.join(base_folder,"workflows",f'updated_{workflow_filename}'),"w") as updated_workflow:
    updated_workflow.write(json.dumps(workflow))


# instanciate operators
#{{
# pull operators_instances 
operators_instances["pull_operators_instances"] = generate_pull_operators(unique_services)

# services setup operators_instances
operators_instances["setup_operators_instances"] = generate_setup_operators(unique_services)
# docker cp operators_instances
operators_instances["dockercp_operators_instances"] = generate_dockercp_operators(workflow)

# docker setup requestService operators_instances
operators_instances["setupOperator_requestService"] = generate_setupOperator_rqService()
"""
operators_instances["execOperator_requestService"] = generate_executeRequests_operator()
# docker stop operators_instances
operators_instances["stop_operators_instances"] = generate_stop_operators(unique_services)
"""
#}}

# create graph dependencies
#{{
pull_operators_instances = [operator for operator in operators_instances["pull_operators_instances"].values()]
setup_operators_instances = [operator for operator in operators_instances["setup_operators_instances"].values()]
dockercp_operators_instances = [operator for operator in operators_instances["dockercp_operators_instances"].values()]
setupRequestService_operator_instances = [operator for operator in operators_instances["setupOperator_requestService"].values()]
"""
executeRequest_operator_instance = [operator for operator in operators_instances["execOperator_requestService"].values()]
stop_operators_instance = [operator for operator in operators_instances["stop_operators_instances"].values()]
"""

for pull_operators_instance in pull_operators_instances:
    pull_operators_instance >> setup_operators_instances

for setup_operator_instance in setup_operators_instances :
   setup_operator_instance >> dockercp_operators_instances


for docker_operator_instance in dockercp_operators_instances:
  docker_operator_instance >> setupRequestService_operator_instances 

"""
for setup_operator_instance in setupRequestService_operator_instances:
    setup_operator_instance >> executeRequest_operator_instance

for executeRequest_operator_instance_ in  executeRequest_operator_instance:
    executeRequest_operator_instance_ >> stop_operators_instance
"""
#}}
#}}

#{{ main
if __name__ != "__main__":
    print("_"*80)
    print("importing dag configuration \n"*1)
    print("_"*80)

if __name__ == "__main__":
    print("_"*80)
    print("generating dag file in the dag folder"*1)
    print("_"*80)

    fileCreation_timeStr = datetime.datetime.now().strftime("%d_%m_%Y_%H:%M:%S")
    operators_str = "\n".join([f"{key}=operators_instances['{key}']" for key in operators_instances.keys()]) 
    with open("./dags_generator/dag_template") as template,\
            open(f"./dags/dag_instance.py","w") as template_instance:
                template_str = template.read()
                template_str = template_str.replace("{%OPERATORS%}",operators_str)
                template_instance.write(template_str)
#}}
