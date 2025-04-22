"use client";

import { Text } from "@mantine/core";
import { BaseCard } from "./common/BaseCard";
import { CardHeader } from "./common/CardHeader";
import { SectionContainer } from "./common/SectionContainer";
import { useAnimationView } from "./common/BaseCard";

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

function EducationCard({
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
}: EducationCardProps) {
  return (
    <BaseCard
      rotation={rotation}
      zIndex={zIndex}
      index={index}
      isGroupInView={isGroupInView}
    >
      <CardHeader title={institution} logo={logo} darkLogo={darkLogo}>
        {degree && <Text size="sm" c="dimmed">{degree}</Text>}
        <Text size="sm">{dateRange}</Text>
      </CardHeader>
      {description && <Text size="sm" mt="md">{description}</Text>}
    </BaseCard>
  );
}

export function Education() {
  const { headerRef, groupRef, isHeaderInView, isGroupInView } = useAnimationView();

  return (
    <SectionContainer
      title="Education"
      emoji="🎓"
      headerRef={headerRef}
      groupRef={groupRef}
      isHeaderInView={isHeaderInView}
    >
      <EducationCard
        institution="University of British Columbia"
        degree="BASc, Computer Engineering"
        dateRange="2024 - 2028"
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
    </SectionContainer>
  );
}
