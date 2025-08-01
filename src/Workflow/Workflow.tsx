import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box, Button, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, FormControl, FormLabel, useDisclosure } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { initialEdges, initialNodes } from "./Workflow.constants";
import PaymentInit from "./PaymentInit";
import PaymentCountry from "./PaymentCountry";
import PaymentProvider from "./PaymentProvider";
import PaymentProviderSelect from "./PaymentProviderSelect";
import CustomEdge from "./CustomEdge";
import { ConnectionProvider, useConnectionContext } from "./ConnectionContext";

const nodeTypes = {
  paymentInit: PaymentInit,
  paymentCountry: PaymentCountry,
  paymentProvider: PaymentProvider,
  paymentProviderSelect: PaymentProviderSelect,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const WorkflowContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setSourceNodeId, setIsConnectionStarted, resetConnection } = useConnectionContext();

  // Dialog state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [edgeName, setEdgeName] = useState("");
  const [pendingEdge, setPendingEdge] = useState<Edge | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Only proceed if we have valid source and target
      if (!connection.source || !connection.target) {
        return;
      }

      const uniqueId = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const edge: Edge = {
        id: uniqueId,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
        animated: true,
        type: "customEdge",
        label: "", // Will be set by dialog
      };

      // Store the pending edge and open dialog
      setPendingEdge(edge);
      setEdgeName("");
      onOpen();
    },
    [onOpen]
  );

  const onConnectStart = useCallback((event: any, { nodeId, handleId }: { nodeId: string | null, handleId: string | null }) => {
    if (nodeId) {
      // Set the source node and mark connection as started
      setSourceNodeId(nodeId);
      setIsConnectionStarted(true);
    }
  }, [setSourceNodeId, setIsConnectionStarted]);

  const onConnectEnd = useCallback((event: any) => {
    // Reset connection state when connection is cancelled
    resetConnection();
  }, [resetConnection]);

  // Handle edge name confirmation
  const handleConfirmEdgeName = useCallback(() => {
    if (pendingEdge) {
      const edgeWithName = {
        ...pendingEdge,
        label: edgeName.trim() || "Connection", // Default name if empty
      };

      setEdges((prevEdges) => addEdge(edgeWithName, prevEdges));
      setPendingEdge(null);
      setEdgeName("");
      onClose();

      // Reset connection state when connection is completed
      resetConnection();
    }
  }, [pendingEdge, edgeName, setEdges, onClose, resetConnection]);

  // Handle dialog cancellation
  const handleCancelEdgeName = useCallback(() => {
    setPendingEdge(null);
    setEdgeName("");
    onClose();
    resetConnection();
  }, [onClose, resetConnection]);

  // Export workflow as JSON
  const exportWorkflow = useCallback(() => {
    const workflowData = {
      nodes: nodes,
      edges: edges,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalNodes: nodes.length,
        totalEdges: edges.length,
        nodeTypes: Object.keys(nodeTypes),
        edgeTypes: Object.keys(edgeTypes),
      }
    };

    console.log('=== WORKFLOW EXPORT ===');
    console.log('Workflow Data:', workflowData);
    console.log('JSON String:', JSON.stringify(workflowData, null, 2));
    console.log('=== END EXPORT ===');
  }, [nodes, edges]);

  return (
    <Box height={"100vh"} width="100%" position="relative">
      {/* Save Workflow Button */}
      <Box
        position="absolute"
        top="20px"
        right="20px"
        zIndex={1000}
        bg="white"
        borderRadius="md"
        p={3}
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        <Flex direction="column" gap={2}>
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            Workflow Export
          </Text>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={exportWorkflow}
            _hover={{ bg: "blue.600" }}
          >
            Save Workflow
          </Button>
          <Text fontSize="xs" color="gray.500">
            {nodes.length} nodes, {edges.length} edges
          </Text>
        </Flex>
      </Box>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Edge Name Dialog */}
      <Modal isOpen={isOpen} onClose={handleCancelEdgeName}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Name Your Connection</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Connection Name</FormLabel>
              <Input
                placeholder="Enter connection name..."
                value={edgeName}
                onChange={(e) => setEdgeName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmEdgeName();
                  }
                }}
                autoFocus
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancelEdgeName}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmEdgeName}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export const Workflow = () => {
  return (
    <ConnectionProvider>
      <WorkflowContent />
    </ConnectionProvider>
  );
};
