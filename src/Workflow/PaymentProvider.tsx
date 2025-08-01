import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { X } from "react-bootstrap-icons";
import {
  NodeProps,
  Position,
  useReactFlow,
} from "reactflow";
import CustomHandle from "./CustomHandle";

const PAYMENT_PROVIDER_IMAGE_MAP: { [code: string]: string } = {
  St: "https://cdn.worldvectorlogo.com/logos/stripe-2.svg",
  Ap: "https://cdn.worldvectorlogo.com/logos/apple-14.svg",
  Gp: "https://cdn.worldvectorlogo.com/logos/google-g-2015.svg",
  Pp: "https://avatars.githubusercontent.com/u/476675?s=280&v=4",
  Am: "https://static.wixstatic.com/media/d2252d_4c1a1bda6a774bd68f789c0770fd16e5~mv2.png",
};

export default function PaymentProvider({
  data: { name, code },
  id,
}: NodeProps<{ name: string; code: string }>) {
  const { setNodes } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  // Node dimensions
  const totalHeight = 70;
  const totalWidth = 186;

  return (
    <Box
      position="relative"
      width="186px"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Generate Left Handlers - 3 pairs of target/source handlers */}
      <CustomHandle
        totalHeight={totalHeight}
        totalWidth={totalWidth}
        id={id}
        isHovered={isHovered}
      />

      {/* Node Content */}
      <Box p="3px" position="relative" zIndex={5}>
        <Flex
          borderRadius="24px"
          border="2px solid #5e5eff"
          alignItems="center"
          bg="white"
          p={2}
          pl="12px"
          gap={2}
          width="180px"
          height="40px"
          boxShadow="md"
        >
          <Box h={5} w={5}>
            <Image
              height="100%"
              width="100%"
              src={PAYMENT_PROVIDER_IMAGE_MAP[code]}
            />
          </Box>
          <Flex grow="1">
            <Text fontSize="small" mt="-2px">
              {name}
            </Text>
          </Flex>
          <IconButton
            aria-label="Delete Payment Provider"
            icon={<X />}
            color="red"
            bg="transparent"
            size="sm"
            onClick={() =>
              setNodes((prev) => prev.filter((node) => node.id !== id))
            }
          />
        </Flex>
      </Box>
    </Box>
  );
}
