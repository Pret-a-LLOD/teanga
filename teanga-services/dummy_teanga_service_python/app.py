from flask import Flask
from itertools import cycle
from random import randint, choice 
from  string import ascii_lowercase
import json 
from collections import namedtuple

webserver = Flask("myapp")
schemas = {
            "person": {
                "definition": namedtuple('Person', ['name', 'age']),
                "values": {
                    "name": cycle(["John","Maria", "Jose" , "Ana"]), 
                    "age": cycle([randint(18,90) for _ in range(100)]), 
                }
            },
            "animal": {
                "definition": namedtuple('Animal', ['name', 'favorite_food']), 
                "values": {
                    "name": cycle(["cat","dog", "turtle" , "bird"]), 
                    "favorite_food": cycle(["carrot","plants","meat"]), 
                } 
            }
}

@webserver.route("/value/<value_type>")
def value_generator(value_type):
    if value_type in ["string","str"]:
        random_output = "".join(choice(ascii_lowercase) for _ in range(randint(5,20)))
    elif value_type in ["integer","int"]:
        random_output = randint(0,100)
    return json.dumps(random_output)

@webserver.route("/value/arrayof/<number_of_instances>/<value_type>")
def array_generator(number_of_instances, value_type):
    random_outputs = []
    for i in range(int(number_of_instances)):
        if value_type in ["string","str"]:
            random_output = "".join(choice(ascii_lowercase) for _ in range(randint(5,20)))
        elif value_type in ["integer","int"]:
            random_output = randint(0,100)
        random_outputs.append(random_output)
    return json.dumps(random_outputs) 

@webserver.route("/schema/<schema_name>")
def schema_instance_generator(schema_name):
    fields = {_field: next(schemas[schema_name]["values"][_field])  
            for _field in schemas[schema_name]["definition"]._fields} 
    schema_instance = schemas[schema_name]["definition"](**fields)._asdict()
    return json.dumps(schema_instance) 

@webserver.route("/schema//arrayof/<number_of_instances>/<schema_name>")
def array_schema_instances_generator(number_of_instances, schema_name):
    schema_instances = []
    for _ in range(int(number_of_instances)):
        fields = {_field: next(schemas[schema_name]["values"][_field])  
                for _field in schemas[schema_name]["definition"]._fields} 
        schema_instance = schemas[schema_name]["definition"](**fields)._asdict()
        schema_instances.append(schema_instance)
    return json.dumps(schema_instances) 

webserver.run(host="0.0.0.0",port=8080)
