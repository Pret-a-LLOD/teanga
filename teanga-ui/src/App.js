import React, { useReducer, useLayoutEffect, useEffect } from 'react';
import ReactFlow , { addEdge, Controls, ControlButton } from 'react-flow-renderer';
import './App.css';
import ServiceNode from './components/ServiceNode';
import ServiceEdge from './components/ServiceEdge';
import SearchBar from './components/SearchBar';
import ServiceForm from './components/ServiceForm';
import EdgeForm from './components/EdgeForm';
import TeangaNav from './components/TeangaNav';
import { Button } from 'react-bootstrap'
import { AiFillCloseCircle } from "react-icons/ai";
import { parse as parseYAML, stringify } from 'yaml'
import axios from 'axios';

const nodeTypes = {
  teangaNode: ServiceNode,
};

const edgeTypes = {
  teangaEdge: ServiceEdge,
};



const initialState = {
    node_count: 0,
    input: "",
    selected_nodeId: "",
    selected_edgeId: "",
    selectedPath: "",
    selectedMethod: "",
    methods: [],
    paths: [],
    requestBody: {},
    services : [
],
    operators : ["pass","wait","forEach", "concatenate", "merge"],
    elements: [
    /*
      {
        id: '1',
        type: 'special', // input node
        data: { label: 'Input Node' },
        position: { x: 250, y: 25 },
      },
       animated edge
      { id: 'e1-2', source: '1', target: '2', animated: true, style:{background:"red"}},
      { id: 'e2-3', source: '2', target: '3' }
      */
  ]
}

export const ACTIONS = {
    SET_OPENAPI: "set-openapi",
    CREATE_WORKFLOW: "create-workflow",
    UPDATE_INPUT : "update-input",
    ADD_NODE: "add-node",
    ADD_EDGE: "add-edge",
    SELECT_NODE: "select-node",
    UNSELECT_NODE: "unselect-node",
    SELECT_EDGE: "select-edge",
    REMOVE_SELECTED_NODE: "remove-selected-node",
    SELECT_FORM_VALUE: "select-form-value",
    UPDATE_EDGE_TYPE: "update-edge-type"
}

function reducer(state, action) {
    switch(action.type){
        case ACTIONS.SET_OPENAPI: 
            var new_state = {
                ...state,
                services: action.payload.services.map((service, i) => {
                    return {
                        ...service,
                        openapi: action.payload.openapi_yamls[i]
                    }
                })
            }
            return new_state 
        case ACTIONS.CREATE_WORKFLOW:
           console.log("state services",state.services)
           var groupBy_node = {}
           for(var element of state.elements){
               if(element.type === "teangaNode"){
                   if(!groupBy_node.hasOwnProperty(element.id)){
                            groupBy_node[element.id] = {...element.workflow} 
                   }
                   for(var candidate of state.elements){
                        if(candidate.type==="teangaEdge" && candidate.target === element.id){
                                groupBy_node[element.id]["dependencies"] = [...groupBy_node[element.id]["dependencies"]
                                                                               , candidate]
                        }
                   }
               }
           }
          for(var key of Object.keys(groupBy_node)){
              for(var idx in groupBy_node[key]["dependencies"]){
                  var dependecyEdge = groupBy_node[key]["dependencies"][idx] 
                  groupBy_node[key]["dependencies"][idx] = {
                      "operator": dependecyEdge.data.type,
                      "steps": [dependecyEdge.source],
                  }
              }
          }
           console.log(groupBy_node)
           axios.post("/admin/ping", groupBy_node)
            .then(function(response){
                alert("creation sucessful")
                window.resp =  response;
                window.location = '/admin/'
            })
            .catch(function(response){
                alert("creation failed :(");
            })
            return {
                ...state
            }

        case ACTIONS.UPDATE_INPUT:
            return {
                ...state,
                input: action.payload.input
            }
        case ACTIONS.ADD_NODE:
            var selectedService = state.services
                            .filter(
                            (service) => service.name === action.payload.name
                            )[0]
            var openapi = selectedService["openapi"]
            console.log(selectedService)

            var paths = Object.keys(openapi.paths)
                                .map((path_name) => path_name)
            var selectedPath = paths[0]
            var methods = Object.keys(openapi.paths[selectedPath])
            var selectedMethod = methods[0];
            var parameters = openapi.paths[selectedPath][selectedMethod]["parameters"];
            var requestBody = openapi.paths[selectedPath][selectedMethod]["requestBody"]; 
            var operation_id = openapi.paths[selectedPath][selectedMethod]["operationId"]; 
            var new_node = {
                id: (state.node_count + 1).toString(),
                type: 'teangaNode',
                data: { 
                    label: action.payload.name, 
                    selected: false,
                    openapi: openapi
                },
                workflow: {
                    selectedPath: selectedPath, 
                    selectedMethod: selectedMethod,
                    operation_id: operation_id,
                    repo: selectedService["repo"],
                    image_id: selectedService["image_id"],
                    image_tag: selectedService["image_tag"],
                    host_port: selectedService["host_port"],
                    container_port: selectedService["container_port"],
                    input: {},
                    dependencies: []
                },
                position: { x: 50, y: 50 },
              }
            var new_state = {
                ...state,
                node_count: state.node_count + 1,
                elements: state.elements.concat(new_node)
            }
            console.log(new_state);
            return new_state 

        case ACTIONS.ADD_EDGE:
            console.log(action.payload.params)
            var [n1,n2,edge] = addEdge(
                    action.payload.params,
                    [state.elements[0],state.elements[0]]
                )
            var new_state = {
                ...state,
                node_count: state.node_count + 1,
                elements: state.elements.concat(edge)
            }
            return new_state 

        case ACTIONS.SELECT_EDGE:
            var new_state = {
                ...state,
                selected_edgeId: action.payload.id,
                elements: state.elements.map((el) => {
                    if(el.id === action.payload.id){
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: !el.data.selected
                            }
                        }
                    }
                    else {
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: false
                            }
                        }
                    }
                })
            }
            return new_state 

        case ACTIONS.UNSELECT_EDGE:
            var new_state = {
                ...state,
                selected_edgeId: "", 
                elements: state.elements.map((el) => {
                    if(el.id === action.payload.id){
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: false
                            }
                        }
                    }
                    else {
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: false
                            }
                        }
                    }
                })
            }
            return new_state 


        case ACTIONS.SELECT_NODE:
            var selected_nodeId = state.selected_nodeId == action.payload.id ? '' : action.payload.id 
            if(selected_nodeId !== ''){
                var node = state.elements.filter((node)=> node.id === selected_nodeId)[0]
                var paths = Object.keys(node.data.openapi.paths)
                                    .map((path_name) => path_name)
                var selectedPath = node.workflow.selectedPath
                var methods = Object.keys(node.data.openapi.paths[selectedPath])
                var selectedMethod = node.workflow.selectedMethod
                var parameters = node.data.openapi.paths[selectedPath][selectedMethod]["parameters"] ? node.data.openapi.paths[selectedPath][selectedMethod]["parameters"] : [] ;
                var requestBody = node.data.openapi.paths[selectedPath][selectedMethod]["requestBody"] ? node.data.openapi.paths[selectedPath][selectedMethod]["requestBody"] : ''  ; 
            }
            else{
                var paths= []
                var selectedPath= ""
                var methods= []
                var selectedMethod= ""
                var parameters = []
                var requestBody = {}
                
            }
            var new_state = {
                ...state,
                selected_nodeId: selected_nodeId ,
                selectedPath: selectedPath,
                methods: methods,
                selectedMethod: selectedMethod,
                paths: paths,
                parameters: parameters,
                requestBody: requestBody,
                elements: state.elements.map((el) => {
                    if(el.id === action.payload.id){
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: !el.data.selected
                            }
                        }
                    }
                    else {
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: false
                            }
                        }
                    }
                })
            }
            return new_state 

        case ACTIONS.UNSELECT_NODE:
            var new_state = {
                ...state,
                selected_nodeId: "", 
                selectedPath: "",
                selectedMethod: "",
                methods: [],
                paths: [],
                elements: state.elements.map((el) => {
                    if(el.id === action.payload.id){
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: false
                            }
                        }
                    }
                    else {
                        return {
                            ...el,
                            data : {
                                ...el.data,
                                selected: false
                            }
                        }
                    }
                })
            }
            return new_state 

        case ACTIONS.REMOVE_SELECTED_NODE:
            var new_state = {
                ...state,
                selected_nodeId: '',
                elements: state.elements.filter((el) => {
                    if(el.id === action.payload.id){
                        return false;
                    }
                    else if(el.source === action.payload.id || el.target === action.payload.id){
                        return false
                    }
                    else{
                        return true;
                    }
                })
            }
            return new_state
        case ACTIONS.SELECT_FORM_VALUE:
            var selected_nodeId = state.selected_nodeId 
            var new_node = state.elements.filter((node)=> node.id === selected_nodeId)[0]
            var openapi = new_node.data.openapi
            var paths = Object.keys(new_node.data.openapi.paths)
                                .map((path_name) => path_name)
            var selectedPath = action.payload.field == "selectedPath" ?
                                                        action.payload.value :  
                                                        state.selectedPath
            var methods = Object.keys(new_node.data.openapi.paths[selectedPath])
            if(action.payload.field == "selectedMethod"){
                var selectedMethod = action.payload.value; }
            else {
                if(methods.indexOf(state.selectedMethod) !== -1)
                { var selectedMethod = state.selectedMethod }
                else{ var selectedMethod = methods[0] }
            }
            var parameters = openapi.paths[selectedPath][selectedMethod]["parameters"];

            if(["selectedPath","selectedMethod"].indexOf(action.payload.field) === -1)
              { new_node.workflow["input"][action.payload.field] =  action.payload.value; }
            else
              { 
                var operation_id = openapi.paths[selectedPath][selectedMethod]["operationId"]; 
                new_node.workflow = { ...new_node.workflow, 
                                      selectedPath: selectedPath,
                                      selectedMethod: selectedMethod, 
                                      operation_id: operation_id
                                    } 
              }
            console.log(new_node)
            var new_state = {
                ...state,
                elements: state.elements.map((node) =>{ 
                    if(node.id === selected_nodeId){ return new_node }
                    else { return node }
                }),
                selectedPath: selectedPath,
                methods: methods,
                selectedMethod: selectedMethod,
                parameters: parameters
            }
            return new_state
        case ACTIONS.UPDATE_EDGE_TYPE:
            var selected_nodeId = state.selected_nodeId 
            var new_node = state.elements.filter((node)=> node.id === selected_nodeId)[0]
            var openapi = new_node.data.openapi
            var paths = Object.keys(new_node.data.openapi.paths)
                                .map((path_name) => path_name)
            var selectedPath = action.payload.field == "selectedPath" ?
                                                        action.payload.value :  
                                                        state.selectedPath
            var methods = Object.keys(new_node.data.openapi.paths[selectedPath])
            if(action.payload.field == "selectedMethod"){
                var selectedMethod = action.payload.value; }
            else {
                if(methods.indexOf(state.selectedMethod) !== -1)
                { var selectedMethod = state.selectedMethod }
                else{ var selectedMethod = methods[0] }
            }
            var parameters = openapi.paths[selectedPath][selectedMethod]["parameters"];

            if(["selectedPath","selectedMethod"].indexOf(action.payload.field) === -1)
              { new_node.workflow["input"][action.payload.field] =  action.payload.value; }
            else
              { 
                var operation_id = openapi.paths[selectedPath][selectedMethod]["operationId"]; 
                new_node.workflow = { ...new_node.workflow, 
                                      selectedPath: selectedPath,
                                      selectedMethod: selectedMethod, 
                                      operation_id: operation_id
                                    } 
              }
            console.log(new_node)
            var new_state = {
                ...state,
                elements: state.elements.map((node) =>{ 
                    if(node.id === selected_nodeId){ return new_node }
                    else { return node }
                }),
                selectedPath: selectedPath,
                methods: methods,
                selectedMethod: selectedMethod,
                parameters: parameters
            }
            return new_state
        default:
            return state
    }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState) 
  useEffect(
      async () => {
        const servicesResp = await fetch('https://raw.githubusercontent.com/berstearns/personal/main/services').then(response => response.text())
        const services = JSON.parse(servicesResp); 
        const promises = services.map( async (service) => { 
            const openapi = await fetch(service.url).then(response => 
                                                          response.text()) 
            const openapi_obj =  parseYAML(openapi)
            return openapi_obj
        })
       const openapi_yamls = await Promise.all(promises);
       dispatch({
           "type": ACTIONS.SET_OPENAPI,
           "payload":{
               "services": services,
               "openapi_yamls": openapi_yamls
           }
       })
      },[])

  const onConnect = (params) => dispatch({
                                    'type':ACTIONS.ADD_EDGE,
                                    'payload': {
                                        "params": {
                                            ...params,
                                            "id": (state.node_count + 1).toString(),
                                            "type": "teangaEdge",
                                            "data": {
                                                    "type":"pass"
                                                    }
                                                  }
                                    }
                                })
  const onElementClick = (event, element) => {
      if(element.source){
          dispatch({ "type": ACTIONS.SELECT_EDGE,
                     "payload": {
                        "id": element.id
                    }});
      }
      else if(element.id){
          dispatch({ "type": ACTIONS.SELECT_NODE,
                     "payload": {
                        "id": element.id
                    }});
      }
  }
  return (
      <>
      <TeangaNav />
      <div style={{
          width: "100%"
      }}>
      <h3 style={{"display":"inline-block","margin-left":"5%","margin-top":"5%"}}> Build a workflow from the Flow Diagram </h3>
            <Button variant="primary"
                    size="lg"
                    style={{
                        maxWidth: "90%",
                        fontSize: "10px",
                        marginLeft: "30%"
                    }} 
                    onClick={()=> {
                        dispatch({
                            "type": ACTIONS.CREATE_WORKFLOW,
                            "payload": {
                            }
                        })
                    }}
        >Create Workflow</Button>
      </div>
      { state.selected_nodeId ? <ServiceForm 
                                    node={state.elements.filter((node)=> node.id === state.selected_nodeId)[0]}
                                    dispatch={dispatch}
                                    selectedPath={state.selectedPath}
                                    paths={state.paths}
                                    methods={state.methods} 
                                    selectedMethod={state.selectedMethod}
                                    parameters={state.parameters}
                                    requestBody={state.requestBody}
          ></ServiceForm> 
                              : '' }
      { state.selected_edgeId ? <EdgeForm 
                                    edge={state.elements.filter((node)=> node.id === state.selected_edgeId)[0]}
                                    operators={state.operators}
                                    dispatch={dispatch}
          ></EdgeForm> 
                              : '' }
      <div style={{
          background: "white",
          border: "2px solid black",
          padding: "5% 5% 5% 5%",
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "3%"
      }}>
              {state.services.length > 0 ?
              <SearchBar services={state.services} 
                       dispatch={dispatch}
                       input={state.input}
              ></SearchBar> : ''}
              <div id="chart_area">

                    <ReactFlow 
                        elements={state.elements} 
                        onConnect={onConnect}
                        onElementClick={onElementClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        > 
                        <Controls style={{
                            marginLeft:"95%" 
                        }}>
                            <ControlButton onClick={() => dispatch({
                                "type":ACTIONS.REMOVE_SELECTED_NODE,
                                "payload": {
                                    "id": state.selected_nodeId
                                }
                            })
                            }>
                              <AiFillCloseCircle/>
                            </ControlButton>
                        </Controls>
                    </ReactFlow>
              </div>
      </div>
      </>
  );
}

export default App;
