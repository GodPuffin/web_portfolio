"use client";

import { Card, useMantineColorScheme } from "@mantine/core";
import { useState, useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";

export interface BaseCardProps {
  rotation: number;
  zIndex: number;
  index: number;
  isGroupInView: boolean;
  children: ReactNode;
}

export function BaseCard({
  rotation,
  zIndex,
  index,
  isGroupInView,
  children,
}: BaseCardProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: "some",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");
  const transitionDelay = isMobile ? 0.2 : index * 0.15;
  const shouldAnimate = isMobile ? isInView : isGroupInView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: transitionDelay,
      }}
      style={{
        position: "relative",
        zIndex: hovered ? 10 : 0,
      }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "20px 0",
          transition: "all 0.3s ease-in-out",
          transform: `rotate(${hovered ? "0" : rotation}deg) translateY(${
            hovered ? "-10px" : "0"
          }) scale(${hovered ? "1.05" : "1"})`,
          boxShadow: hovered
            ? "0 8px 16px rgba(0,0,0,0.2)"
            : "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          zIndex: hovered ? 10 : zIndex,
          marginLeft: `-${40 - zIndex * 10}px`,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
}

export function useAnimationView() {
  const headerRef = useRef(null);
  const groupRef = useRef(null);
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 0.3,
  });

  const isGroupInView = useInView(groupRef, {
    once: true,
    amount: 0.1,
  });

  return { headerRef, groupRef, isHeaderInView, isGroupInView };
} 