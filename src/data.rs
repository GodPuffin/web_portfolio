//! All portfolio content, ported verbatim from the original hardcoded data.

#[derive(Clone, Copy)]
pub struct Position {
    pub title: &'static str,
    pub date: &'static str,
    pub description: &'static str,
    pub skills: &'static [&'static str],
}

#[derive(Clone, Copy)]
pub struct Experience {
    pub company: &'static str,
    pub logo: &'static str,
    pub dark_logo: &'static str,
    pub logo_height: u32,
    pub positions: &'static [Position],
    pub rotation: f64,
    pub z: i32,
    pub index: usize,
}

#[derive(Clone, Copy)]
pub struct Education {
    pub institution: &'static str,
    pub degree: &'static str,
    pub date: &'static str,
    pub logo: &'static str,
    pub dark_logo: &'static str,
    pub rotation: f64,
    pub z: i32,
    pub index: usize,
}

#[derive(Clone, Copy)]
pub enum LinkKind {
    Github,
    Devpost,
    Website,
}

#[derive(Clone, Copy)]
pub struct Link {
    pub kind: LinkKind,
    pub href: &'static str,
}

#[derive(Clone, Copy)]
pub struct Project {
    pub title: &'static str,
    pub description: &'static str,
    pub tech: &'static [&'static str],
    pub links: &'static [Link],
    pub rotation: f64,
    pub z: i32,
    pub index: usize,
}

pub const EXPERIENCES: &[Experience] = &[
    Experience {
        company: "Fundica",
        logo: "/Fundica-Logo.svg",
        dark_logo: "/Fundica-Logo-Dark.svg",
        logo_height: 70,
        rotation: -8.0,
        z: 3,
        index: 2,
        positions: &[
            Position {
                title: "Intern Software Developer",
                date: "April 2025 - June 2025",
                description: "Full stack work on Fundica's core service & development of testing & AI crawling tools.",
                skills: &["PHP", "SQL", "JavaScript", "Python", "Machine Learning", "Web Scraping"],
            },
            Position {
                title: "Intern Software Developer",
                date: "June 2024 - August 2024",
                description: "Full stack work on Fundica's core service & development of an internal AI data entry tool.",
                skills: &["PHP", "SQL", "JavaScript", "TypeScript", "AI"],
            },
        ],
    },
    Experience {
        company: "Lac Marois Country Club",
        logo: "/LMCC-Logo.png",
        dark_logo: "/LMCC-Logo-Dark.png",
        logo_height: 70,
        rotation: -2.0,
        z: 2,
        index: 3,
        positions: &[
            Position {
                title: "Camp Director",
                date: "Summer 2025",
                description: "Responsible for planning and running all camp activities, ensuring safety of campers, and providing a fun and engaging experience.",
                skills: &["Leadership", "Teaching", "Project Management"],
            },
            Position {
                title: "Head of Sailing",
                date: "Summer 2023",
                description: "Responsible for planning and running sailing events, training new sailors, and maintaining boats.",
                skills: &["Leadership", "Teaching"],
            },
            Position {
                title: "Camp Instructor",
                date: "Summer 2022, 2021",
                description: "Teaching sailing, swimming, canoeing, and more to kids.",
                skills: &["Teaching"],
            },
        ],
    },
    Experience {
        company: "296 - The Northern Knights",
        logo: "/296-Logo.png",
        dark_logo: "/296-Logo-Dark.png",
        logo_height: 70,
        rotation: 10.0,
        z: 1,
        index: 4,
        positions: &[Position {
            title: "Mentor",
            date: "2022 - Present",
            description: "Serving as technical mentor to help FIRST robotics team with everything from software design to on-field coaching.",
            skills: &["Java", "Robotics", "Teaching", "Computer Vision", "CAD", "Electronics"],
        }],
    },
];

pub const EDUCATION: &[Education] = &[
    Education {
        institution: "University of British Columbia",
        degree: "BASc, Computer Engineering",
        date: "2024 - 2028",
        logo: "/UBC-Logo.svg",
        dark_logo: "/UBC-Logo-Dark.svg",
        rotation: -8.0,
        z: 3,
        index: 0,
    },
    Education {
        institution: "Vanier College",
        degree: "DEC, Computer Science & Mathematics",
        date: "2022 - 2024",
        logo: "/Vanier-Logo.png",
        dark_logo: "/Vanier-Logo-Dark.png",
        rotation: -2.0,
        z: 2,
        index: 1,
    },
    Education {
        institution: "Loyola High School",
        degree: "High School Diploma",
        date: "2017 - 2022",
        logo: "/Loyola-Logo.png",
        dark_logo: "/Loyola-Logo-Dark.png",
        rotation: 10.0,
        z: 1,
        index: 2,
    },
];

pub const PROJECTS: &[Project] = &[
    Project {
        title: "Txt2Cad",
        description: "Create 3D models through a conversation with an AI capable of progressively refining your design.",
        tech: &["Python", "TypeScript", "AI", "CAD"],
        links: &[Link { kind: LinkKind::Devpost, href: "https://devpost.com/software/txt2cad" }],
        rotation: -5.0,
        z: 6,
        index: 2,
    },
    Project {
        title: "Northern Knights 2024",
        description: "296's 2024 robot, Bilbo. Featuring a Swerve Drivetrain, Vision Processing, and effective autonomous navigation.",
        tech: &["Java", "Robotics", "CAD", "Computer Vision"],
        links: &[Link { kind: LinkKind::Github, href: "https://github.com/FRC296/FRC-2024" }],
        rotation: 6.0,
        z: 5,
        index: 3,
    },
    Project {
        title: "Argus",
        description: "AI-powered surveillance system for monitoring live feeds from various sources autonomously.",
        tech: &["TypeScript", "AI", "Computer Vision", "Web Development"],
        links: &[
            Link { kind: LinkKind::Github, href: "https://github.com/GodPuffin/Argus" },
            Link { kind: LinkKind::Devpost, href: "https://devpost.com/software/argus-w6i0pv" },
        ],
        rotation: -3.0,
        z: 4,
        index: 4,
    },
    Project {
        title: "Pharmahacks 2024",
        description: "Developed a neural decoding model to predict mouse positions from brain activity data, using advanced data processing techniques.",
        tech: &["Jupyter", "Machine Learning", "Data Science"],
        links: &[Link { kind: LinkKind::Github, href: "https://github.com/GodPuffin/Pharmahacks2024" }],
        rotation: 2.0,
        z: 3,
        index: 5,
    },
    Project {
        title: "Made by Kate",
        description: "Built a complete ecommerce website for a friend's hobby business using Next.js and Stripe.",
        tech: &["TypeScript", "SQL", "Web Development"],
        links: &[
            Link { kind: LinkKind::Website, href: "https://madebykate.ca" },
            Link { kind: LinkKind::Github, href: "https://github.com/GodPuffin/made-by-kate" },
        ],
        rotation: 4.0,
        z: 2,
        index: 6,
    },
    Project {
        title: "FPV Drones",
        description: "Built and flew custom FPV drones as a hobby. Designed, 3D printed, assembled, and CNC cut custom parts for the drones.",
        tech: &["Robotics", "3D Printing", "Electronics", "Firmware"],
        links: &[],
        rotation: -5.0,
        z: 1,
        index: 7,
    },
    Project {
        title: "Family Plan Manager",
        description: "A basic web application for managing shared family plans and subscriptions with friends.",
        tech: &["Go", "HTMX", "SQLite"],
        links: &[
            Link { kind: LinkKind::Github, href: "https://github.com/GodPuffin/FamilyPlan" },
            Link { kind: LinkKind::Website, href: "https://familyplanmanager.xyz" },
        ],
        rotation: 10.0,
        z: 5,
        index: 8,
    },
];

/// Mirrors utils/badgeColors.ts — tech name (case-insensitive) -> Mantine color.
pub fn badge_color(tech: &str) -> &'static str {
    match tech.to_lowercase().as_str() {
        "python" | "jupyter" => "blue",
        "typescript" | "javascript" => "cyan",
        "java" => "green",
        "leadership" | "ai" | "machine learning" => "grape",
        "robotics" | "engineering" => "red",
        "cad" | "3d printing" | "php" => "indigo",
        "computer vision" | "data science" | "data analysis" => "teal",
        "web scraping" | "web development" | "htmx" => "pink",
        "electronics" | "firmware" => "yellow",
        "sql" | "postgres" | "sqlite" | "project management" => "orange",
        "go" => "violet",
        "teaching" => "lime",
        _ => "gray",
    }
}
