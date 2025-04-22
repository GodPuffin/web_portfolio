"use client";

import {
  Container,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function BasicFooter() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: "some",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        zIndex: 3,
        marginTop: "100px",
      }}
    >
      <Paper
        p="md"
        withBorder
      >
        <Container size="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Made in Montreal.
            </Text>
            <Text size="sm" c="dimmed">
              {process.env.BUILD_TIME && `Updated on ${new Date(process.env.BUILD_TIME).toLocaleDateString('en-CA')}`}
            </Text>
          </Group>
        </Container>
      </Paper>
    </motion.div>
  );
}
