import { Button, Container, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Container style={{ textAlign: "center", marginTop: "100px" }}>
      <Title order={1}>404 - Page Not Found! 😢</Title>
      <Text size="lg" mt="md">
        Oops! The page you are looking for does not exist.
      </Text>
      <Button
        component={Link}
        href="/"
        mt="lg"
        variant="default"
        leftSection={<IconArrowLeft />}
      >
        Go Back Home
      </Button>
    </Container>
  );
}
