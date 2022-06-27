import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AiFillCloseCircle } from "react-icons/ai";
import { ACTIONS } from '../App'

function ServiceForm({ node, 
                       selectedPath,
                       paths,
                       methods, 
                       parameters,
                       requestBody,
                       dispatch }){
    if(requestBody){
        var rqBody_options= Object.keys(requestBody.content).map((method_name) => <option>{method_name}</option>)
    }
    else{
        var rqBody_options= []
    }
    /*
    const paths = Object.keys(node.data.openapi.paths)
                        .map((path_name) => path_name)
    const [selectedPath, setSelectedPath] = useState(paths[0]);
    console.log("------------------SP-------------->");
    console.log(selectedPath)

    const methods = Object.keys(node.data.openapi.paths[selectedPath])
    const [selectedMethod, setSelectedMethod] = useState(methods[0]);
    const parameters = node.data.openapi.paths[selectedPath][selectedMethod]["parameters"];
    */

    return (<div
            style={{
                position: "fixed",
                top: "50px",
                left: "0",
                height: "100%",
                width: "30%",
                zIndex: 999, 
                border: "2px solid black",
                background: "white",
                overflowY: "auto"
            }}
        >
        <h3> { node.data.label } </h3>
        <Button 
            variant="primary" 
            type="submit"
            style={{
                marginTop: "-70px",
                marginLeft: "100%"
            }}
            onClick={ () => dispatch({
                "type": ACTIONS.UNSELECT_NODE,
                "payload":{
                    "id": node.id
                }
            })
           }
        ><AiFillCloseCircle/></Button>
        <Form>
            <Form.Group className="service-leftbar-group" 
                        controlId="exampleForm.ControlSelect1">
                <Form.Label>Select an Endpoint</Form.Label>
            <Form.Control as="select"
                defaultValue={node.workflow.selectedPath}
                onChange={(event)=> dispatch({
                                        "type": ACTIONS.SELECT_FORM_VALUE,
                                        "payload": {
                                            "field":"selectedPath",
                                            "value":event.target.value
                                        }
                                        })
                         }
                >
                {paths.map((path_name) => <option>{path_name}</option>)}
            </Form.Control>
          </Form.Group>
            <Form.Group className="service-leftbar-group" 
                        controlId="exampleForm.ControlSelect2">
                <Form.Label>Select an Request method</Form.Label>
            <Form.Control as="select"
                defaultValue={node.workflow.selectedMethod}
                onChange={(event)=> dispatch({
                                        "type": ACTIONS.SELECT_FORM_VALUE,
                                        "payload": {
                                            "field":"requestBody",
                                            "value":event.target.value
                                        }
                                        })
                         }
             >
            {methods.map((method_name) => <option>{method_name}</option>)}
            </Form.Control>
          </Form.Group>
          { requestBody ? 
            <Form.Group className="service-leftbar-group" 
                        controlId="exampleForm.ControlSelect2">
                <Form.Label>Select a Request Body </Form.Label>
            <Form.Control as="select"
                onChange={(event)=> dispatch({
                                        "type": ACTIONS.SELECT_FORM_VALUE,
                                        "payload": {
                                            "field":"selectedMethod",
                                            "value":event.target.value
                                        }
                                        })
                         }

             >
            {rqBody_options}
            </Form.Control>
            <Form.Control as="textarea" rows={3}
                onChange={(event)=> dispatch({
                                        "type": ACTIONS.SELECT_FORM_VALUE,
                                        "payload": {
                                            "field":"requestBody",
                                            "value":JSON.parse(event.target.value)
                                        }
                                        })
                         }
              >
            </Form.Control>
          </Form.Group>
                            : ''
          }
          <h3> Parameters </h3>
          <Form.Group className="service-leftbar-group" >
            {parameters ? parameters.map((parameter_obj) =>
                <>
                <Form.Label>{parameter_obj["name"]} ({parameter_obj["required"] ? "required" : "optional"}) </Form.Label>
                <Form.Control 
                    type="text" 
                    defaultValue={node.workflow[parameter_obj["name"]] ? node.workflow[parameter_obj["name"]]  :"Enter parameter value"} 
                    placeholder="Enter parameter value" 
                    onChange={(event)=> dispatch({
                                            "type": ACTIONS.SELECT_FORM_VALUE,
                                            "payload": {
                                                "field":parameter_obj["name"],
                                                "value":event.target.value
                                            }
                                            })
                             }
                />
                </>)
                : ''
            }
          </Form.Group>

        </Form>
         <Button 
            className="service-leftbar-button"
            variant="primary" 
            type="submit"
            style={{
                marginBottom: "100px"
            }}
            onClick={(e) => dispatch({
                                "type":ACTIONS.UNSELECT_NODE, 
                                "payload":{
                                    "id": node.id
                                }
                            })
            }
        >
       Save Inputs 
        </Button>
        </div>
    )
}

export default ServiceForm;
