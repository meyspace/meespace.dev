import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BlogComments } from "@/components/public/BlogComments";
import { InsightSidebar } from "@/components/public/InsightSidebar";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    featured_image_url?: string;
    status: string;
    reading_time?: number;
    read_time_minutes?: number;
    published_at?: string;
    created_at: string;
    category?: { id: string; name: string };
    author?: { full_name: string; avatar_url?: string; role?: string };
    author_name?: string;
    author_avatar_url?: string;
    author_role?: string;
}

interface RelatedPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image_url?: string;
    category?: { name: string };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/blog/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

async function getRelatedPosts(currentSlug: string, categoryId?: string): Promise<RelatedPost[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/blog?status=published&limit=4`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        const posts = data.data?.posts || [];
        // Filter out current post and limit to 2
        return posts.filter((p: RelatedPost) => p.slug !== currentSlug).slice(0, 2);
    } catch {
        return [];
    }
}

async function getProfile() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/profile`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!post) {
        return { title: "Insight Not Found" };
    }

    // Fetch settings for consistent site name
    let siteName = 'MeySpace';
    try {
        const res = await fetch(`${baseUrl}/api/v1/settings`, { next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            siteName = data.data?.site_name || 'MeySpace';
        }
    } catch { /* use default */ }

    const title = `${post.title} - Insights`;
    const description = post.excerpt || post.title;
    const url = `${baseUrl}/insights/${post.slug}`;
    const imageUrl = post.featured_image_url || `${baseUrl}/og-image.png`;
    const authorName = post.author_name || post.author?.full_name || 'Author';

    return {
        title,
        description,
        authors: [{ name: authorName }],
        openGraph: {
            type: 'article',
            title,
            description,
            url,
            siteName,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
            publishedTime: post.published_at || post.created_at,
            authors: [authorName],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [{ url: imageUrl, alt: post.title }],
            creator: `@${siteName.toLowerCase().replace(/\s/g, '')}`,
        },
        alternates: { canonical: url },
    };
}

// Default fallback post for demo
const defaultPost: BlogPost = {
    id: "demo",
    title: "Migrating Legacy Monoliths",
    slug: "migrating-legacy-monoliths",
    excerpt: "A Business System Analyst's perspective on modernizing critical financial infrastructure without breaking the bank.",
    content: `When a financial institution decides to move away from a 20-year-old mainframe system, the challenge isn't just code—it's understanding the ghost logic buried in decades of patches.

The first step in any successful migration isn't choosing the cloud provider; it's mapping the current state. We often find that documentation hasn't been updated since the initial release. My approach starts with "Forensic Requirement Analysis"—essentially interviewing the code through database schema analysis and user behavior tracking.

In my experience with Tier-1 banking systems, approximately 30% of legacy codebase consists of "dead logic"—features built for regulations that were repealed years ago or marketing campaigns that ended in the early 2000s. Identifying this debris early is crucial. It prevents the team from wasting thousands of hours migrating functionality that adds zero value to the modern business.

> "The goal isn't just to replicate features, but to reimagine the business capability using modern patterns."

### Unifying the Data Model

During the discovery phase, we identified three critical data flows that were redundant. By creating a unified data model, we eliminated synchronization issues that had plagued the customer service team for years. The original system required nightly batch jobs to align account balances; the new architecture handled this in real-time.

This transition wasn't just technical. It required extensive stakeholder management to convince the Risk department that real-time processing was actually *safer* than their trusted batch reports. By demonstrating the audit trail capabilities of the new event-driven architecture, we turned our biggest skeptics into our strongest advocates.

Ultimately, the success of a monolith migration hinges on the BSA's ability to translate technical debt into business risk, and technical modernization into business velocity.`,
    status: "published",
    reading_time: 12,
    published_at: "2024-09-12T00:00:00Z",
    created_at: "2024-09-12T00:00:00Z",
    category: { id: "1", name: "Case Study" },
    author: { full_name: "Sarah Jenkins", role: "Business Systems Analyst" },
};

// Default related posts
const defaultRelatedPosts: RelatedPost[] = [
    {
        id: "1",
        title: "Event-Driven Architectures 101",
        slug: "event-driven-architectures",
        category: { name: "Technical" },
    },
    {
        id: "2",
        title: "The Art of System Decomposition",
        slug: "system-decomposition",
        category: { name: "Process" },
    },
];

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [post, profile] = await Promise.all([
        getBlogPost(slug),
        getProfile(),
    ]);

    // Use actual post or fallback to demo
    const p = post || defaultPost;
    const relatedPosts = post ? await getRelatedPosts(slug, p.category?.id) : defaultRelatedPosts;

    if (!post && slug !== 'demo' && slug !== 'asdasd') {
        // Only show demo content for specific test slugs
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const authorName = p.author_name || p.author?.full_name || profile?.full_name || 'Sarah Jenkins';
    const authorRole = p.author_role || p.author?.role || profile?.role || 'Business Systems Analyst';
    const authorAvatar = p.author_avatar_url || p.author?.avatar_url || profile?.avatar_url || '';
    const heroImage = p.featured_image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80';

    return (
        <>
            {/* Hero Section - Full Bleed */}
            <div className="relative w-screen left-1/2 -translate-x-1/2 h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden -mt-8">
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={heroImage}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-4xl px-6 text-center text-white mt-10">
                    <Link
                        href="/insights"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors mb-8 backdrop-blur-sm bg-white/10 px-4 py-1.5 rounded-full border border-white/20"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Insights
                    </Link>
                    <div className="mb-6">
                        <span className="inline-block bg-primary/90 text-text-main font-bold tracking-wide text-xs uppercase px-3 py-1 rounded-full mb-4">
                            {p.category?.name || 'General'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] drop-shadow-sm">
                        {p.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm font-medium text-white/80">
                        <span>{formatDate(p.published_at || p.created_at)}</span>
                        <span className="size-1 bg-white/60 rounded-full"></span>
                        <span>{p.reading_time || p.read_time_minutes || 5} min read</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-24 relative z-20">
                <div className="flex gap-10 justify-center">
                    {/* Sidebar */}
                    <InsightSidebar title={p.title} slug={p.slug} />

                    {/* Main Content */}
                    <main className="flex-1 max-w-[900px]">
                        <article className="bg-white dark:bg-[#1f2623] rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                            <div className="px-8 py-10 md:px-16 md:py-12">
                                {/* Author Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-8 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-sm border-2 border-white dark:border-gray-600 relative">
                                            {authorAvatar ? (
                                                <Image
                                                    src={authorAvatar}
                                                    alt={authorName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="56px"
                                                />
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
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-muted transition-colors text-xs font-medium border border-gray-200 dark:border-gray-700">
                                            <span className="material-symbols-outlined text-[16px]">add</span> Follow
                                        </button>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text-main dark:prose-headings:text-white prose-p:text-text-main dark:prose-p:text-gray-300 prose-strong:text-text-main dark:prose-strong:text-white prose-a:text-primary-dark leading-8">
                                    {/* Lead Excerpt */}
                                    {p.excerpt && (
                                        <p className="text-xl md:text-2xl font-medium text-text-muted dark:text-gray-400 leading-relaxed mb-8 !mt-0">
                                            {p.excerpt}
                                        </p>
                                    )}

                                    {p.content ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                blockquote: ({ children }) => (
                                                    <div className="my-12 -mx-4 md:-mx-8 p-8 md:p-10 bg-background-light dark:bg-black/20 rounded-2xl border-l-4 border-primary flex gap-4 not-prose">
                                                        <span className="material-symbols-outlined text-4xl text-primary shrink-0">format_quote</span>
                                                        <div className="space-y-2 italic text-xl md:text-2xl text-text-main dark:text-gray-200 font-serif leading-relaxed">
                                                            {children}
                                                        </div>
                                                    </div>
                                                ),
                                                h2: ({ children }) => (
                                                    <h2 className="text-3xl font-bold text-text-main dark:text-white mt-12 mb-6">
                                                        {children}
                                                    </h2>
                                                ),
                                                h3: ({ children }) => (
                                                    <h3 className="text-2xl font-bold text-text-main dark:text-white mt-10 mb-4">
                                                        {children}
                                                    </h3>
                                                ),
                                                p: ({ children }) => (
                                                    <p className="mb-6 leading-8">{children}</p>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="list-disc list-inside space-y-2 mb-6">{children}</ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal list-inside space-y-2 mb-6">{children}</ol>
                                                ),
                                                img: ({ src, alt }) => (
                                                    <div className="my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 not-prose">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={typeof src === 'string' ? src : ''}
                                                            alt={alt || ''}
                                                            className="w-full h-auto object-cover"
                                                        />
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
                                            {p.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-text-muted italic">No content available.</p>
                                    )}
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-16"></div>

                                {/* Related Posts */}
                                {relatedPosts.length > 0 && (
                                    <section className="mb-16">
                                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">auto_stories</span> Read Next
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {relatedPosts.map((related) => (
                                                <Link
                                                    key={related.id}
                                                    href={`/insights/${related.slug}`}
                                                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                                                >
                                                    {related.featured_image_url ? (
                                                        <Image
                                                            src={related.featured_image_url}
                                                            alt={related.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent-purple/30"></div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                                        <span className="text-xs font-bold text-primary-dark mb-2 block">
                                                            {related.category?.name || 'General'}
                                                        </span>
                                                        <h4 className="text-lg font-bold leading-tight group-hover:underline decoration-primary decoration-2 underline-offset-4">
                                                            {related.title}
                                                        </h4>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Comments Section */}
                            <BlogComments slug={p.slug} />
                        </article>
                    </main>
                </div>
            </div>
        </>
    );
}
