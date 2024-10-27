"use client";

import "@mantine/core/styles.css";
import "./main.css";
import { Container } from "@mantine/core";
import dynamic from 'next/dynamic';
import { useLocalStorage, useViewportSize } from '@mantine/hooks';
import { useEffect } from 'react';

const Welcome = dynamic(() => import("../components/Welcome").then(mod => mod.Welcome), { ssr: false });
const Experience = dynamic(() => import("../components/Experience").then(mod => mod.Experience), { ssr: false });
const Projects = dynamic(() => import("../components/Projects").then(mod => mod.Projects), { ssr: false });
// const Education = dynamic(() => import("../components/Education").then(mod => mod.Education), { ssr: false });
const Footer = dynamic(() => import("../components/Footer").then(mod => mod.Footer), { ssr: false });
const FlyingCursors = dynamic(() => import("../components/FlyingCursors").then(mod => mod.FlyingCursors), { ssr: false });
const Navbar = dynamic(() => import('../components/Navbar').then(mod => mod.Navbar), { ssr: false });

export default function HomePage() {
  const { width } = useViewportSize();
  const [showCursors, setShowCursors] = useLocalStorage({
    key: 'show-cursors',
    defaultValue: true,
  });

  useEffect(() => {
    if (width <= 768) {
      setShowCursors(false);
    }
  }, [width, setShowCursors]);

  return (
    <>
      {showCursors && <FlyingCursors />}
      <Navbar />
      <Container size="lg" p="xl" mt={180}>
        <Welcome />
        <Experience />
        <Projects />
        {/* <Education /> */}
        <Footer />
      </Container>
    </>
  );
}
