(this["webpackJsonpreact-flow-101"]=this["webpackJsonpreact-flow-101"]||[]).push([[0],{50:function(e,t,a){},52:function(e,t,a){},55:function(e,t,a){},81:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a(14),c=a.n(r),s=(a(50),a(15)),l=a.n(s),o=a(27),d=a(22),i=a(5),p=a(13),u=(a(52),a(3)),j=function(e){var t=e.data;return Object(u.jsxs)("div",{className:t.selected?"flowchart-operator-new selected-node":"flowchart-operator-new",children:[Object(u.jsx)(p.c,{className:"handle-left",type:"target",position:"left"}),Object(u.jsx)("div",{className:"handle-title",children:t.label}),Object(u.jsx)(p.c,{className:"handle-right",type:"source",position:"right",style:{borderRadius:0}})]})},b=function(e){var t=e.id,a=e.sourceX,n=e.sourceY,r=e.targetX,c=e.targetY,s=e.sourcePosition,l=e.targetPosition,o=e.style,d=void 0===o?{strokeWidth:10,stroke:"rgb(92, 184, 92)"}:o,i=e.data,j=e.arrowHeadType,b=e.markerEndId,h=Object(p.f)({sourceX:a,sourceY:n,sourcePosition:s,targetX:r,targetY:c,targetPosition:l}),m=Object(p.g)(j,b);return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("path",{id:t,style:d,className:"react-flow__edge-path",d:h,markerEnd:m}),Object(u.jsx)("text",{children:Object(u.jsx)("textPath",{href:"#".concat(t),style:{fontSize:"12px"},startOffset:"50%",textAnchor:"middle",children:i.text})})]})},h=a(87),m=a(88);a(54);var O=function(e){var t=e.name,a=(e.key,e.selected),n=e.dispatch;return Object(u.jsx)(h.a,{border:a?"danger":"primary",style:{marginLeft:"0.5vw",marginRight:"0.5vw",width:"15vw",borderRadius:"10px"},children:Object(u.jsxs)(h.a.Body,{children:[Object(u.jsx)(h.a.Title,{style:{maxWidth:"90%",fontSize:"10px"},children:t}),Object(u.jsx)(m.a,{variant:"primary",size:"sm",style:{maxWidth:"90%",fontSize:"10px"},onClick:function(){n({type:A.ADD_NODE,payload:{name:t}})},children:"Add to Workflow"})]})})},f=a(39),x=a.n(f),y=a(85),E=a(40),g=a(84);a(55);var v=function(e){var t=e.services,a=e.input,r=e.dispatch,c=Object(n.useState)(t[0].name),s=Object(d.a)(c,2),l=s[0],o=s[1],i=function(e){var t=e.text,a=e.selected;return Object(u.jsx)(O,{name:t,className:"menu-item",selected:a,dispatch:r},t)},p=function(e){var t=e.text,a=e.className;return Object(u.jsx)("div",{style:{border:"2px solid black"},className:a,children:t})},j=p({text:"<",className:"arrow-prev"}),b=p({text:">",className:"arrow-next"}),h=function(e,t){return e.filter((function(e){return e.name.includes(a)})).map((function(e){var a=e.name;return Object(u.jsx)(i,{text:a,selected:t},a)}))}(t,l);return Object(u.jsxs)(g.a,{children:[Object(u.jsxs)(y.a,{size:"sm",className:"mb-3",children:[Object(u.jsx)(y.a.Prepend,{children:Object(u.jsx)(y.a.Text,{id:"inputGroup-sizing-sm",children:"Search : "})}),Object(u.jsx)(E.a,{className:"searchbar-input","aria-label":"Small","aria-describedby":"inputGroup-sizing-sm",type:"text",value:a,onChange:function(e){return r({type:A.UPDATE_INPUT,payload:{input:e.target.value}})}})]}),Object(u.jsx)(x.a,{style:{width:"100%"},data:h,arrowLeft:j,arrowRight:b,selected:l,onSelect:function(e){o(e)}})]})},_=a(86),w=a(19);var k=function(e){var t=e.node,a=(e.selectedPath,e.paths),n=e.methods,r=e.parameters,c=e.requestBody,s=e.dispatch;if(c)var l=Object.keys(c.content).map((function(e){return Object(u.jsx)("option",{children:e})}));else l=[];return Object(u.jsxs)("div",{style:{position:"fixed",top:"50px",left:"0",height:"100%",width:"30%",zIndex:999,border:"2px solid black",background:"white",overflowY:"auto"},children:[Object(u.jsxs)("h3",{children:[" ",t.data.label," "]}),Object(u.jsx)(m.a,{variant:"primary",type:"submit",style:{marginTop:"-70px",marginLeft:"100%"},onClick:function(){return s({type:A.UNSELECT_NODE,payload:{id:t.id}})},children:Object(u.jsx)(w.a,{})}),Object(u.jsxs)(_.a,{children:[Object(u.jsxs)(_.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect1",children:[Object(u.jsx)(_.a.Label,{children:"Select an Endpoint"}),Object(u.jsx)(_.a.Control,{as:"select",defaultValue:t.workflow.selectedPath,onChange:function(e){return s({type:A.SELECT_FORM_VALUE,payload:{field:"selectedPath",value:e.target.value}})},children:a.map((function(e){return Object(u.jsx)("option",{children:e})}))})]}),Object(u.jsxs)(_.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect2",children:[Object(u.jsx)(_.a.Label,{children:"Select an Request method"}),Object(u.jsx)(_.a.Control,{as:"select",defaultValue:t.workflow.selectedMethod,onChange:function(e){return s({type:A.SELECT_FORM_VALUE,payload:{field:"requestBody",value:e.target.value}})},children:n.map((function(e){return Object(u.jsx)("option",{children:e})}))})]}),c?Object(u.jsxs)(_.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect2",children:[Object(u.jsx)(_.a.Label,{children:"Select a Request Body "}),Object(u.jsx)(_.a.Control,{as:"select",onChange:function(e){return s({type:A.SELECT_FORM_VALUE,payload:{field:"selectedMethod",value:e.target.value}})},children:l})]}):"",Object(u.jsx)("h3",{children:" Parameters "}),Object(u.jsx)(_.a.Group,{className:"service-leftbar-group",children:r.map((function(e){return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsxs)(_.a.Label,{children:[e.name," (",e.required?"required":"optional",") "]}),Object(u.jsx)(_.a.Control,{type:"text",defaultValue:t.workflow[e.name]?t.workflow[e.name]:"Enter parameter value",placeholder:"Enter parameter value",onChange:function(t){return s({type:A.SELECT_FORM_VALUE,payload:{field:e.name,value:t.target.value}})}})]})}))})]}),Object(u.jsx)(m.a,{className:"service-leftbar-button",variant:"primary",type:"submit",style:{marginBottom:"100px"},onClick:function(e){return s({type:A.UNSELECT_NODE,payload:{id:t.id}})},children:"Save Inputs"})]})};var C=function(e){var t=e.edge,a=e.operators,n=e.dispatch;return Object(u.jsxs)("div",{style:{position:"fixed",top:"70px",left:"0",height:"100%",width:"30%",zIndex:999,border:"2px solid black",background:"white",overflowY:"auto"},children:[Object(u.jsxs)("h3",{children:[" ",t.data.text," "]}),Object(u.jsx)(_.a,{children:Object(u.jsxs)(_.a.Group,{className:"service-leftbar-group",controlId:"exampleForm.ControlSelect1",children:[Object(u.jsx)(_.a.Label,{children:"Select an Endpoint"}),Object(u.jsx)(_.a.Control,{as:"select",children:a.map((function(e){return Object(u.jsx)("option",{children:e})}))})]})}),Object(u.jsx)(m.a,{className:"service-leftbar-button",variant:"primary",type:"submit",style:{marginBottom:"100px"},onClick:function(e){return n({type:A.UNSELECT_EDGE,payload:{id:t.id}})},children:"Save Inputs"})]})},N=a(28);var S=function(){return Object(u.jsx)(N.a,{bg:"dark",variant:"dark",fixed:"top",expand:"lg",style:{height:"50px"},children:Object(u.jsx)(N.a.Brand,{href:"#home",children:Object(u.jsxs)("a",{class:"navbar-brand",style:{position:"fixed",left:"5%",marginTop:"-25px"},href:"../platform",children:[Object(u.jsx)("img",{class:"pull-left",src:"/static/images/teanga-logo-white.svg",height:"40"})," \xa0",Object(u.jsx)("span",{class:"name",children:Object(u.jsx)("span",{class:"beta",children:"MVP"})})]})})})},L=a(43),T=a(44),D=a.n(T),P={special:j},I={special:b},M={node_count:0,input:"",selected_nodeId:"",selected_edgeId:"",selectedPath:"",selectedMethod:"",methods:[],paths:[],requestBody:{},services:[{name:"dummy teanga",url:"https://raw.githubusercontent.com/berstearns/personal/main/dummy.yaml"},{name:"dkpro",url:"https://raw.githubusercontent.com/berstearns/personal/main/dkpro.yaml"},{name:"naisc",url:"https://raw.githubusercontent.com/berstearns/personal/main/naisc.yaml"}],operators:["wait","pass","forEach"],elements:[]},A={SET_OPENAPI:"set-openapi",CREATE_WORKFLOW:"create-workflow",UPDATE_INPUT:"update-input",ADD_NODE:"add-node",ADD_EDGE:"add-edge",SELECT_NODE:"select-node",UNSELECT_NODE:"unselect-node",SELECT_EDGE:"select-edge",REMOVE_SELECTED_NODE:"remove-selected-node",SELECT_FORM_VALUE:"select-form-value"};function R(e,t){switch(t.type){case A.SET_OPENAPI:var a=Object(i.a)(Object(i.a)({},e),{},{services:e.services.map((function(e,a){return Object(i.a)(Object(i.a)({},e),{},{openapi:t.payload.openapi_yamls[a]})}))});return console.log(a),a;case A.CREATE_WORKFLOW:return D.a.get("/admin/ping").then((function(e){alert(e)})).catch((function(e){alert("creation failed :(")})),Object(i.a)({},e);case A.UPDATE_INPUT:return Object(i.a)(Object(i.a)({},e),{},{input:t.payload.input});case A.ADD_NODE:var n=e.services.filter((function(e){return e.name===t.payload.name}))[0].openapi,r=(O=Object.keys(n.paths).map((function(e){return e})))[0],c=(f=Object.keys(n.paths[r]))[0],s=n.paths[r][c].parameters,l=n.paths[r][c].requestBody,o={id:(e.node_count+1).toString(),type:"special",data:{label:t.payload.name,selected:!1,openapi:n},workflow:{selectedPath:r,selectedMethod:c},position:{x:50,y:50}};a=Object(i.a)(Object(i.a)({},e),{},{node_count:e.node_count+1,elements:e.elements.concat(o)});return console.log(a),a;case A.ADD_EDGE:var u=Object(p.d)(t.payload.params,e.elements),j=Object(d.a)(u,3),b=(j[0],j[1],j[2]);a=Object(i.a)(Object(i.a)({},e),{},{elements:e.elements.concat(b)});return console.log(a),a;case A.SELECT_EDGE:a=Object(i.a)(Object(i.a)({},e),{},{selected_edgeId:t.payload.id,elements:e.elements.map((function(e){return e.id===t.payload.id?Object(i.a)(Object(i.a)({},e),{},{data:Object(i.a)(Object(i.a)({},e.data),{},{selected:!e.data.selected})}):Object(i.a)(Object(i.a)({},e),{},{data:Object(i.a)(Object(i.a)({},e.data),{},{selected:!1})})}))});return console.log(a),a;case A.UNSELECT_EDGE:return a=Object(i.a)(Object(i.a)({},e),{},{selected_edgeId:"",elements:e.elements.map((function(e){return e.id,t.payload.id,Object(i.a)(Object(i.a)({},e),{},{data:Object(i.a)(Object(i.a)({},e.data),{},{selected:!1})})}))});case A.SELECT_NODE:var h=e.selected_nodeId==t.payload.id?"":t.payload.id;if(console.log(h),""!==h){var m=e.elements.filter((function(e){return e.id===h}))[0],O=Object.keys(m.data.openapi.paths).map((function(e){return e})),f=(r=m.workflow.selectedPath,Object.keys(m.data.openapi.paths[r]));c=m.workflow.selectedMethod,s=m.data.openapi.paths[r][c].parameters,l=m.data.openapi.paths[r][c].requestBody?m.data.openapi.paths[r][c].requestBody:""}else O=[],r="",f=[],c="",s=[],l={};a=Object(i.a)(Object(i.a)({},e),{},{selected_nodeId:h,selectedPath:r,methods:f,selectedMethod:c,paths:O,parameters:s,requestBody:l,elements:e.elements.map((function(e){return e.id===t.payload.id?Object(i.a)(Object(i.a)({},e),{},{data:Object(i.a)(Object(i.a)({},e.data),{},{selected:!e.data.selected})}):Object(i.a)(Object(i.a)({},e),{},{data:Object(i.a)(Object(i.a)({},e.data),{},{selected:!1})})}))});return console.log(a),a;case A.UNSELECT_NODE:return a=Object(i.a)(Object(i.a)({},e),{},{selected_nodeId:"",selectedPath:"",selectedMethod:"",methods:[],paths:[],elements:e.elements.map((function(e){return e.id,t.payload.id,Object(i.a)(Object(i.a)({},e),{},{data:Object(i.a)(Object(i.a)({},e.data),{},{selected:!1})})}))});case A.REMOVE_SELECTED_NODE:return a=Object(i.a)(Object(i.a)({},e),{},{selected_nodeId:"",elements:e.elements.filter((function(e){return e.id!==t.payload.id&&(e.source!==t.payload.id&&e.target!==t.payload.id)}))});case A.SELECT_FORM_VALUE:h=e.selected_nodeId,o=e.elements.filter((function(e){return e.id===h}))[0],O=Object.keys(o.data.openapi.paths).map((function(e){return e})),r="selectedPath"==t.payload.field?t.payload.value:e.selectedPath,f=Object.keys(o.data.openapi.paths[r]);if("selectedMethod"==t.payload.field)c=t.payload.value;else if(-1!==f.indexOf(e.selectedMethod))c=e.selectedMethod;else c=f[0];s=o.data.openapi.paths[r][c].parameters;-1===["selectedPath","selectedMethod"].indexOf(t.payload.field)?o.workflow[t.payload.field]=t.payload.value:o.workflow=Object(i.a)(Object(i.a)({},o.workflow),{},{selectedPath:r,selectedMethod:c});a=Object(i.a)(Object(i.a)({},e),{},{elements:e.elements.map((function(e){return e.id===h?o:e})),selectedPath:r,methods:f,selectedMethod:c,parameters:s});return console.log(a),a;default:return e}}var U=function(){var e=Object(n.useReducer)(R,M),t=Object(d.a)(e,2),a=t[0],r=t[1];return Object(n.useEffect)(Object(o.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.services.map(function(){var e=Object(o.a)(l.a.mark((function e(t){var a,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t.url).then((function(e){return e.text()}));case 2:return a=e.sent,n=Object(L.parse)(a),e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),e.next=3,Promise.all(t);case 3:n=e.sent,r({type:A.SET_OPENAPI,payload:{openapi_yamls:n}});case 5:case"end":return e.stop()}}),e)}))),[]),Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)(S,{}),Object(u.jsxs)("div",{style:{width:"100%"},children:[Object(u.jsx)("h3",{style:{display:"inline-block","margin-left":"5%","margin-top":"5%"},children:" Build a workflow from the Flow Diagram "}),Object(u.jsx)(m.a,{variant:"primary",size:"lg",style:{maxWidth:"90%",fontSize:"10px",marginLeft:"30%"},onClick:function(){r({type:A.CREATE_WORKFLOW,payload:{}})},children:"Create Workflow"})]}),a.selected_nodeId?Object(u.jsx)(k,{node:a.elements.filter((function(e){return e.id===a.selected_nodeId}))[0],dispatch:r,selectedPath:a.selectedPath,paths:a.paths,methods:a.methods,selectedMethod:a.selectedMethod,parameters:a.parameters,requestBody:a.requestBody}):"",a.selected_edgeId?Object(u.jsx)(C,{edge:a.elements.filter((function(e){return e.id===a.selected_edgeId}))[0],operators:a.operators,dispatch:r}):"",Object(u.jsxs)("div",{style:{background:"white",border:"2px solid black",padding:"5% 5% 5% 5%",width:"90%",marginLeft:"auto",marginRight:"auto",marginTop:"3%"},children:[Object(u.jsx)(v,{services:a.services,dispatch:r,input:a.input}),Object(u.jsx)("div",{id:"chart_area",children:Object(u.jsx)(p.e,{elements:a.elements,onConnect:function(e){return r({type:A.ADD_EDGE,payload:{params:Object(i.a)(Object(i.a)({},e),{},{type:"special",data:{text:"wait"}})}})},onElementClick:function(e,t){t.source?r({type:A.SELECT_EDGE,payload:{id:t.id}}):t.id&&r({type:A.SELECT_NODE,payload:{id:t.id}})},nodeTypes:P,edgeTypes:I,children:Object(u.jsx)(p.b,{style:{marginLeft:"95%"},children:Object(u.jsx)(p.a,{onClick:function(){return r({type:A.REMOVE_SELECTED_NODE,payload:{id:a.selected_nodeId}})},children:Object(u.jsx)(w.a,{})})})})})]})]})};c.a.render(Object(u.jsx)(U,{}),document.getElementById("root"))}},[[81,1,2]]]);
//# sourceMappingURL=main.9d44a261.chunk.js.map