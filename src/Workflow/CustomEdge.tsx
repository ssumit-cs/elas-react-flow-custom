import React, { useState } from "react";
import {
  EdgeLabelRenderer,
  EdgeProps,
  Position,
  useReactFlow,
} from "reactflow";
import { X } from "react-bootstrap-icons";


// Configurable constants
const OFFSET = 30;
const MINIMUM_STEPS = 4;
const MAXIMUM_STEPS = 8;
const EDGE_START_OFFSET = 3; // Increase edge length from source
const EDGE_END_OFFSET = 3;   // Increase edge length towards target

export default function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
  } = props;


  // @ts-expect-error
  const targetHandle = props.targetHandle;

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const directionMap = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  } as const;

  const markerId = `arrowhead-${directionMap[targetHandle as keyof typeof directionMap] || "right"}`;

  const getOffsetCoords = (x: number, y: number, pos: string, distance: number) => {
    switch (pos) {
      case "top": return [x, y - distance];
      case "bottom": return [x, y + distance];
      case "left": return [x - distance, y];
      case "right": return [x + distance, y];
      default: return [x, y];
    }
  };

  const [startX, startY] = getOffsetCoords(sourceX, sourceY, sourcePosition, OFFSET + EDGE_START_OFFSET);
  const [endX, endY] = getOffsetCoords(targetX, targetY, targetPosition, OFFSET + EDGE_END_OFFSET);

  const points: [number, number][] = [[sourceX, sourceY], [startX, startY]];

  const horizontalFirst = Math.abs(endX - startX) > Math.abs(endY - startY);
  const steps = Math.max(MINIMUM_STEPS, Math.min(MAXIMUM_STEPS, 3));
  const segments: [number, number][] = [];

  if (horizontalFirst) {
    const stepX = (endX - startX) / (steps + 1);
    for (let i = 1; i <= steps; i++) {
      segments.push([startX + i * stepX, startY]);
    }
    segments.push([endX, startY], [endX, endY]);
  } else {
    const stepY = (endY - startY) / (steps + 1);
    for (let i = 1; i <= steps; i++) {
      segments.push([startX, startY + i * stepY]);
    }
    segments.push([startX, endY], [endX, endY]);
  }

  points.push(...segments, [targetX, targetY]);

  const pathData = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x},${y}`).join(" ");

  const midIndex = Math.floor(points.length / 2);
  const [labelX, labelY] = points[midIndex];

  const edgeName = (label as string) || "Edge";
  const displayText = isHovered || edgeName.length <= 8 ? edgeName : `${edgeName.slice(0, 8)}...`;

  console.log(sourcePosition, targetPosition, props);


  return (

    <>
      {/* Arrow markers */}
      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <marker id="arrowhead-right" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4A5568" />
          </marker>
          <marker id="arrowhead-left" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="10 0, 0 3.5, 10 7" fill="#4A5568" />
          </marker>
          <marker id="arrowhead-top" markerWidth="7" markerHeight="10" refX="3.5" refY="0" orient="auto">
            <polygon points="0 10, 3.5 0, 7 10" fill="#4A5568" />
          </marker>
          <marker id="arrowhead-bottom" markerWidth="7" markerHeight="10" refX="3.5" refY="10" orient="auto">
            <polygon points="0 0, 3.5 10, 7 0" fill="#4A5568" />
          </marker>
        </defs>
      </svg>

      {/* Edge line with arrow */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={pathData}
        fill="none"
        stroke="#4A5568"
        strokeWidth={1.5}
        markerEnd={`url(#${markerId})`}
      />

      {/* Edge label and delete icon */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            background: "white",
            padding: "2px 6px",
            borderRadius: "12px",
            fontSize: "8px",
            color: "#2D3748",
            border: "1px solid #CBD5E0",
            display: "flex",
            alignItems: "center",
            pointerEvents: "all",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span style={{ marginRight: 4 }}>{displayText}</span>
          <X
            size={12}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setEdges((edges) => edges.filter((edge) => edge.id !== id))
            }
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}


