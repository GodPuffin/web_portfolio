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
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";

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
  isGroupInView: boolean;
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
    isGroupInView,
  }: EducationCardProps,
) {
  const [hovered, setHovered] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: "some",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");
  const transitionDelay = isMobile ? 0.2 : index * 0.15;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: transitionDelay,
      }}
      style={{
        position: "relative",
        zIndex: isInView ? 2 : 0,
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
  const educationRef = useRef(null);
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 0.3,
  });

  const isGroupInView = useInView(educationRef, {
    once: true,
    amount: 0.1,
  });

  return (
    <Container size="md">
      <Stack gap="xl" mt={100} mb={50}>
        <Container size="xs" style={{ zIndex: 5 }}>
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Title order={2} ta="center">Education 🎓</Title>
          </motion.div>
        </Container>
        <Group
          ref={educationRef}
          justify="center"
          align="flex-start"
          style={{ position: "relative" }}
        >
          <EducationCard
            institution="University of British Columbia"
            degree="BASc, Computer Engineering"
            dateRange="2024 - Present"
            rotation={-8}
            zIndex={3}
            logo="/UBC-Logo.svg"
            darkLogo="/UBC-Logo-Dark.svg"
            index={0}
            isGroupInView={isGroupInView}
          />
          <EducationCard
            institution="Vanier College"
            degree="DEC, Computer Science & Mathematics"
            dateRange="2022 - 2024"
            rotation={-2}
            zIndex={2}
            logo="/Vanier-Logo.png"
            darkLogo="/Vanier-Logo-Dark.png"
            index={1}
            isGroupInView={isGroupInView}
          />
          <EducationCard
            institution="Loyola High School"
            degree="High School Diploma"
            dateRange="2017 - 2022"
            rotation={10}
            zIndex={1}
            logo="/Loyola-Logo.png"
            darkLogo="/Loyola-Logo-Dark.png"
            index={2}
            isGroupInView={isGroupInView}
          />
        </Group>
      </Stack>
    </Container>
  );
}
