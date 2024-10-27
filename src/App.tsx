import "@mantine/core/styles.css";
import "./main.css";
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Navbar } from "./components/Navbar";
import { Welcome } from "./components/Welcome";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Footer } from "./components/Footer";
// import { FlyingCursors } from "./components/FlyingCursors";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      {/* <FlyingCursors /> */}
      <Navbar />
      <Container size="lg" p="xl" mt={180}>
        <Welcome />
        <Experience />
        <Projects />
        <Footer />
      </Container>
    </MantineProvider>
  );
}
