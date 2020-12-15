from airflow.operators.bash_operator import BashOperator
from airflow.operators import PythonOperator
import logging
import json
import requests

def generate_pull_operators(unique_services, dag): #{
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

def generate_setup_operators(unique_services, dag): #{{
    """
    """
    operators = {}
    for full_imagePath, services_instances in unique_services.items():
        d = services_instances[0][1]
        airflow_imageName = full_imagePath.replace("/","--").replace(":","--") 
        task_id=f"setup-{airflow_imageName}--{d['port']}"
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

def request_function(**kwargs): #{{
    print(kwargs['ti'])
    return 1

def request_operator(id):
    operators = {}    
    task_id=f"request--{id}"
    return PythonOperator(
        task_id=task_id,
        python_callable=request_function,
        op_kwargs={'id': id},
        dag=dag)
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
    step, operation_id = kwargs['task_instance'].task_id.split("-endpoint")
    matching_operator_id =  f'{step}-matching'
    matching_output = kwargs['task_instance'].xcom_pull(task_ids=matching_operator_id)
    inputs = matching_output['inputs']

    def setup_request(named_inputs,#{{
                    endpoint,
                    request_method,
                    host_port):
        remaining_inputs = {k: d["value"] for k,d in named_inputs.copy().items() if d.get("value",False)}
        for name, input_dict in named_inputs.items():
            if input_dict.get("name",False) and  f'{{{input_dict["name"]}}}' in endpoint:
                endpoint = endpoint.replace(f'{{{input_dict["name"]}}}',str(input_dict["value"]))
                remaining_inputs.pop(input_dict["name"],None);
        url = f'http://host.docker.internal:{host_port}{endpoint}'
        if named_inputs.get("files",False):
            logging.info(url)
            logging.info(remaining_inputs)
            data =  remaining_inputs.pop("files",None)
            if isinstance(data,dict) or isinstance(data,list) :
                headers= {'Content-Type': 'application/json'}
                request_ = requests.Request(
                              method=request_method.upper(),
                              headers=headers,
                              url=url,
                              params=remaining_inputs,
                              data=json.dumps(data))
            else:
                headers= {'Content-Type': 'application/rdf+xml'}
                request_ = requests.Request(
                              method=request_method.upper(),
                              headers=headers,
                              url=url,
                              params=remaining_inputs,
                              data=data)
        else:
            logging.info(url)
            logging.info(remaining_inputs)
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
                                    "name":kwargs['step_description']['operation_spec']["response_schema_item_name"]
                                }
                }
                response.update(kwargs['step_description']['operation_spec']["response_schema"])
            else: 
                response = session.send(request_).text.encode("utf-8")
        else:
            response = session.send(request_).text.encode("utf-8")
        responses.append(response)
    return responses   
#}

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

def flatten_operator(id):#{{
    operators = {}    
    task_id=f"flatten--{id}"
    command=f'echo testing'
    return BashOperator(
            task_id=task_id,
            bash_command=command,
            dag=dag,
            xcom_push=True,
    )
#}}

def concatenate_operator(id):#{{
    operators = {}    
    task_id=f"concatenate--{id}"
    command=f'echo testing'
    return BashOperator(
            task_id=task_id,
            bash_command=command,
            dag=dag,
            xcom_push=True,
    )
#}}

def compose_operator(id):#{{
    operators = {}    
    task_id=f"compose--{id}"
    command=f'echo testing'
    return BashOperator(
            task_id=task_id,
            bash_command=command,
            dag=dag,
            xcom_push=True,
    )
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
    # 1 inputs -> "expected_requestBody" "expected_parameters" and "given_inputs" 
    # 2 check if there's user input and depencencies input
    # 3 match
    for idx, input_source in enumerate(kwargs['given_inputs']):
        if isinstance(input_source,dict):
            pass
        elif isinstance(input_source,str):

            logging.info(input_source)
            kwargs['given_inputs'].pop(idx)
            for dict_ in kwargs['task_instance'].xcom_pull(task_ids=input_source):
                kwargs['given_inputs'].append(dict_)

    expected_inputs = kwargs["expected_parameters"]
    # check if file is required
    if kwargs.get("expected_requestBody", False):
        rqB =  kwargs["expected_requestBody"]
        if rqB["content"].get("application/json",False):
            expected_schema_name  = rqB["content"]["application/json"]["schema"]["$ref"].split("/")[-1]
            expected_inputs[expected_schema_name] = True
        else: 
            expected_inputs['files'] = kwargs["expected_requestBody"] 

    # creating given inputs to have given values from user and dependencies
    # but also the information from the OAS description
    given_inputs_dict = {}
    for inputs_dict in kwargs['given_inputs']:
        for input_key, input_value in inputs_dict.items():
            given_inputs_dict[input_key]= {
                 "value": input_value
                }

    
    missing_expected_inputs = {}
    isCollection = None
    for expected_input, expected_details in expected_inputs.items():
        if given_inputs_dict.get(expected_input,False):
            try: given_inputs_dict[expected_input].update(expected_details)
            except:
                logging.info(expected_details)
                logging.info(expected_input)
            if given_inputs_dict[expected_input].get("type", None ) == "array": 
                isCollection = expected_input
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
        
    '''
    if isCollection:
        given_inputs_per_item = [] 
        for item in given_inputs_dict[expected_input][isCollection].value: 
            item_inputs = given_inputs_dict.copy()
            items_inputs[isCollection].value = item
            given_inputs_per_item.append(item_inputs)
        return given_inputs_per_item 
    '''

    if missing_expected_inputs:
        raise Exception("Missing inputs")
    else:
        return {
            "inputs":given_inputs_dict
            }



def match_input(currService_flattenedOAS, given_input, dependecies_inputs, dependecies_outputs):
    print(f"{'#'*31}") 
    print(f"{'#'*4} Beginning of Matching {'#'*4}") 
    print(f"{'#'*31}") 
    service_input = {}
    named_candidates = ChainMap(given_input, *dependecies_outputs, *dependecies_inputs)
    schemas_candidates = ChainMap(*dependecies_outputs, *dependecies_inputs)
    missing_parameters = []
    for expected_parameter in currService_flattenedOAS["parameters"]:
        parameter_name = expected_parameter['name']
        value = named_candidates.get(parameter_name, False)
        if value == False: missing_parameters.append(parameter_name)
        else: 
            expected_schema = [d for d 
                    in currService_flattenedOAS["parameters"] 
                    if d["name"] == parameter_name ][0] 
            service_input[parameter_name] = {"value":value} 
            service_input[parameter_name].update(expected_schema)

    print(f'expected inputs: {[d["name"] for d in currService_flattenedOAS["parameters"]]}')
    print(f'User input: {given_input}')
    if len(json.dumps(dependecies_inputs)) > 200: Idisplay = json.dumps(dependecies_inputs)[:100]
    else : Idisplay = json.dumps(dependecies_inputs)
    print(f'Dependencies INP: {Idisplay}')
    if len(json.dumps(dependecies_inputs)) > 200: Odisplay = json.dumps(dependecies_outputs)[:100]
    else : Odisplay = json.dumps(dependecies_outputs)
    print(f'Dependencies OUT: {Odisplay}')
    print(f'Missing parameters after matching: {missing_parameters}')


    requests_inputs = []
    if currService_flattenedOAS["requestBody"]:
        print(f'expected requestBody: {currService_flattenedOAS["requestBody"]}')
        # if there is input files, put then in requestBody
        if len(given_input.get("files",[])) == 1:
            requestBody_value = open(join("files",given_input["files"][0])).read()
            service_input["request_body"] = {"value":requestBody_value}
            requests_inputs.append(service_input)
        elif len(given_input.get("files",[])) > 1: 
            raise Exception("sending multiple files still not implemented")
        # if there is no input files, check if expected requestBody schema matches with dpdcies
        else:
            expected_schema = currService_flattenedOAS["requestBody"]\
                        ['content']['application/json']['schema']
            if expected_schema.get('$ref',False):
                expected_schema_name = expected_schema["$ref"].split("/")[-1]
                is_collection_expected = False
            elif expected_schema.get('items',False): 
                expected_schema_name = expected_schema['items']\
                                        ['$ref'].split("/")[-1]
                is_collection_expected = True 
            else:
                raise Exception("expected schema not valid")
            print(expected_schema_name)
            for d in dependecies_outputs:
                if d.get(expected_schema_name,False):
                    raise Exception("direct schema match not implemented yet")
                elif d.get(None, False):
                    if d[None]['schema_info']['name'] == None \
                       and d[None]['schema_info']['schema']['type'] == 'array' :
                           array_item_type = d[None]['schema_info']['schema']['items']['$ref'].split("/")[-1]
                           print(f'dnone: {d[None]}')
                           if expected_schema_name == array_item_type:
                               items = d[None]['value']
                               for idx, item in enumerate(items):
                                   if is_collection_expected:
                                       if "requestBody_value" in locals():
                                           requestBody_value.append(item)
                                       else:
                                           requestBody_value = [item]
                                   else:
                                       item_request = copy.copy(service_input)
                                       requestBody_value = item
                                       item_request["request_body"] = {"value":requestBody_value}
                                       requests_inputs.append(item_request)
                           else:
                               import ipdb;ipdb.set_trace()
                else:
                    raise Exception("requestBody not defined")
            if is_collection_expected:
                service_input["request_body"] = {"value":requestBody_value}
                requests_inputs.append(service_input)
    else:
        requests_inputs.append(service_input)



        """
        #schema_name = currService_flattenedOAS["requestBody"]['content']['application/json']['schema']['$ref'].split("/")[-1]
        requestBody_value = schemas_candidates.get(schema_name, {"value":{}})
        expected_requestBody_schema = currService_flattenedOAS['schemas'][schema_name]
        service_input["request_body"] = requestbody_value
        schema_name = currService_flattenedOAS["response_schemas"]["$ref"].split("/")[-1]
        requestBody_value = currService_flattenedOAS["schemas"][schema_name]
        """

    # expected output info
    if currService_flattenedOAS.get("response_schemas",False):
        if currService_flattenedOAS["response_schemas"]["type"] == "array":
            expected_output_schema = {"name":  None,
                                      "schema": currService_flattenedOAS["response_schemas"]
                                     }  
        else:
            expOut_name = currService_flattenedOAS["response_schemas"]["$ref"].split("/")[-1]
            expected_output_schema = {"name":expOut_name,
                                      "schema":currService_flattenedOAS["schemas"][expOut_name]}  
    else:
        expected_output_schema = None

    print(f"{'#'*4} End of Matching ") 
    if len(json.dumps(service_input)) > 500: print_input =json.dumps(service_input)[:500] 
    else: print_input =json.dumps(service_input)
    print(f'SERVICE INPUT: {print_input}')
    return requests_inputs, expected_output_schema 

#}}

def groupby_operator(id):#{{
    operators = {}    
    task_id=f"groupby--{id}"
    command=f'echo testing'
    return BashOperator(
            task_id=task_id,
            bash_command=command,
            dag=dag,
            xcom_push=True,
    )
#}}G

