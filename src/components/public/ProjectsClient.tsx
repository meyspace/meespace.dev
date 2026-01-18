"use client";

import { useState } from "react";
import { BentoCard } from "@/components/public/BentoCard";
import Link from "next/link";

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

interface ProjectsClientProps {
    projects: Project[];
    categories: string[];
}

export function ProjectsClient({ projects, categories }: ProjectsClientProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Filter projects by category
    const filteredProjects = activeCategory
        ? projects.filter(p => p.category === activeCategory)
        : projects;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-8">
                <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm rounded-3xl p-6 border border-white dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 px-2">
                        Categories
                    </h3>
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer text-left ${activeCategory === null
                                ? 'bg-white dark:bg-[#2d2d2d] text-text-main dark:text-white shadow-sm font-semibold'
                                : 'text-text-muted hover:bg-white dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white hover:shadow-sm'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">apps</span>
                            All Projects
                        </button>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer text-left ${activeCategory === cat
                                    ? 'bg-white dark:bg-[#2d2d2d] text-text-main dark:text-white shadow-sm font-semibold'
                                    : 'text-text-muted hover:bg-white dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white hover:shadow-sm'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="bg-primary/20 rounded-3xl p-6 border border-primary/30">
                    <h4 className="font-bold text-text-main dark:text-white mb-2">Have a project?</h4>
                    <p className="text-xs text-text-muted dark:text-gray-300 mb-4">
                        Let&apos;s discuss how I can help bring your ideas to life.
                    </p>
                    <Link href="/#contact" className="block w-full bg-white dark:bg-gray-800 text-text-main dark:text-white py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all text-center">
                        Get in Touch
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">
                            {activeCategory || 'All Projects'}
                        </h2>
                        <span className="text-sm text-text-muted">
                            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2">folder_off</span>
                            <p>No projects found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProjects.map((project) => (
                                <Link key={project.id} href={`/projects/${project.slug}`}>
                                    <BentoCard className="h-full p-0 overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer group">
                                        <div className="relative">
                                            {project.thumbnail_url ? (
                                                <img
                                                    src={project.thumbnail_url}
                                                    alt={project.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <span className={`material-symbols-outlined text-5xl ${project.icon_color === 'blue' ? 'text-blue-400' :
                                                        project.icon_color === 'purple' ? 'text-purple-400' : 'text-green-400'
                                                        }`}>
                                                        {project.icon || 'folder'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {project.category && (
                                                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full text-xs font-medium text-text-main dark:text-white">
                                                        {project.category}
                                                    </span>
                                                )}
                                                {project.year && (
                                                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full text-xs font-medium text-text-muted">
                                                        {project.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary-dark transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-text-muted line-clamp-2">
                                                {project.short_description}
                                            </p>
                                        </div>
                                    </BentoCard>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
