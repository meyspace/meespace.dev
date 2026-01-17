import { BentoCard } from "@/components/public/BentoCard";
import projectsDataRaw from "@/data/projects-page.json";
import { ProjectsPageData } from "@/types/data";
import { Metadata } from "next";

const projectsData = projectsDataRaw as ProjectsPageData;

export const metadata: Metadata = {
    title: `Projects - ${projectsData.main.title}`,
    description: "Portfolio of selected projects.",
};

export default function ProjectsPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-8">
                <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm rounded-3xl p-6 border border-white dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 px-2">
                        {projectsData.sidebar.title}
                    </h3>
                    <nav className="flex flex-col gap-2">
                        {projectsData.sidebar.links.map((link, idx) => (
                            <div key={idx}>
                                <a
                                    href="#"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${link.active
                                            ? "bg-white dark:bg-[#2d2d2d] text-text-main dark:text-white shadow-sm font-semibold"
                                            : "text-text-muted hover:bg-white dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white hover:shadow-sm"
                                        }`}
                                >
                                    {link.icon ? (
                                        <span className="material-symbols-outlined text-lg">
                                            {link.icon}
                                        </span>
                                    ) : (
                                        <span
                                            className={`w-2 h-2 rounded-full bg-${link.color}-400`}
                                        ></span>
                                    )}
                                    {link.label}
                                </a>
                                {idx === 0 && (
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
                <div className="bg-primary/20 rounded-3xl p-6 border border-primary/30">
                    <h4 className="font-bold text-text-main dark:text-white mb-2">
                        {projectsData.sidebar.cta.title}
                    </h4>
                    <p className="text-xs text-text-muted dark:text-gray-300 mb-4">
                        {projectsData.sidebar.cta.description}
                    </p>
                    <button className="w-full bg-white dark:bg-gray-800 text-text-main dark:text-white py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                        {projectsData.sidebar.cta.button}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">
                            {projectsData.main.title}
                        </h2>
                        <div className="flex gap-2">
                            {projectsData.main.categories.map((cat) => (
                                <span
                                    key={cat}
                                    className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-text-main dark:text-white"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projectsData.projects.map((project, idx) => (
                            <BentoCard
                                key={idx}
                                className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col h-full !transition-transform !duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-lg bg-${project.categoryColor}-50 dark:bg-${project.categoryColor}-900/20 text-${project.categoryColor}-600 dark:text-${project.categoryColor}-300 text-xs font-semibold`}
                                        >
                                            {project.category}
                                        </span>
                                        <span className="material-symbols-outlined text-gray-300">
                                            {project.icon}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main dark:text-white">
                                        {project.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-6 flex-grow">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md text-[10px] uppercase font-bold text-gray-500 tracking-wider"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group cursor-pointer">
                                    View Details
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </button>
                            </BentoCard>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
