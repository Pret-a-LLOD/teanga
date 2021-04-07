from airflow.operators.bash_operator import BashOperator
from airflow.operators import PythonOperator
import logging
import json
import requests
import ast

def generate_pull_operators(unique_services, dag): #{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = f'teanga-{full_imagePath.replace("/","--").replace(":","--")}' 
        task_id=f"pull--{airflow_imageName}--{d['host_port']}"
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

def generate_setup_operators(unique_services, dag): #{{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = f'teanga-{full_imagePath.replace("/","--").replace(":","--")}' 
        task_id=f"setup-{airflow_imageName}--{d['host_port']}"
        command=f"docker run --rm --name {airflow_imageName} -d -p {d['host_port']}:{d['container_port']} -e PORT={d['container_port']} {full_imagePath}"
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
                xcom_push=True,
        )
    return operators
#}}

def generate_validateWorkflow_operator(): #{
    """
    """
    operators = {}    
    task_id=f"validating--workflow"
    command=f'python3 /teanga/workflow_validation.py'
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

def generate_stop_operators(unique_services): #{{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = f'teanga-{full_imagePath.replace("/","--").replace(":","--")}' 
        setup_task_id=f"setup-{airflow_imageName}--{d['host_port']}"
        task_id=f"stop-{airflow_imageName}--{d['host_port']}"
        command=f'docker stop {{{{ task_instance.xcom_pull(task_ids="{setup_task_id}") }}}}'
        print(command);
        operators[task_id] = BashOperator(
                task_id=task_id,
                bash_command=command,
                dag=dag,
        )
    return operators
#}}

def flatten_operator(airflowOperator_id, dag):#{{
    operators = {}    
    task_id=f"flatten-{airflowOperator_id}"
    command=f'echo testing'
    return PythonOperator(
            task_id=task_id,
            python_callable=flatten_function,
            dag=dag,
            xcom_push=True,
            provide_context=True
    )

def flatten_function(*args,**kwargs):
    '''
        - inputs :
            kwargs :
                - type: dict
                - keys:
                    - given_inputs
                        - type : list
                        - items :
                            - type : dict 

        Its expected that every value in                     
        given_inputs dictionaries are a list 
        of objects with the same schema
    '''
    #{{
    for idx, input_source in enumerate(kwargs['given_inputs']):
        if isinstance(input_source,dict):
            pass
        elif isinstance(input_source,str):
            kwargs['given_inputs'].pop(idx)
            for list_ in kwargs['task_instance'].xcom_pull(task_ids=input_source):
                kwargs['given_inputs'].append(list_)

    logging.info(f"kwargs: {kwargs['given_inputs']}")
    flattened_elements = []
    for idx, schema_dict in enumerate(kwargs['given_inputs']):
            logging.info(schema_dict.items())
            for schema_name, schema_info in schema_dict.items():
                if not isinstance(schema_info, dict):
                   continue 
                logging.info(schema_info)
                logging.info(schema_info.keys())
                schema = schema_info["schema"]
                list_of_objects = schema_info["value"]
                for object in list_of_objects:
                    object.update({"groupById": f"{order_idx}"})
                    flattened_elements.append({k:v for k,v in object.items()})
    return {
            schema_name: {
            "value":flattened_elements,
            "schema": schema 
            }
        }
    #}}
#}}

def matching_operator(airflowOperator_id, dag):#{{ 
    operators = {}    
    task_id=f"{airflowOperator_id}-matching"
    return PythonOperator(
        task_id=task_id,
        python_callable=matching_function,
        provide_context=True,
        op_kwargs={'airflowOperator_id': airflowOperator_id},
        dag=dag)

def matching_function(*args, **kwargs):
    """
        - inputs
            kwargs: dict, 
            {
                "given_inputs": [dict or str],
                "expected_parameters": [str],
                "expected_requestBody": dict or None,

            }
        - outputs: dict,
        {
            "inputs": dict or [dict],
            "json_inputs": True or None,
            "header": string or None 
        }
    """
    # 1 inputs -> "expected_requestBody" "expected_parameters" and "given_inputs" 
    # 2 check if there's user input and depencencies input
    # 3 match
    #{{
    # if input is dictionary, it's a name -> value pair
    # if is a string, it's a reference for another airflow operator output
    logging.info(f"given inputs: {kwargs['given_inputs']}")
    for idx, input_source in enumerate(kwargs['given_inputs']):
        if isinstance(input_source,dict):
            pass
        elif isinstance(input_source,str):
            kwargs['given_inputs'].pop(idx)

            logging.info(f"input source: {input_source}")
            abc = kwargs['task_instance'].xcom_pull(task_ids=input_source)
            logging.info(f"pull: {abc}")
            for dict_ in abc:
                logging.info(f"XCOM DICT: {dict_}")
                kwargs['given_inputs'].append(dict_)

    expected_inputs = kwargs["expected_parameters"]
    # check if file is required
    if kwargs.get("expected_requestBody", False):
        rqB =  kwargs["expected_requestBody"]
        if rqB["content"].get("application/json",False):
            expected_schema_name  = rqB["content"]["application/json"]["schema"]["$ref"].split("/")[-1]
            expected_inputs[expected_schema_name] = rqB["content"]["application/json"]["schema"]
        else: 
            expected_inputs['files'] = kwargs["expected_requestBody"] 

    # creating given inputs to have given values from user and dependencies
    # but also the information from the OAS description
    given_inputs_dict = {}
    for inputs_dict in kwargs['given_inputs']:
        for input_key, input_value in inputs_dict.items():
            if isinstance(input_value, dict):
                given_inputs_dict[input_key]= input_value 
            else:
                given_inputs_dict[input_key]= {
                     "value": input_value,
                     "name": input_key
                    }


    
    missing_expected_inputs = {}
    isCollection = False 
    logging.info(expected_inputs)
    for expected_input, expected_details in expected_inputs.items():
        if given_inputs_dict.get(expected_input,False):
            logging.info(f"EI: expected input {expected_input}")
            logging.info(f"ED: expected details {expected_details}")
            logging.info(f"GIVEN: expected details {given_inputs_dict[expected_input].keys()}")
            logging.info(f"GIVEN: expected details {given_inputs_dict[expected_input].get('schema',None)}")
            if given_inputs_dict[expected_input].get("schema", {} ).get("type",None) == "array": 
                isCollection = expected_input
            else:
                #given_inputs_dict[expected_input].update(expected_details)
                pass
        else:
            missing_expected_inputs[expected_input] = expected_details 

    #for expected_input, expected_details in expected_inputs.items():
    # if many -> one 
    #(given input is a schema of type array of a certain schema and expected input is that certain schema)  
    

    if given_inputs_dict.get("files",False):
        files = []
        files_name = given_inputs_dict["files"]["value"]
        if len(files_name) == 1:
            filename = files_name[0]
            given_inputs_dict["files"]["value"] = open(f'/teanga/files/{filename}').read()
        else:
            for filename in files_name:
                file_content = open(f'/teanga/files/{filename}')
                files.append(file_content) 
    logging.info(f"Iscollection: {isCollection}")


    if missing_expected_inputs:
        logging.info("Missing")
        for expected_input, expected_details in missing_expected_inputs.items():
            if expected_details.get("required",None) != None:
                if expected_details["required"] == True:
                    logging.info(expected_details)
                    raise Exception("Missing inputs")
                else:
                    continue
            else:
                logging.info(expected_details)
                raise Exception("Missing inputs")
        return {
            "header": {'Content-Type': 'application/json'},
            "inputs":given_inputs_dict
            }
    elif isCollection:
        given_inputs_per_item = [] 
        logging.info(f"Is collection! {given_inputs_dict[isCollection]['value']}")
        for item in given_inputs_dict[isCollection]["value"]: 
            logging.info(item)
            given_inputs_per_item.append(
                    dict({k:v for k,v in  given_inputs_dict.items()},
                        **{isCollection:{"value": {k:v for k,v in  item.items()}}})
                    )
        return {
                "header": {'Content-Type': 'application/json'},
                "json_input": isCollection,
                "inputs":given_inputs_per_item 
                }
    else:
        return {
            "inputs":given_inputs_dict
            }
#}}

#}}

def generate_endpointRequest_operator(workflow_step, endpoint_name,endpoint_info, dag):#{
    operator = PythonOperator(
        task_id=f'step-{workflow_step}-endpoint-{endpoint_name}',
        provide_context=True,
        python_callable=endpointRequest_function,
        op_kwargs={},
        dag=dag,
    )
    return operator 

def endpointRequest_function(*args, **kwargs):
        #{{
        step, operation_id = kwargs['task_instance'].task_id.split("-endpoint")
        matching_operator_id =  f'{step}-matching'
        matching_output = kwargs['task_instance'].xcom_pull(task_ids=matching_operator_id)
        inputs = matching_output.get('inputs', None)
        header = matching_output.get('header', None)
        logging.info(inputs)
        def setup_request(named_inputs,#{{
                        endpoint,
                        request_method,
                        host_port):
            #remaining_inputs = {k: d["value"] for k,d in named_inputs.copy().items() if d.get("value",False)}
            remaining_inputs = {k: d["value"] if d.get("value",False) else d for k,d in named_inputs.copy().items() }
            for name, input_dict in named_inputs.items():
                if input_dict.get("name",False) and  f'{{{input_dict["name"]}}}' in endpoint:
                    endpoint = endpoint.replace(f'{{{input_dict["name"]}}}',str(input_dict["value"]))
                    remaining_inputs.pop(input_dict["name"],None);
            url = f'http://host.docker.internal:{host_port}{endpoint}'
            logging.info(url)
            if named_inputs.get("files",False):
                data =  remaining_inputs.pop("files",None)
                if isinstance(data,dict) or isinstance(data,list) :
                    headers= {'Content-Type': 'application/json'}
                    request_ = requests.Request(
                                  method=request_method.upper(),
                                  headers=headers,
                                  url=url,
                                  params=remaining_inputs,
                                  data=data['value'])#json.dumps(data))
                else:
                    headers= {'Content-Type': 'application/rdf+xml'}
                    request_ = requests.Request(
                                  method=request_method.upper(),
                                  headers=headers,
                                  url=url,
                                  params=remaining_inputs,
                                  data=data)
            else:
                if header:
                    #data = remaining_inputs.pop(matching_output["json_input"]) 
                    if len(remaining_inputs.keys()) == 1:
                        data = remaining_inputs[list(remaining_inputs.keys())[0]]
                    else:
                        logging.info(remaining_inputs)
                        raise Exception("more than one remaining input to attach in request body")
                    request_ = requests.Request(
                                  method=request_method.upper(),
                                  headers=header,
                                  url=url,
                                  params=remaining_inputs,
                                  data=json.dumps(data))
                else:
                    request_ = requests.Request(
                            method=request_method.upper(),
                            params=remaining_inputs,
                                  url=url)
            request_ = request_.prepare()
            return request_ 
            #}}

        if isinstance(inputs,list):
            requests_ = [setup_request(inputs_dict,
                                     kwargs['step_description']['operation_spec']["endpoint"],
                                     kwargs['step_description']['operation_spec']["request_method"],
                                     kwargs['step_description']["host_port"])
                                     for inputs_dict in inputs ]

        elif isinstance(inputs,dict): 
            requests_ = [setup_request(inputs,
                                     kwargs['step_description']['operation_spec']["endpoint"],
                                     kwargs['step_description']['operation_spec']["request_method"],
                                     kwargs['step_description']["host_port"])]

        session = requests.Session()
        session.trust_env = False
        responses = []
        for request_ in requests_:
            if kwargs['step_description']['operation_spec']["sucess_response"].get("content", False):
                content = kwargs['step_description']['operation_spec']["sucess_response"].get("content")
                if content.get("application/json", {}).get("schema",{}).get("type",None) == "array":
                    response = {
                    kwargs['step_description']['operation_spec']["response_schema_item_name"]: {
                                        "value":eval(session.send(request_).text.encode("utf-8")),
                                        "name":kwargs['step_description']['operation_spec']["response_schema_item_name"],
                                        "schema":kwargs['step_description']['operation_spec']["response_schema"]
                                    }
                    }
                    #response.update(kwargs['step_description']['operation_spec']["response_schema"])

                elif content.get("application/json", {}).get("schema",{}).get("$ref",None):
                        response = {
                        kwargs['step_description']['operation_spec']["response_schema_name"]: {
                                            "value":eval(session.send(request_).text.encode("utf-8")),
                                            "name":kwargs['step_description']['operation_spec']["response_schema_name"],
                                            "schema":kwargs['step_description']['operation_spec']["response_schema"]
                                        }
                        }
                        #response.update(kwargs['step_description']['operation_spec']["response_schema"])

                else: 
                    response = session.send(request_).text.encode("utf-8")
            else:
                response = session.send(request_).text.encode("utf-8")
            responses.append(response)
        return responses   
    #}}
#}

def groupby_operator(id, dag):#{{
    operators = {}    
    task_id=f"groupby--{id}"
    return PythonOperator(
            task_id=task_id,
            python_callable=groupby_function,
            dag=dag,
            xcom_push=True,
            provide_context=True
    )


def groupby_function(*args,**kwargs):
    '''
    '''
    try:
    #{{
        for idx, input_source in enumerate(kwargs['given_inputs']):
            if isinstance(input_source,dict):
                pass
            elif isinstance(input_source,str):
                kwargs['given_inputs'].pop(idx)
                for list_ in kwargs['task_instance'].xcom_pull(task_ids=input_source):
                    kwargs['given_inputs'].append(list_)

        logging.info(f"kwargs: {kwargs['given_inputs']}")
        flattened_elements = []
        for idx, schema_dict in enumerate(kwargs['given_inputs']):
                logging.info(schema_dict.items())
                for schema_name, schema_info in schema_dict.items():
                    if not isinstance(schema_info, dict):
                       continue 
                    logging.info(schema_info)
                    logging.info(schema_info.keys())
                    schema = schema_info["schema"]
                    list_of_objects = schema_info["value"]
                    for object in list_of_objects:
                        object.update({"groupById": f"{order_idx}"})
                        flattened_elements.append({k:v for k,v in object.items()})
        return {
                schema_name: {
                "value":flattened_elements,
                "schema": schema 
                }
            }
    #}}
    except:
        return 1
#}}

def compose_operator(id, dag):#{{
    operators = {}    
    task_id=f"compose--{id}"
    command=f'echo testing'
    return PythonOperator(
            task_id=task_id,
            python_callable=compose_function,
            dag=dag,
            xcom_push=True,
            provide_context=True
    )

def compose_function(*args,**kwargs):
    '''
    '''
    try:
    #{{
        for idx, input_source in enumerate(kwargs['given_inputs']):
            if isinstance(input_source,dict):
                pass
            elif isinstance(input_source,str):
                kwargs['given_inputs'].pop(idx)
                for list_ in kwargs['task_instance'].xcom_pull(task_ids=input_source):
                    kwargs['given_inputs'].append(list_)

        logging.info(f"kwargs: {kwargs['given_inputs']}")
        flattened_elements = []
        for idx, schema_dict in enumerate(kwargs['given_inputs']):
                logging.info(schema_dict.items())
                for schema_name, schema_info in schema_dict.items():
                    if not isinstance(schema_info, dict):
                       continue 
                    logging.info(schema_info)
                    logging.info(schema_info.keys())
                    schema = schema_info["schema"]
                    list_of_objects = schema_info["value"]
                    for object in list_of_objects:
                        object.update({"groupById": f"{order_idx}"})
                        flattened_elements.append({k:v for k,v in object.items()})
        return {
                schema_name: {
                "value":flattened_elements,
                "schema": schema 
                }
            }
    #}}
    except:
        return 1
#}}

def concatenate_operator(id, dag):#{{
    operators = {}    
    task_id=f"concatenate-{id}"
    command=f'echo testing'
    return PythonOperator(
            task_id=task_id,
            python_callable=compose_function,
            dag=dag,
            xcom_push=True,
            provide_context=True
    )
def concatenate_function(*args,**kwargs):
    '''
    '''
    try:
    #{{
        for idx, input_source in enumerate(kwargs['given_inputs']):
            if isinstance(input_source,dict):
                pass
            elif isinstance(input_source,str):
                kwargs['given_inputs'].pop(idx)
                for list_ in kwargs['task_instance'].xcom_pull(task_ids=input_source):
                    kwargs['given_inputs'].append(list_)

        logging.info(f"kwargs: {kwargs['given_inputs']}")
        flattened_elements = []
        for idx, schema_dict in enumerate(kwargs['given_inputs']):
                logging.info(schema_dict.items())
                for schema_name, schema_info in schema_dict.items():
                    if not isinstance(schema_info, dict):
                       continue 
                    logging.info(schema_info)
                    logging.info(schema_info.keys())
                    schema = schema_info["schema"]
                    list_of_objects = schema_info["value"]
                    for object in list_of_objects:
                        object.update({"groupById": f"{order_idx}"})
                        flattened_elements.append({k:v for k,v in object.items()})
        return {
                schema_name: {
                "value":flattened_elements,
                "schema": schema 
                }
            }
    #}}
    except:
        return 1
#}}
