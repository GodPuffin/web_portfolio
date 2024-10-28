"use client";

import {
  Card,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface EducationCardProps {
  institution: string;
  degree?: string;
  dateRange: string;
  description?: string;
  rotation: number;
  zIndex: number;
  logo?: string;
  darkLogo?: string;
  index: number;
}

function EducationCard(
  {
    institution,
    degree,
    dateRange,
    description,
    rotation,
    zIndex,
    logo,
    darkLogo,
    index,
  }: EducationCardProps,
) {
  const [hovered, setHovered] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    amount: "some" 
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
      }}
      style={{ 
        position: 'relative',
        zIndex: isInView ? 2 : 0
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
        <Card.Section p="md">
          {(logo || darkLogo) && (
            <Image
              src={colorScheme === "dark" && darkLogo ? darkLogo : logo}
              alt={institution}
              width={50}
              height={50}
              fit="contain"
              mb="xs"
            />
          )}
          <div>
            {!logo && !darkLogo && <Text size="lg">{institution}</Text>}
            {degree && <Text size="sm" c="dimmed">{degree}</Text>}
            <Text size="sm">{dateRange}</Text>
          </div>
        </Card.Section>
        {description && <Text size="sm" mt="md">{description}</Text>}
      </Card>
    </motion.div>
  );
}

export function Education() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { 
    once: true,
    amount: 0.3 
  });

  return (
    <Container size="md">
      <Stack gap="xl" mt={100} mb={50}>
        <Container size="xs" style={{ zIndex: 5 }}>
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Title order={2} ta="center">Education 🎓</Title>
          </motion.div>
        </Container>
        <Group
          justify="center"
          align="flex-start"
          style={{ position: "relative" }}
        >
          <EducationCard
            institution="University of British Columbia"
            degree="BASc Computer Engineering"
            dateRange="2024 - Present"
            rotation={-8}
            zIndex={3}
            logo="/UBC-Logo.svg"
            darkLogo="/UBC-Logo-Dark.svg"
            index={0}
          />
          <EducationCard
            institution="Vanier College"
            degree="DEC Computer Science & Mathematics"
            dateRange="2022 - 2024"
            rotation={-2}
            zIndex={2}
            index={1}
          />
          <EducationCard
            institution="Loyola High School"
            dateRange="2018 - 2022"
            rotation={10}
            zIndex={1}
            index={2}
          />
        </Group>
      </Stack>
    </Container>
  );
}
