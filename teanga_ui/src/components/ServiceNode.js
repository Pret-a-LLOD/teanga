import React from 'react';
import { Handle } from 'react-flow-renderer';

const ServiceNode = ({ data }) => {
  return (
    <div className={data.selected ? "flowchart-operator-new selected-node" : "flowchart-operator-new"}
         >
      <Handle className="handle-left" type="target" position="left" />
      <div className="handle-title">{data.label}</div>
      <Handle
        className="handle-right"
        type="source"
        position="right"
        style={{ borderRadius: 0 }}
      />
    </div>
  );
};

export default ServiceNode;
