export const profile = {
  name: "Abdul Basit",
  title: "Agentic AI Engineer & Full-Stack Developer",
  location: "Peshawar, Pakistan",
  github: "https://github.com/basitspi592-tech",
  education: "BS Software Engineering, Abasyn University Peshawar (2023–2027)",
};

export type SectionId = "about" | "skills" | "projects" | "contact";
export type Section = { id: SectionId; label: string; color: string; x: number; z: number };

// Positions of the glowing pads in the 3D world.
export const sections: Section[] = [
  { id: "about", label: "About", color: "#f97b80", x: -18, z: -16 },
  { id: "skills", label: "Skills", color: "#7b6cf6", x: 18, z: -16 },
  { id: "projects", label: "Projects", color: "#ffb347", x: -18, z: 16 },
  { id: "contact", label: "Contact", color: "#3ec9a7", x: 18, z: 16 },
];

export const skillGroups = [
  { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind"] },
  { title: "Backend & Languages", items: ["Python", "Node.js", "C++", "SQL"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { title: "Agentic AI", items: ["LangChain", "LangGraph", "RAG", "MCP", "Agents"] },
  { title: "Tools", items: ["Git", "Docker"] },
];

// Add real projects here when you have them; they show on the Projects pad.
export const projects: { title: string; description: string; link: string }[] = [];
