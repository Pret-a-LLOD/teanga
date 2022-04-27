import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AiFillCloseCircle } from "react-icons/ai";
import { ACTIONS } from '../App'

function EdgeForm({ edge, 
                    operators,
                    dispatch }){
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
        <h3> { edge.data.type } </h3>
        <Form>
            <Form.Group className="service-leftbar-group" 
                        controlId="exampleForm.ControlSelect1">
                <Form.Label>Select an Endpoint</Form.Label>
            <Form.Control as="select"
                onChange={(event)=> dispatch({
                                        "type": ACTIONS.UPDATE_EDGE_TYPE,
                                        "payload": {
                                            "field":"type",
                                            "value":event.target.value
                                        }
                                        })
                         }
                >
                {operators.map((path_name) => <option>{path_name}</option>)}
            </Form.Control>
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
                                "type": ACTIONS.UNSELECT_EDGE,
                                "payload":{
                                    "id": edge.id
                                }
                            })
            }
        >
       Save Inputs 
        </Button>
        </div>
    )
}

export default EdgeForm;
