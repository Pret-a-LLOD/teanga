(this["webpackJsonpreact-flow-101"]=this["webpackJsonpreact-flow-101"]||[]).push([[0],{53:function(e,t,a){},55:function(e,t,a){},58:function(e,t,a){},84:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a(14),s=a.n(r),c=(a(53),a(15)),o=a.n(c),d=a(29),l=a(25),i=a(47),p=a(22),u=a(5),j=a(13),h=(a(55),a(3)),b=function(e){var t=e.data;return Object(h.jsxs)("div",{className:t.selected?"flowchart-operator-new selected-node":"flowchart-operator-new",children:[Object(h.jsx)(j.c,{className:"handle-left",type:"target",position:"left"}),Object(h.jsx)("div",{className:"handle-title",children:t.label}),Object(h.jsx)(j.c,{className:"handle-right",type:"source",position:"right",style:{borderRadius:0}})]})},m=function(e){var t=e.id,a=e.sourceX,n=e.sourceY,r=e.targetX,s=e.targetY,c=e.sourcePosition,o=e.targetPosition,d=e.style,l=void 0===d?{strokeWidth:10,stroke:"rgb(92, 184, 92)"}:d,i=e.data,p=e.arrowHeadType,u=e.markerEndId,b=Object(j.f)({sourceX:a,sourceY:n,sourcePosition:c,targetX:r,targetY:s,targetPosition:o}),m=Object(j.g)(p,u);return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)("path",{id:t,style:l,className:"react-flow__edge-path",d:b,markerEnd:m}),Object(h.jsx)("text",{children:Object(h.jsx)("textPath",{href:"#".concat(t),style:{fontSize:"12px"},startOffset:"50%",textAnchor:"middle",children:i.type})})]})},O=a(90),f=a(91);a(57);var y=function(e){var t=e.name,a=(e.key,e.selected),n=e.dispatch;return Object(h.jsx)(O.a,{border:a?"danger":"primary",style:{marginLeft:"0.5vw",marginRight:"0.5vw",width:"15vw",borderRadius:"10px"},children:Object(h.jsxs)(O.a.Body,{children:[Object(h.jsx)(O.a.Title,{style:{maxWidth:"90%",fontSize:"10px"},children:t}),Object(h.jsx)(f.a,{variant:"primary",size:"sm",style:{maxWidth:"90%",fontSize:"10px"},onClick:function(){n({type:U.ADD_NODE,payload:{name:t}})},children:"Add to Workflow"})]})})},E=a(41),x=a.n(E),g=a(88),v=a(42),_=a(87);a(58);var w=function(e){var t=e.services,a=e.input,r=e.dispatch,s=Object(n.useState)(t[0].name),c=Object(l.a)(s,2),o=c[0],d=c[1],i=function(e){var t=e.text,a=e.selected;return Object(h.jsx)(y,{name:t,className:"menu-item",selected:a,dispatch:r},t)},p=function(e){var t=e.text,a=e.className;return Object(h.jsx)("div",{style:{border:"2px solid black"},className:a,children:t})},u=p({text:"<",className:"arrow-prev"}),j=p({text:">",className:"arrow-next"}),b=function(e,t){return e.filter((function(e){return e.name.includes(a)})).map((function(e){var a=e.name;return Object(h.jsx)(i,{text:a,selected:t},a)}))}(t,o);return Object(h.jsxs)(_.a,{children:[Object(h.jsxs)(g.a,{size:"sm",className:"mb-3",children:[Object(h.jsx)(g.a.Prepend,{children:Object(h.jsx)(g.a.Text,{id:"inputGroup-sizing-sm",children:"Search : "})}),Object(h.jsx)(v.a,{className:"searchbar-input","aria-label":"Small","aria-describedby":"inputGroup-sizing-sm",type:"text",value:a,onChange:function(e){return r({type:U.UPDATE_INPUT,payload:{input:e.target.value}})}})]}),Object(h.jsx)(x.a,{style:{width:"100%"},data:b,arrowLeft:u,arrowRight:j,selected:o,onSelect:function(e){d(e)}})]})},k=a(89),C=a(20);var N=function(e){var t=e.node,a=(e.selectedPath,e.paths),n=e.methods,r=e.parameters,s=e.requestBody,c=e.dispatch;if(s)var o=Object.keys(s.content).map((function(e){return Object(h.jsx)("option",{children:e})}));else o=[];return Object(h.jsxs)("div",{style:{position:"fixed",top:"50px",left:"0",height:"100%",width:"30%",zIndex:999,border:"2px solid black",background:"white",overflowY:"auto"},children:[Object(h.jsxs)("h3",{children:[" ",t.data.label," "]}),Object(h.jsx)(f.a,{variant:"primary",type:"submit",style:{marginTop:"-70px",marginLeft:"100%"},onClick:function(){return c({type:U.UNSELECT_NODE,payload:{id:t.id}})},children:Object(h.jsx)(C.a,{})}),Object(h.jsxs)(k.a,{children:[Object(h.jsxs)(k.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect1",children:[Object(h.jsx)(k.a.Label,{children:"Select an Endpoint"}),Object(h.jsx)(k.a.Control,{as:"select",defaultValue:t.workflow.selectedPath,onChange:function(e){return c({type:U.SELECT_FORM_VALUE,payload:{field:"selectedPath",value:e.target.value}})},children:a.map((function(e){return Object(h.jsx)("option",{children:e})}))})]}),Object(h.jsxs)(k.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect2",children:[Object(h.jsx)(k.a.Label,{children:"Select an Request method"}),Object(h.jsx)(k.a.Control,{as:"select",defaultValue:t.workflow.selectedMethod,onChange:function(e){return c({type:U.SELECT_FORM_VALUE,payload:{field:"requestBody",value:e.target.value}})},children:n.map((function(e){return Object(h.jsx)("option",{children:e})}))})]}),s?Object(h.jsxs)(k.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect2",children:[Object(h.jsx)(k.a.Label,{children:"Select a Request Body "}),Object(h.jsx)(k.a.Control,{as:"select",onChange:function(e){return c({type:U.SELECT_FORM_VALUE,payload:{field:"selectedMethod",value:e.target.value}})},children:o}),Object(h.jsx)(k.a.Control,{as:"textarea",rows:3,onChange:function(e){return c({type:U.SELECT_FORM_VALUE,payload:{field:"requestBody",value:JSON.parse(e.target.value)}})}})]}):"",Object(h.jsx)("h3",{children:" Parameters "}),Object(h.jsx)(k.a.Group,{className:"service-leftbar-group",children:r.map((function(e){return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(k.a.Label,{children:[e.name," (",e.required?"required":"optional",") "]}),Object(h.jsx)(k.a.Control,{type:"text",defaultValue:t.workflow[e.name]?t.workflow[e.name]:"Enter parameter value",placeholder:"Enter parameter value",onChange:function(t){return c({type:U.SELECT_FORM_VALUE,payload:{field:e.name,value:t.target.value}})}})]})}))})]}),Object(h.jsx)(f.a,{className:"service-leftbar-button",variant:"primary",type:"submit",style:{marginBottom:"100px"},onClick:function(e){return c({type:U.UNSELECT_NODE,payload:{id:t.id}})},children:"Save Inputs"})]})};var P=function(e){var t=e.edge,a=e.operators,n=e.dispatch;return Object(h.jsxs)("div",{style:{position:"fixed",top:"70px",left:"0",height:"100%",width:"30%",zIndex:999,border:"2px solid black",background:"white",overflowY:"auto"},children:[Object(h.jsxs)("h3",{children:[" ",t.data.type," "]}),Object(h.jsx)(k.a,{children:Object(h.jsxs)(k.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect1",children:[Object(h.jsx)(k.a.Label,{children:"Select an Endpoint"}),Object(h.jsx)(k.a.Control,{as:"select",onChange:function(e){return n({type:U.UPDATE_EDGE_TYPE,payload:{field:"type",value:e.target.value}})},children:a.map((function(e){return Object(h.jsx)("option",{children:e})}))})]})}),Object(h.jsx)(f.a,{className:"service-leftbar-button",variant:"primary",type:"submit",style:{marginBottom:"100px"},onClick:function(e){return n({type:U.UNSELECT_EDGE,payload:{id:t.id}})},children:"Save Inputs"})]})},T=a(30);var D=function(){return Object(h.jsx)(T.a,{bg:"dark",variant:"dark",fixed:"top",expand:"lg",style:{height:"50px"},children:Object(h.jsx)(T.a.Brand,{href:"#home",children:Object(h.jsxs)("a",{class:"navbar-brand",style:{position:"fixed",left:"5%",marginTop:"-25px"},href:"../platform",children:[Object(h.jsx)("img",{class:"pull-left",src:"/static/images/teanga-logo-white.svg",height:"40"})," \xa0",Object(h.jsx)("span",{class:"name",children:Object(h.jsx)("span",{class:"beta",children:"MVP"})})]})})})},S=a(45),L=a(46),I=a.n(L),M={teangaNode:b},A={teangaEdge:m},R={node_count:0,input:"",selected_nodeId:"",selected_edgeId:"",selectedPath:"",selectedMethod:"",methods:[],paths:[],requestBody:{},services:[{name:"dummy teanga",url:"https://raw.githubusercontent.com/berstearns/personal/main/dummy.yaml",repo:"berstearns",image_id:"dummy_teanga_service",image_tag:"042021",host_port:8001,container_port:8080},{name:"dkpro",url:"https://raw.githubusercontent.com/berstearns/personal/main/dkpro.yaml",repo:"berstearns",image_id:"teanga-dkpro-wrapper",image_tag:"032021",host_port:8001,container_port:8080},{name:"naisc",url:"https://raw.githubusercontent.com/berstearns/personal/main/naisc.yaml",repo:"berstearns",image_id:"naisc",image_tag:"latest",host_port:8001,container_port:8080}],operators:["pass","wait","forEach"],elements:[]},U={SET_OPENAPI:"set-openapi",CREATE_WORKFLOW:"create-workflow",UPDATE_INPUT:"update-input",ADD_NODE:"add-node",ADD_EDGE:"add-edge",SELECT_NODE:"select-node",UNSELECT_NODE:"unselect-node",SELECT_EDGE:"select-edge",REMOVE_SELECTED_NODE:"remove-selected-node",SELECT_FORM_VALUE:"select-form-value",UPDATE_EDGE_TYPE:"update-edge-type"};function F(e,t){switch(t.type){case U.SET_OPENAPI:return Object(u.a)(Object(u.a)({},e),{},{services:e.services.map((function(e,a){return Object(u.a)(Object(u.a)({},e),{},{openapi:t.payload.openapi_yamls[a]})}))});case U.CREATE_WORKFLOW:console.log("state services",e.services);var a,n={},r=Object(p.a)(e.elements);try{for(r.s();!(a=r.n()).done;){var s=a.value;if("teangaNode"===s.type){n.hasOwnProperty(s.id)||(n[s.id]=Object(u.a)({},s.workflow));var c,o=Object(p.a)(e.elements);try{for(o.s();!(c=o.n()).done;){var d=c.value;"teangaEdge"===d.type&&d.target===s.id&&(n[s.id].dependencies=[].concat(Object(i.a)(n[s.id].dependencies),[d]))}}catch(M){o.e(M)}finally{o.f()}}}}catch(M){r.e(M)}finally{r.f()}for(var h=0,b=Object.keys(n);h<b.length;h++){var m=b[h];for(var O in n[m].dependencies){var f=n[m].dependencies[O];n[m].dependencies[O]={operator:f.data.type,steps:[f.source]}}}return console.log(n),I.a.post("/admin/ping",n).then((function(e){window.resp=e})).catch((function(e){alert("creation failed :(")})),Object(u.a)({},e);case U.UPDATE_INPUT:return Object(u.a)(Object(u.a)({},e),{},{input:t.payload.input});case U.ADD_NODE:var y=e.services.filter((function(e){return e.name===t.payload.name}))[0],E=y.openapi;console.log(y);var x=(D=Object.keys(E.paths).map((function(e){return e})))[0],g=(S=Object.keys(E.paths[x]))[0],v=E.paths[x][g].parameters,_=E.paths[x][g].requestBody,w=E.paths[x][g].operationId,k={id:(e.node_count+1).toString(),type:"teangaNode",data:{label:t.payload.name,selected:!1,openapi:E},workflow:{selectedPath:x,selectedMethod:g,operation_id:w,repo:y.repo,image_id:y.image_id,image_tag:y.image_tag,host_port:y.host_port,container_port:y.container_port,input:{},dependencies:[]},position:{x:50,y:50}};return Object(u.a)(Object(u.a)({},e),{},{node_count:e.node_count+1,elements:e.elements.concat(k)});case U.ADD_EDGE:var C=Object(j.d)(t.payload.params,e.elements),N=Object(l.a)(C,3),P=(N[0],N[1],N[2]);return console.log(P),Object(u.a)(Object(u.a)({},e),{},{elements:e.elements.concat(P)});case U.SELECT_EDGE:return Object(u.a)(Object(u.a)({},e),{},{selected_edgeId:t.payload.id,elements:e.elements.map((function(e){return e.id===t.payload.id?Object(u.a)(Object(u.a)({},e),{},{data:Object(u.a)(Object(u.a)({},e.data),{},{selected:!e.data.selected})}):Object(u.a)(Object(u.a)({},e),{},{data:Object(u.a)(Object(u.a)({},e.data),{},{selected:!1})})}))});case U.UNSELECT_EDGE:return Object(u.a)(Object(u.a)({},e),{},{selected_edgeId:"",elements:e.elements.map((function(e){return e.id,t.payload.id,Object(u.a)(Object(u.a)({},e),{},{data:Object(u.a)(Object(u.a)({},e.data),{},{selected:!1})})}))});case U.SELECT_NODE:if(""!==(L=e.selected_nodeId==t.payload.id?"":t.payload.id)){var T=e.elements.filter((function(e){return e.id===L}))[0],D=Object.keys(T.data.openapi.paths).map((function(e){return e})),S=(x=T.workflow.selectedPath,Object.keys(T.data.openapi.paths[x]));g=T.workflow.selectedMethod,v=T.data.openapi.paths[x][g].parameters,_=T.data.openapi.paths[x][g].requestBody?T.data.openapi.paths[x][g].requestBody:""}else D=[],x="",S=[],g="",v=[],_={};return Object(u.a)(Object(u.a)({},e),{},{selected_nodeId:L,selectedPath:x,methods:S,selectedMethod:g,paths:D,parameters:v,requestBody:_,elements:e.elements.map((function(e){return e.id===t.payload.id?Object(u.a)(Object(u.a)({},e),{},{data:Object(u.a)(Object(u.a)({},e.data),{},{selected:!e.data.selected})}):Object(u.a)(Object(u.a)({},e),{},{data:Object(u.a)(Object(u.a)({},e.data),{},{selected:!1})})}))});case U.UNSELECT_NODE:return Object(u.a)(Object(u.a)({},e),{},{selected_nodeId:"",selectedPath:"",selectedMethod:"",methods:[],paths:[],elements:e.elements.map((function(e){return e.id,t.payload.id,Object(u.a)(Object(u.a)({},e),{},{data:Object(u.a)(Object(u.a)({},e.data),{},{selected:!1})})}))});case U.REMOVE_SELECTED_NODE:return Object(u.a)(Object(u.a)({},e),{},{selected_nodeId:"",elements:e.elements.filter((function(e){return e.id!==t.payload.id&&(e.source!==t.payload.id&&e.target!==t.payload.id)}))});case U.SELECT_FORM_VALUE:var L=e.selected_nodeId;E=(k=e.elements.filter((function(e){return e.id===L}))[0]).data.openapi,D=Object.keys(k.data.openapi.paths).map((function(e){return e})),x="selectedPath"==t.payload.field?t.payload.value:e.selectedPath,S=Object.keys(k.data.openapi.paths[x]);if("selectedMethod"==t.payload.field)g=t.payload.value;else if(-1!==S.indexOf(e.selectedMethod))g=e.selectedMethod;else g=S[0];v=E.paths[x][g].parameters;if(-1===["selectedPath","selectedMethod"].indexOf(t.payload.field))k.workflow.input[t.payload.field]=t.payload.value;else{w=E.paths[x][g].operationId;k.workflow=Object(u.a)(Object(u.a)({},k.workflow),{},{selectedPath:x,selectedMethod:g,operation_id:w})}return console.log(k),Object(u.a)(Object(u.a)({},e),{},{elements:e.elements.map((function(e){return e.id===L?k:e})),selectedPath:x,methods:S,selectedMethod:g,parameters:v});case U.UPDATE_EDGE_TYPE:L=e.selected_nodeId,E=(k=e.elements.filter((function(e){return e.id===L}))[0]).data.openapi,D=Object.keys(k.data.openapi.paths).map((function(e){return e})),x="selectedPath"==t.payload.field?t.payload.value:e.selectedPath,S=Object.keys(k.data.openapi.paths[x]);if("selectedMethod"==t.payload.field)g=t.payload.value;else if(-1!==S.indexOf(e.selectedMethod))g=e.selectedMethod;else g=S[0];v=E.paths[x][g].parameters;if(-1===["selectedPath","selectedMethod"].indexOf(t.payload.field))k.workflow.input[t.payload.field]=t.payload.value;else{w=E.paths[x][g].operationId;k.workflow=Object(u.a)(Object(u.a)({},k.workflow),{},{selectedPath:x,selectedMethod:g,operation_id:w})}return console.log(k),Object(u.a)(Object(u.a)({},e),{},{elements:e.elements.map((function(e){return e.id===L?k:e})),selectedPath:x,methods:S,selectedMethod:g,parameters:v});default:return e}}var G=function(){var e=Object(n.useReducer)(F,R),t=Object(l.a)(e,2),a=t[0],r=t[1];return Object(n.useEffect)(Object(d.a)(o.a.mark((function e(){var t,n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.services.map(function(){var e=Object(d.a)(o.a.mark((function e(t){var a,n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t.url).then((function(e){return e.text()}));case 2:return a=e.sent,n=Object(S.parse)(a),e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),e.next=3,Promise.all(t);case 3:n=e.sent,r({type:U.SET_OPENAPI,payload:{openapi_yamls:n}});case 5:case"end":return e.stop()}}),e)}))),[]),Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(D,{}),Object(h.jsxs)("div",{style:{width:"100%"},children:[Object(h.jsx)("h3",{style:{display:"inline-block","margin-left":"5%","margin-top":"5%"},children:" Build a workflow from the Flow Diagram "}),Object(h.jsx)(f.a,{variant:"primary",size:"lg",style:{maxWidth:"90%",fontSize:"10px",marginLeft:"30%"},onClick:function(){r({type:U.CREATE_WORKFLOW,payload:{}})},children:"Create Workflow"})]}),a.selected_nodeId?Object(h.jsx)(N,{node:a.elements.filter((function(e){return e.id===a.selected_nodeId}))[0],dispatch:r,selectedPath:a.selectedPath,paths:a.paths,methods:a.methods,selectedMethod:a.selectedMethod,parameters:a.parameters,requestBody:a.requestBody}):"",a.selected_edgeId?Object(h.jsx)(P,{edge:a.elements.filter((function(e){return e.id===a.selected_edgeId}))[0],operators:a.operators,dispatch:r}):"",Object(h.jsxs)("div",{style:{background:"white",border:"2px solid black",padding:"5% 5% 5% 5%",width:"90%",marginLeft:"auto",marginRight:"auto",marginTop:"3%"},children:[Object(h.jsx)(w,{services:a.services,dispatch:r,input:a.input}),Object(h.jsx)("div",{id:"chart_area",children:Object(h.jsx)(j.e,{elements:a.elements,onConnect:function(e){return r({type:U.ADD_EDGE,payload:{params:Object(u.a)(Object(u.a)({},e),{},{type:"teangaEdge",data:{type:"pass"}})}})},onElementClick:function(e,t){t.source?r({type:U.SELECT_EDGE,payload:{id:t.id}}):t.id&&r({type:U.SELECT_NODE,payload:{id:t.id}})},nodeTypes:M,edgeTypes:A,children:Object(h.jsx)(j.b,{style:{marginLeft:"95%"},children:Object(h.jsx)(j.a,{onClick:function(){return r({type:U.REMOVE_SELECTED_NODE,payload:{id:a.selected_nodeId}})},children:Object(h.jsx)(C.a,{})})})})})]})]})};s.a.render(Object(h.jsx)(G,{}),document.getElementById("root"))}},[[84,1,2]]]);
//# sourceMappingURL=main.79e5f7f8.chunk.js.map