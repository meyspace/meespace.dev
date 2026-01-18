import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ImageCarousel } from "@/components/public/ImageCarousel";
import { ProjectSidebar } from "@/components/public/ProjectSidebar";

interface Project {
    id: string;
    title: string;
    short_description?: string;
    full_description?: string;
    slug: string;
    category?: string;
    icon?: string;
    icon_color?: string;
    status: string;
    year?: string;
    duration?: string;
    client_type?: string;
    industry?: string;
    tech_stack?: string[];
    problem_statement?: string;
    solution_description?: string;
    featured_image_url?: string;
    thumbnail_url?: string;
    gallery_images?: { url: string; alt?: string; caption?: string }[];
    outcomes?: { value: string; label: string; description?: string; icon?: string }[];
    deliverables?: { title: string; description: string; icon: string }[];
    tools?: { name: string; icon_url?: string; icon?: string }[];
    tags?: string[];
}

interface RelatedProject {
    id: string;
    title: string;
    slug: string;
    category?: string;
    featured_image_url?: string;
}

async function getProject(slug: string): Promise<Project | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/projects/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

async function getRelatedProjects(currentSlug: string): Promise<RelatedProject[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/projects?status=published&limit=4`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        const projects = data.data?.projects || [];
        return projects.filter((p: RelatedProject) => p.slug !== currentSlug).slice(0, 2);
    } catch {
        return [];
    }
}

async function getProfile() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/profile`, { cache: 'no-store' });
        if (!res.ok) return null;
        return (await res.json()).data;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return { title: "Project Not Found" };
    return {
        title: `${project.title} - Case Study`,
        description: project.short_description,
    };
}

// Default fallback project
const defaultProject: Project = {
    id: "demo",
    title: "Global ERP System Migration",
    slug: "global-erp-migration",
    short_description: "Harmonizing cross-border operations for a Fortune 500 retailer.",
    category: "System Migration",
    status: "completed",
    year: "Oct 2023",
    duration: "18 Months",
    client_type: "Fortune 500",
    industry: "Retail",
    problem_statement: "The client was operating on four disjointed legacy ERP systems across their North American, European, and Asian divisions. This fragmentation led to massive data silos, inventory discrepancies of up to 15%, and a monthly financial reconciliation process that took 12 days to complete. The lack of a \"single source of truth\" was actively hindering global expansion plans.",
    solution_description: "I led the requirement gathering and process mapping for a unified cloud-based ERP implementation. This involved conducting over 40 stakeholder workshops to harmonize business processes across regions. We designed a phased rollout strategy, prioritizing the European market due to regulatory pressures, followed by a global deployment of the core financial and supply chain modules.",
    deliverables: [
        { title: "PRD Documentation", description: "Authored comprehensive Product Requirement Documents detailing 200+ functional requirements.", icon: "description" },
        { title: "UML Modeling", description: "Created activity diagrams and sequence charts to visualize complex cross-border workflows.", icon: "schema" },
        { title: "Stakeholder Alignment", description: "Mediated conflicting requirements between regional VPs to achieve process standardization.", icon: "groups" },
        { title: "Data Migration", description: "Defined mapping rules for migrating 10TB of historical transaction data.", icon: "database" },
    ],
    outcomes: [
        { value: "25%", label: "Efficiency Boost", description: "Streamlined operations by replacing 4 legacy systems with a single unified cloud ERP, automating repetitive workflows.", icon: "speed" },
        { value: "4h", label: "Reconciliation Time", description: "Drastically reduced monthly financial close time from 12 days to just 4 hours through real-time ledger updates.", icon: "timeline" },
        { value: "$2.4M", label: "Annual Savings", description: "Immediate cost reduction achieved by decommissioning obsolete on-premise server infrastructure and licenses.", icon: "savings" },
    ],
    tools: [
        { name: "Jira", icon: "task_alt" },
        { name: "SQL Server", icon: "database" },
        { name: "Lucidchart", icon: "draw" },
        { name: "Python", icon: "code" },
        { name: "Tableau", icon: "table_view" },
    ],
    tags: ["Enterprise", "System Migration"],
};

const defaultRelatedProjects: RelatedProject[] = [
    { id: "1", title: "Warehouse Automation Logic", slug: "warehouse-automation", category: "Supply Chain" },
    { id: "2", title: "Payment Gateway Integration", slug: "payment-gateway", category: "FinTech" },
];

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [project, profile] = await Promise.all([getProject(slug), getProfile()]);

    const p = project || defaultProject;
    const relatedProjects = project ? await getRelatedProjects(slug) : defaultRelatedProjects;

    if (!project && slug !== 'demo' && slug !== 'test-title') {
        notFound();
    }

    const authorName = profile?.full_name || 'Sarah Jenkins';
    const authorRole = profile?.role || 'Lead Business Analyst';
    const authorAvatar = profile?.avatar_url || '';
    const heroImage = p.featured_image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80';

    return (
        <>
            {/* Hero Section - Full Bleed */}
            <div className="relative w-screen left-1/2 -translate-x-1/2 h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden -mt-8">
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-4xl px-6 text-center text-white mt-10">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors mb-8 backdrop-blur-sm bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Projects
                    </Link>
                    <div className="mb-6 flex justify-center gap-3 flex-wrap">
                        <span className="inline-block bg-primary/90 text-text-main font-bold tracking-wide text-xs uppercase px-3 py-1 rounded-full">
                            {p.category || 'Project'}
                        </span>
                        {p.tags && p.tags.map((tag) => (
                            <span key={tag} className="inline-block bg-white/20 backdrop-blur-sm text-white font-bold tracking-wide text-xs uppercase px-3 py-1 rounded-full border border-white/30">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] drop-shadow-sm">
                        {p.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm font-medium text-white/80">
                        {p.year && <span>Completed {p.year}</span>}
                        {p.duration && (
                            <>
                                <span className="size-1 bg-white/60 rounded-full"></span>
                                <span>Duration: {p.duration}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-24 relative z-20">
                <div className="flex gap-10 justify-center">
                    {/* Sidebar */}
                    <ProjectSidebar title={p.title} slug={p.slug} />

                    {/* Main Content */}
                    <main className="flex-1 max-w-[900px]">
                        <article className="bg-white dark:bg-[#1f2623] rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                            <div className="px-8 py-10 md:px-16 md:py-12">
                                {/* Author Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-8 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-sm border-2 border-white dark:border-gray-600 relative">
                                            {authorAvatar ? (
                                                <Image src={authorAvatar} alt={authorName} fill className="object-cover" sizes="56px" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                                                    {authorName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-text-main dark:text-white leading-tight">{authorName}</p>
                                            <p className="text-sm text-text-muted">{authorRole}</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex gap-2">
                                        {p.client_type && (
                                            <span className="bg-gray-50 dark:bg-gray-800 text-text-muted px-4 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-700">
                                                {p.client_type}
                                            </span>
                                        )}
                                        {p.industry && (
                                            <span className="bg-gray-50 dark:bg-gray-800 text-text-muted px-4 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-700">
                                                {p.industry}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text-main dark:prose-headings:text-white prose-p:text-text-main dark:prose-p:text-gray-300 prose-strong:text-text-main dark:prose-strong:text-white prose-a:text-primary-dark leading-8">
                                    {/* Lead Excerpt */}
                                    {p.short_description && (
                                        <p className="text-xl md:text-2xl font-medium text-text-muted dark:text-gray-400 leading-relaxed mb-8 !mt-0">
                                            {p.short_description}
                                        </p>
                                    )}

                                    {/* Gallery Carousel - After Excerpt */}
                                    {p.gallery_images && p.gallery_images.length > 0 && (
                                        <div className="my-8 not-prose">
                                            <ImageCarousel images={p.gallery_images} />
                                        </div>
                                    )}

                                    {/* Problem Section */}
                                    {p.problem_statement && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4 flex items-center gap-2 !mt-0">
                                                <span className="w-2 h-8 bg-red-400 rounded-full mr-2"></span>
                                                The Problem
                                            </h3>
                                            <div className="text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                    components={{
                                                        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                                                        ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
                                                    }}
                                                >
                                                    {p.problem_statement}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    )}

                                    {/* Solution Section */}
                                    {p.solution_description && (
                                        <div className="mt-8">
                                            <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                                <span className="w-2 h-8 bg-primary rounded-full mr-2"></span>
                                                The Solution
                                            </h3>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                                components={{
                                                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
                                                    strong: ({ children }) => <strong className="font-bold text-text-main dark:text-white">{children}</strong>,
                                                }}
                                            >
                                                {p.solution_description}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {/* Full Description */}
                                    {p.full_description && (
                                        <div className="mt-8">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                                components={{
                                                    h2: ({ children }) => <h2 className="text-3xl font-bold text-text-main dark:text-white mt-12 mb-6">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-2xl font-bold text-text-main dark:text-white mt-10 mb-4">{children}</h3>,
                                                    p: ({ children }) => <p className="mb-6 leading-8">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-6">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-6">{children}</ol>,
                                                    strong: ({ children }) => <strong className="font-bold text-text-main dark:text-white">{children}</strong>,
                                                    blockquote: ({ children }) => (
                                                        <div className="my-12 -mx-4 md:-mx-8 p-8 md:p-10 bg-background-light dark:bg-black/20 rounded-2xl border-l-4 border-primary flex gap-4 not-prose">
                                                            <span className="material-symbols-outlined text-4xl text-primary shrink-0">format_quote</span>
                                                            <div className="space-y-2 italic text-xl md:text-2xl text-text-main dark:text-gray-200 font-serif leading-relaxed">
                                                                {children}
                                                            </div>
                                                        </div>
                                                    ),
                                                    img: ({ src, alt }) => (
                                                        <div className="my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 not-prose">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={typeof src === 'string' ? src : ''} alt={alt || ''} className="w-full h-auto object-cover" />
                                                        </div>
                                                    ),
                                                    code: ({ children, className }) => {
                                                        const isInline = !className;
                                                        if (isInline) {
                                                            return <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">{children}</code>;
                                                        }
                                                        return <code className={className}>{children}</code>;
                                                    },
                                                }}
                                            >
                                                {p.full_description}
                                            </ReactMarkdown>
                                        </div>
                                    )}



                                    {/* Deliverables Section */}
                                    {p.deliverables && p.deliverables.length > 0 && (
                                        <div className="my-12 p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                            <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Key Deliverables & Role</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {p.deliverables.map((item, idx) => (
                                                    <div key={idx} className="bg-white dark:bg-black/20 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/50 transition-colors">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="material-symbols-outlined text-primary-dark">{item.icon}</span>
                                                            <span className="font-bold text-text-main dark:text-white">{item.title}</span>
                                                        </div>
                                                        <p className="text-sm text-text-muted">{item.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Outcomes Section */}
                                    {p.outcomes && p.outcomes.length > 0 && (
                                        <div className="mt-12 mb-10">
                                            <h4 className="text-xl font-bold text-text-main dark:text-white mb-6 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary-dark">auto_graph</span>
                                                Project Impact & Outcomes
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {p.outcomes.map((stat, idx) => (
                                                    <div key={idx} className="relative bg-white dark:bg-black/20 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:border-primary/50 transition-colors h-full">
                                                        <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity rotate-12">
                                                            <span className="material-symbols-outlined text-[100px] text-primary-dark">{stat.icon || 'trending_up'}</span>
                                                        </div>
                                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                                            <div>
                                                                <div className="text-4xl font-extrabold text-text-main dark:text-white mb-1 tracking-tight">{stat.value}</div>
                                                                <div className="text-sm font-bold text-primary-dark uppercase tracking-wide mb-3">{stat.label}</div>
                                                            </div>
                                                            {stat.description && (
                                                                <p className="text-sm text-text-muted dark:text-gray-400 leading-snug">{stat.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tools Section */}
                                {(p.tools && p.tools.length > 0) || (p.tech_stack && p.tech_stack.length > 0) ? (
                                    <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-700">
                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-6">Tools & Technologies Used</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {p.tools?.map((tool, idx) => (
                                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                                    {tool.icon_url ? (
                                                        <Image src={tool.icon_url} alt={tool.name} width={20} height={20} className="w-5 h-5" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-primary-dark text-[20px]">{tool.icon || 'code'}</span>
                                                    )}
                                                    {tool.name}
                                                </div>
                                            ))}
                                            {!p.tools && p.tech_stack?.map((tool, idx) => (
                                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                                    <span className="material-symbols-outlined text-primary-dark text-[20px]">code</span>
                                                    {tool}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-16"></div>

                                {/* Related Projects */}
                                {relatedProjects.length > 0 && (
                                    <section>
                                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span> Read Next Case Study
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {relatedProjects.map((related) => (
                                                <Link key={related.id} href={`/projects/${related.slug}`} className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
                                                    {related.featured_image_url ? (
                                                        <Image src={related.featured_image_url} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent-purple/30"></div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <span className="text-[10px] font-bold tracking-wider uppercase text-primary mb-2 block">{related.category || 'Project'}</span>
                                                                <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{related.title}</h4>
                                                            </div>
                                                            <span className="material-symbols-outlined text-white/50 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </>
    );
}
