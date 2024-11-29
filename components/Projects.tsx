"use client";

import {
  ActionIcon,
  Badge,
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
import { IconBrandGithub, IconCode, IconWorld } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  rotation: number;
  zIndex: number;
  logo?: string;
  darkLogo?: string;
  image?: string;
  youtubeEmbed?: string;
  githubLink?: string;
  devpostLink?: string;
  websiteLink?: string;
  index: number;
  isGroupInView: boolean;
}

function ProjectCard({
  title,
  description,
  technologies,
  rotation,
  zIndex,
  logo,
  darkLogo,
  image,
  youtubeEmbed,
  githubLink,
  devpostLink,
  websiteLink,
  index,
  isGroupInView,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const ref = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCardInView = useInView(ref, {
    once: true,
    amount: "some",
  });

  const shouldAnimate = isMobile ? isCardInView : isGroupInView;
  const transitionDelay = isMobile ? 0.2 : index * 0.15;

  const getBadgeColor = (tech: string) => {
    switch (tech.toLowerCase()) {
      case "python":
      case "jupyter":
        return "blue";
      case "typescript":
      case "javascript":
        return "cyan";
      case "java":
        return "orange";
      case "ai":
      case "machine learning":
        return "grape";
      case "robotics":
      case "engineering":
        return "red";
      case "cad":
      case "3d printing":
        return "indigo";
      case "computer vision":
      case "data science":
      case "data analysis":
        return "teal";
      case "web scraping":
      case "web development":
        return "pink";
      case "electronics":
      case "firmware":
        return "yellow";
      case "sql":
      case "postgres":
        return "blue";
      default:
        return "gray";
    }
  };

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
        zIndex: isCardInView ? 2 : 0,
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
          <Group>
            {logo
              ? (
                <Image
                  src={colorScheme === "dark" && darkLogo ? darkLogo : logo}
                  alt={title}
                  width={50}
                  height={50}
                  fit="contain"
                  mb="xs"
                />
              )
              : <Text size="lg" fw={500}>{title}</Text>}
            {githubLink && (
              <ActionIcon
                component="a"
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                c="dimmed"
                variant="transparent"
                size="sm"
                aria-label="Github"
              >
                <IconBrandGithub size={20} stroke={1.5} />
              </ActionIcon>
            )}
            {devpostLink && (
              <ActionIcon
                component="a"
                href={devpostLink}
                target="_blank"
                rel="noopener noreferrer"
                c="dimmed"
                variant="transparent"
                size="sm"
                aria-label="Devpost"
              >
                <IconCode size={20} stroke={1.5} />
              </ActionIcon>
            )}
            {websiteLink && (
              <ActionIcon
                component="a"
                href={websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                c="dimmed"
                variant="transparent"
                size="sm"
                aria-label="Website"
              >
                <IconWorld size={20} stroke={1.5} />
              </ActionIcon>
            )}
          </Group>
        </Card.Section>
        {youtubeEmbed
          ? (
            <Card.Section>
              <iframe
                width="100%"
                height="160"
                src={youtubeEmbed}
                title={`${title} YouTube video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              >
              </iframe>
            </Card.Section>
          )
          : image && (
            <Card.Section>
              <Image
                src={image}
                height={160}
                alt={`${title} project screenshot`}
                fit="cover"
              />
            </Card.Section>
          )}
        <Text size="sm">{description}</Text>
        <Group mt="md" gap="xs">
          {technologies.map((tech, index) => (
            <Badge
              key={index}
              variant="light"
              size="sm"
              fw={300}
              color={getBadgeColor(tech)}
            >
              {tech}
            </Badge>
          ))}
        </Group>
      </Card>
    </motion.div>
  );
}

export function Projects() {
  const headerRef = useRef(null);
  const projectsRef = useRef(null);
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 0.3,
  });

  const isProjectsInView = useInView(projectsRef, {
    once: true,
    amount: 0.1,
  });

  return (
    <Container size="md">
      <Stack gap="xl" mt={50} mb={50}>
        <Container size="xs" style={{ zIndex: 5 }}>
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title order={2} ta="center">Projects 🚀</Title>
          </motion.div>
        </Container>
        <Group
          ref={projectsRef}
          justify="center"
          align="flex-start"
          style={{ position: "relative" }}
        >
          <ProjectCard
            title="Txt2Cad"
            description="Create 3D models through a conversation with an AI capable of progressively refining your design."
            technologies={["Python", "TypeScript", "AI", "CAD"]}
            rotation={-5}
            zIndex={6}
            devpostLink="https://devpost.com/software/txt2cad"
            index={2}
            isGroupInView={isProjectsInView}
          />
          <ProjectCard
            title="Northern Knights 2024"
            description="296's 2024 robot, Bilbo. Featuring a Swerve Drivetrain, Vision Processing, and effective autonomous navigation."
            technologies={[
              "Java",
              "Robotics",
              "CAD",
              "Computer Vision",
            ]}
            rotation={6}
            zIndex={5}
            githubLink="https://github.com/FRC296/FRC-2024"
            index={3}
            isGroupInView={isProjectsInView}
          />
          <ProjectCard
            title="Linky AI"
            description="A tool to distill essential data from web pages using RAG and conversational AI."
            technologies={[
              "TypeScript",
              "AI",
              "Web Scraping",
              "Data Analysis",
            ]}
            rotation={-3}
            zIndex={4}
            websiteLink="https://linky.im"
            githubLink="https://github.com/GodPuffin/linky"
            index={4}
            isGroupInView={isProjectsInView}
          />
          <ProjectCard
            title="Pharmahacks 2024"
            description="Developed a neural decoding model to predict mouse positions from brain activity data, using advanced data processing techniques."
            technologies={[
              "Jupyter",
              "Machine Learning",
              "Data Science",
            ]}
            rotation={2}
            zIndex={3}
            githubLink="https://github.com/GodPuffin/Pharmahacks2024"
            index={5}
            isGroupInView={isProjectsInView}
          />
          <ProjectCard
            title="Made by Kate"
            description="Built a complete ecommerce website for a friend's hobby business using Next.js and Stripe."
            technologies={[
              "TypeScript",
              "SQL",
              "Web Development",
            ]}
            rotation={4}
            zIndex={2}
            websiteLink="https://madebykate.ca"
            githubLink="https://github.com/GodPuffin/made-by-kate"
            index={6}
            isGroupInView={isProjectsInView}
          />
          <ProjectCard
            title="FPV Drones"
            description="Built and flew custom FPV drones for acrobatic flying, racing, and cinematography. Designed and 3D printed custom parts to enhance performance and durability."
            technologies={[
              "Robotics",
              "3D Printing",
              "Electronics",
              "Firmware",
            ]}
            rotation={-5}
            zIndex={1}
            index={7}
            isGroupInView={isProjectsInView}
          />
          <ProjectCard
            title="FRC Trades"
            description="A game where users can bet virtual points on FIRST Robotics Competition (FRC) matches."
            technologies={[
              "TypeScript",
              "Postgres",
              "Web Development",
            ]}
            rotation={10}
            zIndex={5}
            githubLink="https://github.com/GodPuffin/frctrades"
            index={8}
            isGroupInView={isProjectsInView}
          />
        </Group>
      </Stack>
    </Container>
  );
}
