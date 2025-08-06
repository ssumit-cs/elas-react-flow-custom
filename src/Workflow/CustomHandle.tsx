import { Handle, Position } from "reactflow";
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
  nodeId: string;
  isHovered?: boolean;
}

function generateHandlers({
  count,
  position,
  isVertical,
  totalHeight,
  totalWidth,
  verticalHandleSize = 5,
  horizontalHandleSize = 5,
  nodeId,
  isHovered = false,
}: GenerateHandlersProps) {
  const handlers = [];
  const { sourceNodeId, isConnectionStarted } = useConnectionContext();

  // Colors for target and source handles
  const targetColor = "rgba(255, 0, 0, 0.8)"; // Red for target
  const sourceColor = "rgba(0, 255, 0, 0.8)"; // Green for source

  // Determine which handles to show based on connection state and hover
  const isSourceNode = sourceNodeId === nodeId;

  // Source handles: visible only on hover when no connection is in progress
  const shouldShowSourceHandles = isHovered && !isConnectionStarted;

  // Target handles: visible when connection is in progress and this is NOT the source node
  const shouldShowTargetHandles = isConnectionStarted && !isSourceNode;

  // Generate handle positions
  if (isVertical) {
    // For vertical positions (left/right), create only one handle in the middle with double height
    const top = (totalHeight / 2) - verticalHandleSize * 2 - 2;
    const left = position === Position.Left ? 0 : totalWidth - verticalHandleSize - 10;
    const width = verticalHandleSize + 10;
    const height = (verticalHandleSize * 2) + 10; // Double height

    // Create source handle
    handlers.push(
      <Handle
        key={`${position}-source-middle`}
        type="source"
        position={position}
        id={`${position}-source-middle`}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: sourceColor,
          border: "none",
          borderRadius: "0%",
          zIndex: 101, // Higher z-index for source handles
          pointerEvents: shouldShowSourceHandles ? "auto" : "none",
          opacity: shouldShowSourceHandles ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
        }}
        isConnectable={shouldShowSourceHandles}
      />
    );

    // Create target handle at the same position
    handlers.push(
      <Handle
        key={`${position}-target-middle`}
        type="target"
        position={position}
        id={`${position}-target-middle`}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: targetColor,
          border: "none",
          borderRadius: "0%",
          zIndex: 100, // Lower z-index for target handles
          pointerEvents: shouldShowTargetHandles ? "auto" : "none",
          opacity: shouldShowTargetHandles ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
        }}
        isConnectable={shouldShowTargetHandles}
      />
    );
  } else {
    // For horizontal positions (top/bottom), keep the existing multiple handles logic
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        continue;
      }
      // For top and bottom handles (horizontal)
      const segmentWidth = totalWidth / count;
      const top = position === Position.Top ? 0 : totalHeight / 2 - 5;
      let left = (segmentWidth * i) + (segmentWidth / 2) - (horizontalHandleSize);
      let width = horizontalHandleSize + 10;
      const height = horizontalHandleSize + 10;

      if (i === count - 1) {
        width -= 5;
        left -= 5;
      }

      // Create source handle
      handlers.push(
        <Handle
          key={`${position}-source-${i}`}
          type="source"
          position={position}
          id={`${position}-source-${i}`}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
            background: sourceColor,
            border: "none",
            borderRadius: "0%",
            zIndex: 101, // Higher z-index for source handles
            pointerEvents: shouldShowSourceHandles ? "auto" : "none",
            opacity: shouldShowSourceHandles ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
          isConnectable={shouldShowSourceHandles}
        />
      );

      // Create target handle at the same position
      handlers.push(
        <Handle
          key={`${position}-target-${i}`}
          type="target"
          position={position}
          id={`${position}-target-${i}`}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
            background: targetColor,
            border: "none",
            borderRadius: "0%",
            zIndex: 100, // Lower z-index for target handles
            pointerEvents: shouldShowTargetHandles ? "auto" : "none",
            opacity: shouldShowTargetHandles ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
          isConnectable={shouldShowTargetHandles}
        />
      );
    }
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
        count: 4,
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
          count: 4,
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
