import React, { FC } from 'react';
import { EdgeProps, getBezierPath, getMarkerEnd } from 'react-flow-renderer';

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
      strokeWidth: 10,
      stroke: "rgb(92, 184, 92)" 
  },
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data.type}
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
