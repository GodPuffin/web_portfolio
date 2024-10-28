"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Center,
  CheckIcon,
  ColorSwatch,
  Container,
  Grid,
  Group,
  Loader,
  Modal,
  Paper,
  rem,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { supabase } from "../utils/supabaseClient";
import { generateDeviceId } from "../utils/fingerprint";
import { IconPointerFilled } from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";

const checkMessageSafety = async (message: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/checkMessageSafety", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.isSafe;
  } catch (error) {
    console.error("Error checking message safety:", error);
    throw error;
  }
};

export function Footer() {
  const [selectedColor, setSelectedColor] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [message, setMessage] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [userCursor, setUserCursor] = useState<
    { id: number; message: string; color: string } | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCursors, setShowCursors] = useLocalStorage({
    key: "show-cursors",
    defaultValue: false,
  });

  const colors = [
    "orange",
    "red",
    "pink",
    "grape",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "yellow",
  ];

  useEffect(() => {
    const initializeDeviceId = async () => {
      const id = await generateDeviceId();
      setDeviceId(id);
      fetchUserCursor(id);
    };

    initializeDeviceId();
  }, []);

  const fetchUserCursor = async (id: string) => {
    const { data, error } = await supabase
      .from("cursors")
      .select("*")
      .eq("device_id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user cursor:", error);
    } else if (data) {
      setUserCursor(data);
      setMessage(data.message);
      setSelectedColor(data.color);
    }
  };

  const handleSubmit = async () => {
    if (!deviceId) {
      console.error("Device ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (message.length > 30) {
      setError("Message must be 30 characters or less");
      setIsLoading(false);
      return;
    }

    try {
      const isSafe = await checkMessageSafety(message);
      if (!isSafe) {
        setError("Message is not appropriate. Please try again.");
        setIsLoading(false);
        return;
      }

      if (message && selectedColor) {
        const cursorData = {
          device_id: deviceId,
          message,
          color: selectedColor,
        };
        let data, error;

        if (userCursor) {
          ({ data, error } = await supabase
            .from("cursors")
            .update(cursorData)
            .eq("device_id", deviceId));
        } else {
          ({ data, error } = await supabase
            .from("cursors")
            .insert([cursorData]));
        }

        if (error) {
          throw new Error("Error submitting cursor");
        } else {
          setModalOpened(false);
          setUserCursor(data ? data[0] : null);
          fetchUserCursor(deviceId);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'relative',
      zIndex: 3,
    }}>
      <Paper
        p="md"
        withBorder
      >
        <Container size="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Made by Marcus Lee.
            </Text>
            <Group>
              <Button
                onClick={() => setModalOpened(true)}
                variant="default"
                fw={400}
              >
                {userCursor ? "Edit Message" : "Add Message"}
              </Button>
              {userCursor && userCursor.message
                ? (
                  <Tooltip
                    label={userCursor.message}
                    position="top"
                    color={selectedColor || "blue"}
                  >
                    <IconPointerFilled
                      size={20}
                      color={`var(--mantine-color-${
                        selectedColor || "blue"
                      }-6)`}
                    />
                  </Tooltip>
                )
                : (
                  <IconPointerFilled
                    size={20}
                    color={`var(--mantine-color-${selectedColor || "blue"}-6)`}
                  />
                )}
              <Switch
                checked={showCursors}
                onChange={(event) =>
                  setShowCursors(event.currentTarget.checked)}
              />
            </Group>
            <Text size="sm" c="dimmed">
              Updated on 2024-10-27
            </Text>
          </Group>
        </Container>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={userCursor
          ? "Edit Your Flying Cursor"
          : "Add Your Flying Cursor"}
        centered
      >
        <Grid>
          <Grid.Col span={7}>
            <Stack>
              <TextInput
                placeholder="Hello from 🇨🇦!"
                label="Pick a message:"
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                fw={400}
                maxLength={30}
              />
              <Text size="sm" mt="md">And a color:</Text>
              <Center>
                <Group justify="center">
                  {colors.map((color) => (
                    <ColorSwatch
                      key={color}
                      component="button"
                      color={`var(--mantine-color-${color}-6)`}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {selectedColor === color && (
                        <CheckIcon
                          style={{
                            width: rem(12),
                            height: rem(12),
                          }}
                        />
                      )}
                    </ColorSwatch>
                  ))}
                </Group>
              </Center>
            </Stack>
          </Grid.Col>
          <Grid.Col span={5}>
            <Center h="100%">
              {message
                ? (
                  <Tooltip
                    label={message}
                    color={selectedColor || "red"}
                    opened
                  >
                    <IconPointerFilled
                      size={50}
                      style={{
                        color: `var(--mantine-color-${
                          selectedColor || "red"
                        }-6)`,
                      }}
                    />
                  </Tooltip>
                )
                : (
                  <IconPointerFilled
                    size={50}
                    style={{
                      color: `var(--mantine-color-${selectedColor || "red"}-6)`,
                    }}
                  />
                )}
            </Center>
          </Grid.Col>
        </Grid>
        {error && <Text c="red" size="sm" mt="xs">{error}</Text>}
        <Button
          onClick={handleSubmit}
          mt="md"
          fw={400}
          variant="default"
          disabled={isLoading}
        >
          {isLoading
            ? <Loader size="sm" color={selectedColor} type="dots" />
            : (userCursor ? "Update" : "Save")}
        </Button>
      </Modal>
    </div>
  );
}
