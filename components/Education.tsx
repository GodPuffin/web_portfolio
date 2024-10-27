"use client";

import { Title, Stack, Card, Text, Container, Group, Image, useMantineColorScheme } from '@mantine/core';
import { useState } from 'react';

interface EducationCardProps {
  institution: string;
  degree?: string;
  dateRange: string;
  description?: string;
  rotation: number;
  zIndex: number;
  logo?: string;
  darkLogo?: string;
}

function EducationCard({ institution, degree, dateRange, description, rotation, zIndex, logo, darkLogo }: EducationCardProps) {
  const [hovered, setHovered] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
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
            alt={institution} 
            width={50} 
            height={50} 
            fit="contain" 
            mb="xs"
          />
        )}
        <div>
          {!logo && !darkLogo && (
            <Text size="lg">{institution}</Text>
          )}
          {degree && <Text size="sm" c="dimmed">{degree}</Text>}
          <Text size="sm">{dateRange}</Text>
        </div>
      </Card.Section>
      {description && <Text size="sm" mt="md">{description}</Text>}
    </Card>
  );
}

export function Education() {
  return (
    <Container size="md">
      <Stack gap="xl" mt={100} mb={50}>
        <Container size="xs" style={{ zIndex: 5 }}>
          <Title order={2} ta="center">Education 🎓</Title>
        </Container>
        <Group justify="center" align="flex-start" style={{ position: 'relative' }}>
          <EducationCard
            institution="University of British Columbia"
            degree="BASc Computer Engineering"
            dateRange="2024 - Present"
            rotation={-8}
            zIndex={3}
            logo="/UBC-Logo.svg"
            darkLogo="/UBC-Logo-Dark.svg"
          />
          <EducationCard
            institution="Vanier College"
            degree="DEC Computer Science & Mathematics"
            dateRange="2022 - 2024"
            rotation={-2}
            zIndex={2}
            // logo="/Vanier-Logo.svg"
            // darkLogo="/Vanier-Logo-Dark.svg"
          />
          <EducationCard
            institution="Loyola High School"
            dateRange="2018 - 2022"
            rotation={10}
            zIndex={1}
            // logo="/Loyola-Logo.svg"
            // darkLogo="/Loyola-Logo-Dark.svg"
          />
        </Group>
      </Stack>
    </Container>
  );
}
