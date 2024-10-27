"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

const CustomColors: MantineColorsTuple = [
  "#ebfaff",
  "#d7f2fb",
  "#a9e4f9",
  "#7ad6f8",
  "#5ccbf6",
  "#4dc3f6",
  "#44c0f7",
  "#38a9dc",
  "#2996c5",
  "#0082ad",
];

export const theme = createTheme({
  colors: {
    CustomColors,
  },
  autoContrast: true,
  defaultRadius: "lg",
  fontFamily: "Neue Montreal, sans-serif",
});
