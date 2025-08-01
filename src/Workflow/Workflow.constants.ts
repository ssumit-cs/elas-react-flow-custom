import { Edge, Node } from "reactflow";

export const initialEdges: Edge[] = [];

export const initialNodes: Node[] = [

  {
    id: "4",
    data: { name: "Google Pay", code: "Gp" },
    position: { x: 550, y: -50 },
    type: "paymentProvider",
  },
  {
    id: "5",
    data: { name: "Stripe", code: "St" },
    position: { x: 550, y: 125 },
    type: "paymentProvider",
  },
  {
    id: "6",
    data: { name: "Apple Pay", code: "Ap" },
    position: { x: 550, y: 325 },
    type: "paymentProvider",
  },
  {
    id: "7",
    data: {},
    position: { x: 275, y: -100 },
    type: "paymentProviderSelect",
  },
];
