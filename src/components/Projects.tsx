import {
    ActionIcon,
    Badge,
    Card,
    Container,
    Group,
    Image,
    Stack,
    Text,
    Title,
    Transition,
    useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import { IconBrandGithub, IconCode, IconWorld } from "@tabler/icons-react";

const floatTransition = {
    in: { transform: "translateY(0) rotate(0deg)" },
    out: { transform: "translateY(-10px) rotate(-2deg)" },
    transitionProperty: "transform",
};

interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    rotation: number;
    zIndex: number;
    logo?: string;
    darkLogo?: string;
    image?: string;
    youtubeEmbed?: string;
    githubLink?: string;
    devpostLink?: string;
    websiteLink?: string;
}

function ProjectCard({
    title,
    description,
    technologies,
    rotation,
    zIndex,
    logo,
    darkLogo,
    image,
    youtubeEmbed,
    githubLink,
    devpostLink,
    websiteLink,
}: ProjectCardProps) {
    const [hovered, setHovered] = useState(false);
    const { colorScheme } = useMantineColorScheme();

    const getBadgeColor = (tech: string) => {
        switch (tech.toLowerCase()) {
            case 'python':
            case 'jupyter':
                return 'blue';
            case 'typescript':
            case 'javascript':
                return 'cyan';
            case 'java':
                return 'orange';
            case 'ai':
            case 'machine learning':
                return 'grape';
            case 'robotics':
            case 'engineering':
                return 'red';
            case 'cad':
            case '3d printing':
                return 'indigo';
            case 'computer vision':
            case 'data science':
            case 'data analysis':
                return 'teal';
            case 'web scraping':
            case 'web development':
                return 'pink';
            case 'electronics':
            case 'firmware':
                return 'yellow';
            case 'postgres':
                return 'blue';
            default:
                return 'gray';
        }
    };

    return (
        <Transition mounted={true} transition={floatTransition} duration={300}>
            {() => (
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() =>
                        setHovered(false)}
                    style={{
                        width: "100%",
                        maxWidth: "300px",
                        margin: "20px 0",
                        transition: "all 0.3s ease-in-out",
                        transform: `rotate(${
                            hovered ? "0" : rotation
                        }deg) translateY(${hovered ? "-10px" : "0"}) scale(${
                            hovered ? "1.05" : "1"
                        })`,
                        boxShadow: hovered
                            ? "0 8px 16px rgba(0,0,0,0.2)"
                            : "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                        zIndex: hovered ? 10 : zIndex,
                        marginLeft: `-${40 - zIndex * 10}px`,
                    }}
                >
                    <Card.Section p="md">
                        <Group>
                            {logo
                                ? (
                                    <Image
                                        src={colorScheme === "dark" && darkLogo
                                            ? darkLogo
                                            : logo}
                                        alt={title}
                                        width={50}
                                        height={50}
                                        fit="contain"
                                        mb="xs"
                                    />
                                )
                                : <Text size="lg" fw={500}>{title}</Text>}
                            {githubLink && (
                                <ActionIcon
                                    component="a"
                                    href={githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    c="dimmed"
                                    variant="transparent"
                                    size="sm"
                                >
                                    <IconBrandGithub size={20} stroke={1.5} />
                                </ActionIcon>
                            )}
                            {devpostLink && (
                                <ActionIcon
                                    component="a"
                                    href={devpostLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    c="dimmed"
                                    variant="transparent"
                                    size="sm"
                                >
                                    <IconCode size={20} stroke={1.5} />
                                </ActionIcon>
                            )}
                            {websiteLink && (
                                <ActionIcon
                                    component="a"
                                    href={websiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    c="dimmed"
                                    variant="transparent"
                                    size="sm"
                                >
                                    <IconWorld size={20} stroke={1.5} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Card.Section>
                    {youtubeEmbed
                        ? (
                            <Card.Section>
                                <iframe
                                    width="100%"
                                    height="160"
                                    src={youtubeEmbed}
                                    title={`${title} YouTube video`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                >
                                </iframe>
                            </Card.Section>
                        )
                        : image && (
                            <Card.Section>
                                <Image
                                    src={image}
                                    height={160}
                                    alt={`${title} project screenshot`}
                                    fit="cover"
                                />
                            </Card.Section>
                        )}
                    <Text size="sm">{description}</Text>
                    <Group mt="md" gap="xs">
                        {technologies.map((tech, index) => (
                            <Badge
                                key={index}
                                variant="light"
                                size="sm"
                                fw={300}
                                color={getBadgeColor(tech)}
                            >
                                {tech}
                            </Badge>
                        ))}
                    </Group>
                </Card>
            )}
        </Transition>
    );
}

export function Projects() {
    return (
        <Container size="md">
            <Stack gap="xl" mt={50} mb={50}>
                <Title order={2} ta="center" style={{ zIndex: 5 }}>Projects 🚀</Title>
                <Group
                    justify="center"
                    align="flex-start"
                    style={{ position: "relative" }}
                >
                    <ProjectCard
                        title="Txt2Cad"
                        description="Create 3D models through a conversation with an AI capable of progressively refining your design."
                        technologies={["Python", "TypeScript", "AI", "CAD"]}
                        rotation={-5}
                        zIndex={6}
                        devpostLink="https://devpost.com/software/txt2cad"
                    />
                    <ProjectCard
                        title="Northern Knights 2024"
                        description="296's 2024 robot, Bilbo. Featuring a Swerve Drivetrain, Vision Processing, and effective autonomous navigation."
                        technologies={[
                            "Java",
                            "Robotics",
                            "Engineering",
                            "Computer Vision",
                        ]}
                        rotation={6}
                        zIndex={5}
                        githubLink="https://github.com/FRC296/FRC-2024"
                    />
                    <ProjectCard
                        title="Linky AI"
                        description="A tool to distill essential data from web pages using RAG and conversational AI."
                        technologies={[
                            "TypeScript",
                            "AI",
                            "Web Scraping",
                            "Data Analysis",
                        ]}
                        rotation={-3}
                        zIndex={4}
                        websiteLink="https://linky.im"
                        githubLink="https://github.com/GodPuffin/linky"
                    />
                    <ProjectCard
                        title="Pharmahacks 2024"
                        description="Developed a neural decoding model to predict mouse positions from brain activity data, using advanced data processing techniques."
                        technologies={[
                            "Jupyter",
                            "Machine Learning",
                            "Data Science",
                        ]}
                        rotation={2}
                        zIndex={3}
                        githubLink="https://github.com/GodPuffin/Pharmahacks2024"
                    />
                    <ProjectCard
                        title="Offseason Swerve Drive"
                        description="Mentored students in building a swerve drive mini bot as a proof of concept, focusing on CAD design, assembly, and rigorous testing to refine performance."
                        technologies={[
                            "Java",
                            "Robotics",
                            "CAD",
                        ]}
                        rotation={4}
                        zIndex={2}
                        githubLink="https://github.com/yourusername/offseason-swerve-drive"
                    />
                    <ProjectCard
                        title="FPV Drones"
                        description="Built and flew custom FPV drones for acrobatic flying, racing, and cinematography. Designed and 3D printed custom parts to enhance performance and durability."
                        technologies={[
                            "Robotics",
                            "3D Printing",
                            "Electronics",
                            "Firmware",
                        ]}
                        rotation={-5}
                        zIndex={1}
                    />
                    <ProjectCard
                        title="FRC Trades"
                        description="A game where users can bet virtual points on FIRST Robotics Competition (FRC) matches."
                        technologies={[
                            "TypeScript",
                            "Postgres",
                            "Web Development",
                        ]}
                        rotation={10}
                        zIndex={5}
                        githubLink="https://github.com/GodPuffin/frctrades"
                    />
                </Group>
            </Stack>
        </Container>
    );
}
