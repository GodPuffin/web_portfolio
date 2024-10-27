"use client";

import { useState } from "react";
import {
  ActionIcon,
  Button,
  Container,
  Drawer,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconCategory2,
  IconDownload,
  IconMail,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
import styles from "./Navbar.module.css";

const links = [
  {
    icon: IconBrandGithub,
    label: "GitHub",
    url: "https://github.com/GodPuffin/",
    hoverColor: "green",
  },
  {
    icon: IconBrandLinkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/marcus-m-lee/",
    hoverColor: "blue",
  },
  {
    icon: IconBrandInstagram,
    label: "Instagram",
    url: "https://www.instagram.com/marcus.lee._/",
    hoverColor: "pink",
  },
  {
    icon: IconMail,
    label: "Email",
    url: "mailto:fromportfolio@puffin.mozmail.com",
    hoverColor: "grape",
  },
  {
    icon: IconDownload,
    label: "Resume",
    url: "/resume.pdf",
    hoverColor: "orange",
  },
];

export function Navbar() {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const ThemeIcon = colorScheme === "dark" ? IconSun : IconMoonStars;

  return (
    <>
      <Container size="xs" p="xl" className={styles.navbarWrapper}>
        <Paper p="md" radius="xl" withBorder className={styles.navbarPaper}>
          <Group justify="space-between" wrap="nowrap">
            <Text
              ml="md"
              size="lg"
              className={styles.name}
              c={colorScheme === "dark" ? "white" : "dark"}
            >
              Marcus Lee
            </Text>
            {isMobile
              ? (
                <ActionIcon
                  onClick={() => setDrawerOpened(true)}
                  size="lg"
                  variant="transparent"
                  color={colorScheme === "dark" ? "white" : "dark"}
                  aria-label="Open menu"
                >
                  <IconCategory2 size={24} />
                </ActionIcon>
              )
              : (
                <Group className={styles.iconGroup}>
                  {links.map((item) => (
                    <ActionIcon
                      key={item.label}
                      radius="lg"
                      size="xl"
                      variant="default"
                      className={styles.actionIcon}
                      component="a"
                      href={item.url}
                      onMouseEnter={() => setHoveredIcon(item.label)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      aria-label={item.label}
                    >
                      <item.icon
                        size={24}
                        color={hoveredIcon === item.label
                          ? theme.colors[item.hoverColor][6]
                          : undefined}
                      />
                    </ActionIcon>
                  ))}
                  <ActionIcon
                    onClick={() => toggleColorScheme()}
                    radius="lg"
                    size="xl"
                    variant="default"
                    className={styles.actionIcon}
                    onMouseEnter={() => setHoveredIcon("theme")}
                    onMouseLeave={() => setHoveredIcon(null)}
                    aria-label="Toggle theme"
                  >
                    <ThemeIcon
                      size={24}
                      color={hoveredIcon === "theme"
                        ? (colorScheme === "dark"
                          ? theme.colors.yellow[4]
                          : theme.colors.blue[6])
                        : undefined}
                    />
                  </ActionIcon>
                </Group>
              )}
          </Group>
        </Paper>
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="100%"
        padding="md"
        zIndex={1000000}
        position="top"
        closeButtonProps={{
          size: "xl",
          "aria-label": "Close menu",
        }}
      >
        <Stack>
          {links.map((item) => (
            <Button
              key={item.label}
              leftSection={
                <item.icon
                  size={24}
                  color={hoveredIcon === item.label
                    ? theme.colors[item.hoverColor][6]
                    : undefined}
                />
              }
              variant="default"
              fullWidth
              component="a"
              href={item.url}
              size="xl"
              onMouseEnter={() => setHoveredIcon(item.label)}
              onMouseLeave={() => setHoveredIcon(null)}
              aria-label={item.label}
            >
              {item.label}
            </Button>
          ))}
          <Button
            leftSection={
              <ThemeIcon
                size={24}
                color={hoveredIcon === "theme"
                  ? (colorScheme === "dark"
                    ? theme.colors.yellow[4]
                    : theme.colors.blue[6])
                  : undefined}
              />
            }
            variant="default"
            fullWidth
            onClick={() => toggleColorScheme()}
            size="xl"
            onMouseEnter={() => setHoveredIcon("theme")}
            onMouseLeave={() => setHoveredIcon(null)}
            aria-label="Toggle theme"
          >
            Toggle Theme
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
