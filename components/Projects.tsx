"use client";

import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { useRef } from "react";
import { IconBrandGithub, IconCode, IconWorld } from "@tabler/icons-react";
import { useInView } from "framer-motion";
import { BaseCard } from "./common/BaseCard";
import { SectionContainer } from "./common/SectionContainer";
import { useAnimationView } from "./common/BaseCard";
import { useMantineColorScheme } from "@mantine/core";
import { getBadgeColor } from "../utils/badgeColors";

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
  const { colorScheme } = useMantineColorScheme();
  const ref = useRef(null);
  const isCardInView = useInView(ref, {
    once: true,
    amount: "some",
  });

  return (
    <BaseCard
      rotation={rotation}
      zIndex={zIndex}
      index={index}
      isGroupInView={isGroupInView}
    >
      <Card.Section p="md">
        <Group>
          {logo ? (
            <Image
              src={colorScheme === "dark" && darkLogo ? darkLogo : logo}
              alt={title}
              width={50}
              height={50}
              fit="contain"
              mb="xs"
            />
          ) : <Text size="lg" fw={500}>{title}</Text>}
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
      {youtubeEmbed ? (
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
      ) : image && (
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
    </BaseCard>
  );
}

export function Projects() {
  const { headerRef, groupRef, isHeaderInView, isGroupInView } = useAnimationView();

  return (
    <SectionContainer
      title="Projects"
      emoji="🚀"
      headerRef={headerRef}
      groupRef={groupRef}
      isHeaderInView={isHeaderInView}
      mt={50}
    >
      <ProjectCard
        title="Txt2Cad"
        description="Create 3D models through a conversation with an AI capable of progressively refining your design."
        technologies={["Python", "TypeScript", "AI", "CAD"]}
        rotation={-5}
        zIndex={6}
        devpostLink="https://devpost.com/software/txt2cad"
        index={2}
        isGroupInView={isGroupInView}
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
        isGroupInView={isGroupInView}
      />
      {/* <ProjectCard
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
        isGroupInView={isGroupInView}
      /> */}
      <ProjectCard
        title="Argus"
        description="AI-powered surveillance system for monitoring live feeds from various sources autonomously."
        technologies={[
          "TypeScript",
          "AI",
          "Computer Vision",
          "Web Development",
        ]}
        rotation={-3}
        zIndex={4}
        githubLink="https://github.com/GodPuffin/Argus"
        devpostLink="https://devpost.com/software/argus-w6i0pv"
        index={4}
        isGroupInView={isGroupInView}
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
        isGroupInView={isGroupInView}
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
        isGroupInView={isGroupInView}
      />
      <ProjectCard
        title="FPV Drones"
        description="Built and flew custom FPV drones as a hobby. Designed, 3D printed, assembled, and CNC cut custom parts for the drones."
        technologies={[
          "Robotics",
          "3D Printing",
          "Electronics",
          "Firmware",
        ]}
        rotation={-5}
        zIndex={1}
        index={7}
        isGroupInView={isGroupInView}
      />
      <ProjectCard
        title="Family Plan Manager"
        description="A basic web application for managing shared family plans and subscriptions with friends."
        technologies={[
          "Go",
          "HTMX",
          "SQLite",
        ]}
        rotation={10}
        zIndex={5}
        githubLink="https://github.com/GodPuffin/FamilyPlan"
        websiteLink="https://familyplanmanager.xyz"
        index={8}
        isGroupInView={isGroupInView}
      />
    </SectionContainer>
  );
}
