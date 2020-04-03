from datetime import timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago

import sys
import logging
import os
import json
import datetime

def generate_dag(name, description):
    """
    """
#{{
    dag = DAG(
        name,
        default_args=default_args,
        description=description,
        schedule_interval=None,
        is_paused_upon_creation=False,
    )
    return dag
#}}

def generate_pull_operators(list_of_images):
    """
    """
#{
    operators = {}
    for (repo,name,tag,port) in list_of_images:
        if repo:
            full_imagePath = f"{repo}/{name}:{tag}" 
        else:
            full_imagePath = f"{name}:{tag}" 
        task_id=f"pull--{repo}--{name}--{tag}--{port}"
        command=f'docker pull {full_imagePath}'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                provide_context=True,
                xcom_push=True,
        )
    return operators
#}}

def generate_setup_operators(list_of_containers):
    """
    """
#{
    operators = {}
    for (repo,name,tag,port) in list_of_containers:
        if repo:
            image_localId = f"{repo}/{name}:{tag}" 
        else:
            image_localId = f"{name}:{tag}" 
        task_id=f"setup--{name}--{tag}--{port}"
        command=f'docker run --rm -d -p {port}:{port} -e PORT={port} {image_localId}'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    return operators
#}}

def generate_setupOperator_rqService():
    #{{
        operators = {}
        task_id=f"setup--requestService"
        command=f'docker run --rm --network="host" -v {os.environ["TEANGA_DIR"]}/OAS:/teanga/OAS -v {os.environ["TEANGA_DIR"]}/IO:/teanga/IO -dt rq_service'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
        return operators
    #}}

def generate_initWebserver_operators(list_of_containers):
    """
    """
#{
    operators = {}
    for (repo,name,tag,port) in list_of_containers:
        if repo:
            image_localId = f"{repo}/{name}:{tag}" 
        else:
            image_localId = f"{name}:{tag}" 
        setup_task_id=f"setup--{name}--{tag}--{port}"
        task_id=f"initWebserver--{name}--{tag}--{port}"

        command=f'docker exec -d {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}} sh -c "/app/webserver.sh {port}"'
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

def generate_dockercp_operators(list_of_containers):
    """
    """
#{
    operators = {}
    for (repo,name,tag,port) in list_of_containers:
        if repo:
            image_localId = f"{repo}/{name}:{tag}" 
        else:
            image_localId = f"{name}:{tag}" 
        setup_task_id=f"setup--{name}--{tag}--{port}"
        task_id=f"dockercp-OAS--{name}--{tag}--{port}"

        command=f'docker cp {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}:/openapi.yaml /teanga/OAS/{{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}'
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

def generate_executeRequests_operator():
    """
    """
#{
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

def generate_echo_operators(list_of_containers):
    """
    """
#{
    operators = {}
    for (repo,name,tag,port) in list_of_containers:
        if repo:
            image_localId = f"{repo}/{name}:{tag}" 
        else:
            image_localId = f"{name}:{tag}" 
        setup_task_id=f"setup--{name}--{tag}"
        task_id=f"echo--{name}--{tag}"
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

def generate_stop_operators(list_of_containers):
    """
    """
#{{
    operators = {}
    for (repo,name,tag,port) in list_of_containers:
        if repo:
            image_localId = f"{repo}/{name}:{tag}" 
        else:
            image_localId = f"{name}:{tag}" 
        setup_task_id=f"setup--{name}--{tag}--{port}"
        task_id=f"stop--{name}--{tag}--{port}"
        command=f'docker stop {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
        )
    return operators
#}}


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
dag = generate_dag(f"teangaWorkflow","pull images for each given repo")

base_folder=os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
workflow_file = os.path.join(base_folder,"workflows","example_flaskapp.json")
operators_instances = {}

with open(workflow_file) as workflow_input:
    workflow = json.load(workflow_input)

    # instanciate operators
    #{{
    # pull operators_instances 
    images = [(d['repo'],d['image_id'],d['image_tag'],d['port'])
                for d in workflow.values()]
    operators_instances["pull_operators_instances"] = generate_pull_operators(images)

    # services setup operators_instances
    containers = [(d['repo'],d['image_id'],d['image_tag'],d['port'])
                for d in workflow.values()]
    operators_instances["setup_operators_instances"] = generate_setup_operators(containers)
    #operators_instances["setupService_operator"] = generate_setupOperator_rqService(containers)


    # docker cp operators_instances
    containers = [(d['repo'],d['image_id'],d['image_tag'],d['port'])
                for d in workflow.values()]
    operators_instances["dockercp_operators_instances"] = generate_dockercp_operators(containers)

    # docker setup requestService operators_instances
    operators_instances["setupOperator_requestService"] = generate_setupOperator_rqService()
    operators_instances["execOperator_requestService"] = generate_executeRequests_operator()
    # docker stop operators_instances
    containers = [(d['repo'],d['image_id'],d['image_tag'],d['port'])
                for d in workflow.values()]
    #operators_instances["stop_operators_instances"] = generate_stop_operators_instances(containers)
    #}}

    # create graph dependencies
    #{{
    pull_operators_instances = [operator for operator in operators_instances["pull_operators_instances"].values()]
    setup_operators_instances = [operator for operator in operators_instances["setup_operators_instances"].values()]
    dockercp_operators_instances = [operator for operator in operators_instances["dockercp_operators_instances"].values()]
    setupRequestService_operator_instances = [operator for operator in operators_instances["setupOperator_requestService"].values()]
    executeRequest_operator_instance = [operator for operator in operators_instances["execOperator_requestService"].values()]




    for pull_operators_instance in pull_operators_instances:
        pull_operators_instance >> setup_operators_instances
    
    for setup_operator_instance in setup_operators_instances :
       setup_operator_instance >> dockercp_operators_instances

    for docker_operator_instance in dockercp_operators_instances:
      docker_operator_instance >> setupRequestService_operator_instances 

    for setup_operator_instance in setupRequestService_operator_instances:
        setup_operator_instance >> executeRequest_operator_instance
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
