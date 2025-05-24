"use client";

import { Badge, Text, Group } from "@mantine/core";
import { BaseCard } from "./common/BaseCard";
import { CardHeader } from "./common/CardHeader";
import { SectionContainer } from "./common/SectionContainer";
import { useAnimationView } from "./common/BaseCard";
import { getBadgeColor } from "../utils/badgeColors";

interface ExperienceCardProps {
  company: string;
  positions: {
    position: string;
    dateRange: string;
    description: string;
    skills?: string[];
  }[];
  rotation: number;
  zIndex: number;
  logo?: string;
  darkLogo?: string;
  index: number;
  isGroupInView: boolean;
}

function ExperienceCard({
  company,
  positions,
  rotation,
  zIndex,
  logo,
  darkLogo,
  index,
  isGroupInView,
}: ExperienceCardProps) {
  return (
    <BaseCard
      rotation={rotation}
      zIndex={zIndex}
      index={index}
      isGroupInView={isGroupInView}
    >
      <CardHeader title={company} logo={logo} darkLogo={darkLogo} logoHeight={70} />
      {positions.map((job, idx) => (
        <div key={idx} style={{ marginBottom: idx < positions.length - 1 ? "1rem" : 0 }}>
          <Text size="sm">{job.position}</Text>
          <Badge variant="light" color="gray" size="sm" fw={300}>{job.dateRange}</Badge>
          <Text size="sm" ml="md">{job.description}</Text>
          {job.skills && job.skills.length > 0 && (
            <Group mt="xs" gap="xs" ml="md">
              {job.skills.map((skill, skillIdx) => (
                <Badge
                  key={skillIdx}
                  variant="light"
                  size="sm"
                  fw={300}
                  color={getBadgeColor(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </Group>
          )}
        </div>
      ))}
    </BaseCard>
  );
}

export function Experience() {
  const { headerRef, groupRef, isHeaderInView, isGroupInView } = useAnimationView();

  return (
    <SectionContainer
      title="Experience"
      emoji="📝"
      headerRef={headerRef}
      groupRef={groupRef}
      isHeaderInView={isHeaderInView}
    >
      <ExperienceCard
        company="Fundica"
        positions={[
          {
            position: "Intern Software Developer",
            dateRange: "April 2025 - June 2025",
            description: "Full stack work on Fundica's core service & development of testing & AI crawling tools.",
            skills: ["PHP", "SQL", "JavaScript", "Python", "Machine Learning", "Web Scraping"]
          },
          {
            position: "Intern Software Developer",
            dateRange: "June 2024 - August 2024",
            description: "Full stack work on Fundica's core service & development of an internal AI data entry tool.",
            skills: ["PHP", "SQL", "JavaScript", "TypeScript", "AI"]
          }
        ]}
        rotation={-8}
        zIndex={3}
        logo="/Fundica-Logo.svg"
        darkLogo="/Fundica-Logo-Dark.svg"
        index={2}
        isGroupInView={isGroupInView}
      />
      <ExperienceCard
        company="Lac Marois Country Club"
        positions={[
          {
            position: "Camp Director",
            dateRange: "Summer 2025",
            description: "Responsible for planning and running all camp activities, ensuring safety of campers, and providing a fun and engaging experience.",
            skills: ["Leadership", "Teaching", "Project Management"]
          },
          {
            position: "Head of Sailing",
            dateRange: "Summer 2023",
            description: "Responsible for planning and running sailing events, training new sailors, and maintaining boats.",
            skills: ["Leadership", "Teaching"]
          },
          {
            position: "Camp Instructor",
            dateRange: "Summer 2022, 2021",
            description: "Teaching sailing, swimming, canoeing, and more to kids.",
            skills: ["Teaching"]
          }
        ]}
        rotation={-2}
        zIndex={2}
        logo="/LMCC-Logo.png"
        darkLogo="/LMCC-Logo-Dark.png"
        index={3}
        isGroupInView={isGroupInView}
      />
      <ExperienceCard
        company="296 - The Northern Knights"
        positions={[
          {
            position: "Mentor",
            dateRange: "2022 - Present",
            description: "Serving as technical mentor to help FIRST robotics team with everything from software design to on-field coaching.",
            skills: ["Java", "Robotics", "Teaching", "Computer Vision", "CAD", "Electronics"]
          }
        ]}
        rotation={10}
        zIndex={1}
        logo="/296-Logo.png"
        darkLogo="/296-Logo-Dark.png"
        index={4}
        isGroupInView={isGroupInView}
      />
    </SectionContainer>
  );
}
