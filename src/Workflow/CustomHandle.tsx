import React from "react";
import { Handle, HandleProps, Position } from "reactflow";
import { useConnectionContext } from "./ConnectionContext";

interface GenerateHandlersProps {
  count: number;
  position: Position;
  isVertical: boolean;
  totalHeight: number;
  totalWidth: number;
  verticalHandleSize?: number;
  horizontalHandleSize?: number;
  verticalHeight?: number;
  nodeId: string; // Add nodeId to identify the current node
  isHovered?: boolean; // Add hover state
}

function generateHandlers({
  count,
  position,
  isVertical,
  totalHeight,
  totalWidth,
  verticalHandleSize = 10,
  horizontalHandleSize = 10,
  verticalHeight = 50,
  nodeId,
  isHovered = false,
}: GenerateHandlersProps) {
  const handlers = [];
  const { sourceNodeId, isConnectionStarted } = useConnectionContext();

  // Different colors for target and source - made more visible for testing
  const targetColor = "rgba(255, 0, 0, 0.8)"; // Red for target (highly visible)
  const sourceColor = "rgba(0, 255, 0, 0.8)"; // Green for source (highly visible)

  // Determine which handles to show based on connection state and hover
  const isSourceNode = sourceNodeId === nodeId;

  // Override hover effect when connection is in progress
  const effectiveHover = isConnectionStarted ? false : isHovered;

  const shouldShowSourceHandles = !isConnectionStarted || isSourceNode || effectiveHover;
  const shouldShowTargetHandles = isConnectionStarted && !isSourceNode;

  // For left and right positions, skip the last handle
  const totalHandles = isVertical ? (count * 2) - 1 : count * 2;

  for (let i = 0; i < totalHandles; i++) {
    const index = Math.floor(i / 2) + 1;
    const isTarget = i % 2 === 0; // Even indices are targets, odd are sources
    let top, left, width, height;

    if (isVertical) {
      // For left and right handles (vertical) - alternating target/source
      const segmentHeight = verticalHeight / (count * 2); // Use constrained height
      const startTop = (totalHeight - verticalHeight) / 2; // Center the handlers
      top = startTop + (segmentHeight * i) - 5;
      left = position === Position.Left ? -1 : totalWidth - verticalHandleSize - 10;
      width = verticalHandleSize + 10;
      height = verticalHandleSize * 2;
    } else {
      // For top and bottom handles (horizontal) - alternating target/source
      const segmentWidth = totalWidth / (count * 2);
      top = position === Position.Top ? -3 : totalHeight / 2 - 5;
      left = segmentWidth * i + 10 > totalWidth ? totalWidth - horizontalHandleSize : segmentWidth * i;
      width = horizontalHandleSize * 2;
      height = horizontalHandleSize + 10;
    }

    // Determine if this handle should be visible
    const shouldShow = isTarget ? shouldShowTargetHandles : shouldShowSourceHandles;

    // Always render the handle but control visibility with opacity and pointer events
    handlers.push(
      <Handle
        key={`${position}-${isTarget ? 'target' : 'source'}-${index}-${i % 2}`}
        type={isTarget ? 'target' : 'source'}
        position={position}
        id={`${position}-${isTarget ? 'target' : 'source'}-${index}-${i % 2}`}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: "transparent", // Invisible background
          border: "none", // No border
          borderRadius: "50%", // Make it circular
          zIndex: 100,
          pointerEvents: shouldShow ? "auto" : "none", // Control interactivity
          opacity: shouldShow ? 0 : 0, // Completely invisible
          transition: "opacity 0.2s ease-in-out", // Smooth transitions
        }}
        isConnectable={shouldShow} // Control connectability
      />
    );
  }

  return handlers;
}

interface CustomHandleProps {
  totalHeight: number;
  totalWidth: number;
  id: string;
  isHovered: boolean;
}

export default function CustomHandle(props: CustomHandleProps) {
  const { totalHeight, totalWidth, id, isHovered } = props;

  return (
    <>
      {generateHandlers({
        count: 3,
        position: Position.Left,
        isVertical: true,
        totalHeight,
        totalWidth,
        nodeId: id,
        isHovered,
      })
      }

      {/* Generate Right Handlers - 3 pairs of target/source handlers */}
      {
        generateHandlers({
          count: 3,
          position: Position.Right,
          isVertical: true,
          totalHeight,
          totalWidth,
          nodeId: id,
          isHovered,
        })
      }

      {/* Generate Top Handlers - 10 pairs of target/source handlers */}
      {
        generateHandlers({
          count: 10,
          position: Position.Top,
          isVertical: false,
          totalHeight,
          totalWidth,
          nodeId: id,
          isHovered,
        })
      }

      {/* Generate Bottom Handlers - 10 pairs of target/source handlers */}
      {
        generateHandlers({
          count: 10,
          position: Position.Bottom,
          isVertical: false,
          totalHeight,
          totalWidth,
          nodeId: id,
          isHovered,
        })
      }
    </>
  );
}
