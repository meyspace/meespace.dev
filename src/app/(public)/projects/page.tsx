import { Metadata } from "next";
import { ProjectsClient } from "@/components/public/ProjectsClient";

interface Project {
    id: string;
    title: string;
    short_description?: string;
    slug: string;
    category?: string;
    icon?: string;
    icon_color?: string;
    status: string;
    tech_stack?: string[];
    thumbnail_url?: string;
    year?: string;
}

async function getProjects(): Promise<Project[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/projects?status=published`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data?.projects || [];
    } catch {
        return [];
    }
}

export const metadata: Metadata = {
    title: "Projects",
    description: "Portfolio of selected projects.",
};

export default async function ProjectsPage() {
    const projects = await getProjects();

    // Get unique categories
    const categories = [...new Set(projects.map(p => p.category).filter(Boolean))] as string[];

    return <ProjectsClient projects={projects} categories={categories} />;
}
