"use client";

import { Container, Stack, Text, Title } from "@mantine/core";

export function Welcome() {
  return (
    <Container size="md">
      <Stack gap="xl" mt={100} mb={50}>
        <Container size="xs">
          <Title order={1} ta="center">
            Hi, I&apos;m Marcus 👋
          </Title>
        </Container>
        <Text size="lg" ta="center">
          I&apos;m a software developer and computer engineering student at the{" "}
          <Text component="a" href="https://www.ubc.ca/" c="blue" inherit>
            University of British Columbia
          </Text>
          . I&apos;m passionate about building things that make a difference.
        </Text>
        <Text size="lg" ta="center">
          I&apos;m currently working on{" "}
          <Text component="a" href="https://linky.im" c="blue" inherit>
            Linky
          </Text>
          , a tool to distill essential data from web pages using RAG and
          conversational AI.
        </Text>
      </Stack>
    </Container>
  );
}
