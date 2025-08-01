import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { X } from "react-bootstrap-icons";
import {
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";

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

  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Calculate icon sizes based on hover state
  const iconSize = isHovered ? 16 : 12;
  const buttonSize = isHovered ? "md" : "sm";
  const buttonHeight = isHovered ? "24px" : "20px";

  // Get edge name or default text
  const edgeName = (label as string) || "Connection";
  const displayText = isHovered ? edgeName : edgeName.length > 8 ? `${edgeName.substring(0, 8)}...` : edgeName;

  return (
    <>
      <BezierEdge {...props} />

      <EdgeLabelRenderer>
        <Button
          rightIcon={<X color="#4A5568" size={iconSize} />}
          aria-label={`Delete Edge: ${edgeName}`}
          pos="absolute"
          transform={`translate(-30%, -30%) translate(${labelX}px, ${labelY}px)`}
          pointerEvents="all"
          colorScheme="gray"
          variant="outline"
          size={buttonSize}
          borderRadius="md"
          padding="2px 4px"
          fontSize="12px"
          color="#4A5568"
          height={buttonHeight}
          border="1px solid #CBD5E0"
          bg="#f1efef"
          _hover={{
            bg: "gray.100",
            borderColor: "gray.300",
            transform: "translate(-30%, -30%) translate(${labelX}px, ${labelY}px) scale(1.1)",
          }}
          style={{
            transition: "all 0.2s ease-in-out",
            minWidth: "fit-content",
            maxWidth: "120px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() =>
            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id))
          }
        >
          {displayText}
        </Button>
      </EdgeLabelRenderer>
    </>
  );
}
