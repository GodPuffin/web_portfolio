"use client";
import { Container, Stack, Text, Title } from "@mantine/core";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Welcome() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const isTextInView = useInView(textRef, { once: true, amount: 0.3 });

  return (
    <Stack gap="xl">
      <Container size="xs" style={{ zIndex: 5 }}>
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            ta="center"
            order={1}
            style={{ transition: "transform 0.3s ease" }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              const emojis = ["👋", "🍁", "🤖", "💻", "🚀", "⚛️", "🔧", "🌐"];
              let currentIndex = 0;
              const interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % emojis.length;
                const emojiSpan = target.querySelector("span");
                if (emojiSpan) {
                  emojiSpan.textContent = emojis[currentIndex];
                }
              }, 300);
              target.dataset.interval = interval.toString();
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              clearInterval(Number(target.dataset.interval));
              const emojiSpan = target.querySelector("span");
              if (emojiSpan) {
                emojiSpan.textContent = "👋";
              }
            }}
          >
            Hello, I&apos;m Marcus{" "}
            <span style={{ display: "inline-block" }}>👋</span>
          </Title>
        </motion.div>
      </Container>
      
      <motion.div
        ref={textRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ zIndex: 5 }}
      >
        <Text size="lg">
          I&apos;m a <Text span c="grape" inherit>Computer Engineering</Text>{" "}
          student at the{" "}
          <Text component="a" href="https://www.ubc.ca/" c="blue" inherit>
            University of British Columbia
          </Text>, with a background in{" "}
          <Text span c="green" inherit>Computer Science</Text> and{" "}
          <Text span c="orange" inherit>Math</Text>. I&apos;m skilled at
          creating <Text span c="indigo" inherit>innovative solutions</Text>{" "}
          across <Text span c="red" inherit>mechanical</Text>,{" "}
          <Text span c="violet" inherit>electrical</Text>, and{" "}
          <Text span c="cyan" inherit>software engineering</Text>, with a recent
          focus on developing <Text span c="pink" inherit>AI tools</Text>{" "}
          for everyday use. When I&apos;m not coding, you can find me{" "}
          <Text span c="teal" inherit>skiing</Text>,{" "}
          <Text span c="indigo" inherit>sailing</Text>, or{" "}
          <Text span c="brown" inherit>rock climbing</Text>.
        </Text>
      </motion.div>
    </Stack>
  );
}
