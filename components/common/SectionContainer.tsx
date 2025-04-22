"use client";

import { Container, Group, Stack, Title } from "@mantine/core";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionContainerProps {
  title: string;
  emoji: string;
  children: ReactNode;
  headerRef: any;
  groupRef: any;
  isHeaderInView: boolean;
  mt?: number;
}

export function SectionContainer({
  title,
  emoji,
  children,
  headerRef,
  groupRef,
  isHeaderInView,
  mt = 100,
}: SectionContainerProps) {
  return (
    <Container size="md">
      <Stack gap="xl" mt={mt} mb={50}>
        <Container size="xs" style={{ zIndex: 5 }}>
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title order={2} ta="center">{title} {emoji}</Title>
          </motion.div>
        </Container>
        <Group
          ref={groupRef}
          justify="center"
          align="flex-start"
          style={{ position: "relative" }}
        >
          {children}
        </Group>
      </Stack>
    </Container>
  );
} 