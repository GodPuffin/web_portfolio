"use client";

import { Card, Image, Text, useMantineColorScheme } from "@mantine/core";
import { ReactNode } from "react";

interface CardHeaderProps {
  title: string;
  logo?: string;
  darkLogo?: string;
  children?: ReactNode;
  logoHeight?: number;
}

export function CardHeader({
  title,
  logo,
  darkLogo,
  children,
  logoHeight = 50
}: CardHeaderProps) {
  const { colorScheme } = useMantineColorScheme();
  
  return (
    <Card.Section p="md">
      {(logo || darkLogo) && (
        <Image
          src={colorScheme === "dark" && darkLogo ? darkLogo : logo}
          alt={title}
          width={50}
          height={logoHeight}
          fit="contain"
          mb="xs"
        />
      )}
      <div>
        {!logo && !darkLogo && <Text size="lg">{title}</Text>}
        {children}
      </div>
    </Card.Section>
  );
} 