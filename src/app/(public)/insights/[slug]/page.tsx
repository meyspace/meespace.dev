import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BlogComments } from "@/components/public/BlogComments";
import { BlogActions } from "@/components/public/BlogActions";
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
    category?: { name: string };
    author?: { full_name: string };
    author_name?: string;
    comments?: { author: string; content: string; created_at: string }[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/blog/${slug}`, { next: { revalidate: 60 } });
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

    const title = `${post.title} - Insights`;
    const description = post.excerpt || post.title;
    const url = `${baseUrl}/insights/${post.slug}`;
    const imageUrl = post.featured_image_url || `${baseUrl}/og-default.png`;

    return {
        title,
        description,
        authors: [{ name: post.author_name || post.author?.full_name || 'Author' }],
        openGraph: {
            type: 'article',
            title,
            description,
            url,
            siteName: 'My Portfolio',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            publishedTime: post.published_at || post.created_at,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <div className="mb-6">
                <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary-dark transition-colors pl-1">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    Back to Insights
                </Link>
            </div>

            <article className="bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-12">
                <div className="px-8 py-10 md:px-16 md:py-16">
                    <span className="inline-block text-primary-dark font-bold tracking-wide text-xs uppercase mb-4 bg-primary/10 px-3 py-1 rounded-full">
                        {post.category?.name || 'General'}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-6 leading-[1.15] tracking-tight">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-lg text-text-muted dark:text-gray-400 mb-6">
                            {post.excerpt}
                        </p>
                    )}
                    {post.featured_image_url && (
                        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-200 overflow-hidden shadow-inner relative">
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                                    {(post.author_name || post.author?.full_name)?.charAt(0) || 'A'}
                                </div>
                            </div>
                            <div>
                                <p className="text-base font-bold text-text-main dark:text-white">
                                    {post.author_name || post.author?.full_name || 'Author'}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                    <span className="size-1 bg-text-muted rounded-full"></span>
                                    <span>{post.reading_time || post.read_time_minutes || 5} min read</span>
                                </div>
                            </div>
                        </div>
                        <BlogActions title={post.title} slug={post.slug} />
                    </div>

                    {/* Content */}
                    <div className="prose dark:prose-invert max-w-none text-text-main dark:text-gray-300 leading-8 space-y-8 text-[1.05rem]">
                        {post.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {post.content}
                            </ReactMarkdown>
                        ) : post.excerpt ? (
                            <p>{post.excerpt}</p>
                        ) : (
                            <p className="text-text-muted italic">No content available.</p>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <BlogComments slug={post.slug} />
            </article>
        </div>
    );
}
