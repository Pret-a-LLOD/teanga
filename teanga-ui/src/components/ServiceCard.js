import React from 'react';
import { Card , Button } from 'react-bootstrap'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { ACTIONS } from '../App'

function ServiceCard({ name, key, selected, dispatch }) {
    return (
        <Card border={selected ? "danger" : "primary"} 
              style={{ 
            marginLeft: "0.5vw",
            marginRight: "0.5vw",
            width: '15vw', 
            borderRadius: '10px'
        }} >
          <Card.Body>
            <Card.Title
                    style={{
                        maxWidth: "90%",
                        fontSize: "10px"
                    }}>{name}</Card.Title>
            <Button variant="primary"
                    size="sm"
                    style={{
                        maxWidth: "90%",
                        fontSize: "10px"
                    }} 
                    onClick={()=> {
                        dispatch({
                            "type": ACTIONS.ADD_NODE,
                            "payload": {
                                "name": name
                            }
                        })
                    }}
        >Add to Workflow</Button>
          </Card.Body>
        </Card>
    )
}

export default ServiceCard


