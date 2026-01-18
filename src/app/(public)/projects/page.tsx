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
        const res = await fetch(`${baseUrl}/api/v1/projects?status=published`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data?.projects || [];
    } catch {
        return [];
    }
}

async function getSettings() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/settings`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const settings = await getSettings();
    const siteName = settings?.site_name || 'MeySpace';
    const ogImage = settings?.og_image_url || `${baseUrl}/og-image.png`;

    const title = 'Projects';
    const description = 'Portfolio of selected projects and case studies showcasing business analysis and system design work.';

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            title: `${title} | ${siteName}`,
            description,
            url: `${baseUrl}/projects`,
            siteName,
            images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteName} Projects` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${siteName}`,
            description,
            images: [ogImage],
        },
    };
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    // Get unique categories
    const categories = [...new Set(projects.map(p => p.category).filter(Boolean))] as string[];

    return <ProjectsClient projects={projects} categories={categories} />;
}
