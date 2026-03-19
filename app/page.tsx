"use client"

import "@mantine/core/styles.css"
import { Container } from "@mantine/core"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import "./main.css"

const Welcome = dynamic(
  () => import("../components/Welcome").then((mod) => mod.Welcome),
  { ssr: false }
)
const Experience = dynamic(
  () => import("../components/Experience").then((mod) => mod.Experience),
  { ssr: false }
)
const Projects = dynamic(
  () => import("../components/Projects").then((mod) => mod.Projects),
  { ssr: false }
)
const Education = dynamic(
  () => import("../components/Education").then((mod) => mod.Education),
  { ssr: false }
)
// const FlyingCursors = dynamic(
//   () => import("../components/FlyingCursors").then((mod) => mod.FlyingCursors),
//   { ssr: false },
// )
const BasicFooter = dynamic(
  () => import("../components/BasicFooter").then((mod) => mod.BasicFooter),
  { ssr: false }
)
const Navbar = dynamic(
  () => import("../components/Navbar").then((mod) => mod.Navbar),
  { ssr: false }
)

export default function HomePage() {
  return (
    <>
      {/* {showCursors && <FlyingCursors />} */}
      <Navbar />
      <Container size="lg" p="xl" mt={180}>
        <Suspense fallback={null}>
          <Welcome />
          <Experience />
          <Projects />
          <Education />
          <BasicFooter />
        </Suspense>
      </Container>
    </>
  )
}
