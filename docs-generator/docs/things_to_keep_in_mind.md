- teanga assumes you are running the commands from the root folder of the project 
- Teanga use the default folders openapi-specifications, workflows, files, outputs
- Teanga use the pretallod docker hub repo, using the month tag -> i will change to a latest tag
- the cli assumes all parameters are given in the format -p value , -p2 value2
- the cli assumes that two first parameters are [COMMAND] and [SERVICE] if num of params is 1 it is a command
- start command is only valid without params
- teanga stop command should be idempotent running more than once does not anything
- teanga start command should be idempotent running more than once does not anything
- if you create two workflow with the same filename it will overwrite the first one
- We assume the content response of an endpoint in the openapi spec is either application/json or text/plain this happens in Workflow.py the flattening operation spec function
- teanga dependency format is       
      {
        "operator": "pass",
        "steps": [
          "1"
        ]
      }
-
