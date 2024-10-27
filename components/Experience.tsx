"use client";

import { Title, Stack, Card, Text, Transition, Container, Group, Image } from '@mantine/core';
import { useState } from 'react';
import { useMantineColorScheme } from '@mantine/core';

const floatTransition = {
  in: { transform: 'translateY(0) rotate(0deg)' },
  out: { transform: 'translateY(-10px) rotate(-2deg)' },
  transitionProperty: 'transform',
};

interface ExperienceCardProps {
  company: string;
  position: string;
  dateRange: string;
  description: string;
  rotation: number;
  zIndex: number;
  logo?: string;
  darkLogo?: string;
}

function ExperienceCard({ company, position, dateRange, description, rotation, zIndex, logo, darkLogo }: ExperienceCardProps) {
  const [hovered, setHovered] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Transition mounted={true} transition={floatTransition} duration={300}>
      {() => (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '100%',
            maxWidth: '300px',
            margin: '20px 0',
            transition: 'all 0.3s ease-in-out',
            transform: `rotate(${hovered ? '0' : rotation}deg) translateY(${hovered ? '-10px' : '0'}) scale(${hovered ? '1.05' : '1'})`,
            boxShadow: hovered
              ? '0 8px 16px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            zIndex: hovered ? 10 : zIndex,
            marginLeft: `-${40 - zIndex * 10}px`,
          }}
        >
          <Card.Section p="md">
              {(logo || darkLogo) && (
                <Image 
                  src={colorScheme === 'dark' && darkLogo ? darkLogo : logo} 
                  alt={company} 
                  width={50} 
                  height={50} 
                  fit="contain" 
                  mb="xs"
                />
              )}
              <div>
                {!logo && !darkLogo && (
                  <Text size="lg">{company}</Text>
                )}
                <Text size="sm" c="dimmed">{position}</Text>
                <Text size="sm">{dateRange}</Text>
              </div>
          </Card.Section>
          <Text size="sm" mt="md">{description}</Text>
        </Card>
      )}
    </Transition>
  );
}

export function Experience() {
  return (
    <Container size="md">
      <Stack gap="xl" mt={100} mb={50}>
        <Container size="xs">
        <Title order={2} ta="center" style={{ zIndex: 5 }}>Experience 📝</Title>
        </Container>
        <Group justify="center" align="flex-start" style={{ position: 'relative' }}>
          <ExperienceCard
            company="Fundica"
            position="Software Developer Intern"
            dateRange="June 2024 - August 2024"
            description="Did full stack work on Fundica's core service and developed an internal tool leveraging generative AI & RAG to help with data entry."
            rotation={-8}
            zIndex={3}
            logo="/Fundica-Logo.svg"
            darkLogo="/Fundica-Logo-Dark.svg"
          />
          <ExperienceCard
            company="Lac Marois Country Club"
            position="Head of Sailing"
            dateRange="Summer 2021, 22, 23"
            description="Responsible for planning and running sailing events, training new sailors, and maintaining boats."
            rotation={-2}
            zIndex={2}
          />
          <ExperienceCard
            company="296 - The Northern Knights"
            position="Mentor"
            dateRange="2022 - Present"
            description="Serving as technical mentor to help FIRST robotics team with everything from software design to on-field coaching. Was previously a student on the team."
            rotation={10}
            zIndex={1}
          />
        </Group>
      </Stack>
    </Container>
  );
}
