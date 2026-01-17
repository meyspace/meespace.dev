import insightDetailsRaw from "@/data/insight-details.json";
import { InsightDetail } from "@/types/data";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the shape of our raw JSON data
type InsightDetailsMap = Record<string, InsightDetail>;

const insightDetailsStr = JSON.stringify(insightDetailsRaw);
const insightDetails = JSON.parse(insightDetailsStr) as InsightDetailsMap;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const insight = insightDetails[slug];

    if (!insight) {
        return {
            title: "Insight Not Found",
        };
    }

    return {
        title: `${insight.header.title} - Sarah Jenkins`,
    };
}

export default async function InsightDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const insight = insightDetails[slug];

    if (!insight) {
        notFound();
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <div className="mb-6">
                <Link
                    href="/insights"
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary-dark transition-colors pl-1"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        arrow_back
                    </span>
                    Back to Insights
                </Link>
            </div>

            <article className="bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-12">
                <div className="px-8 py-10 md:px-16 md:py-16">
                    <span className="inline-block text-primary-dark font-bold tracking-wide text-xs uppercase mb-4 bg-primary/10 px-3 py-1 rounded-full">
                        {insight.header.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-8 leading-[1.15] tracking-tight">
                        {insight.header.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-200 overflow-hidden shadow-inner relative">
                                {/* Simple avatar placeholder logic similar to main listing or using generic image if provided in JSON */}
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                                    SJ
                                </div>
                            </div>
                            <div>
                                <p className="text-base font-bold text-text-main dark:text-white">
                                    {insight.header.author}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <span>{insight.header.date}</span>
                                    <span className="size-1 bg-text-muted rounded-full"></span>
                                    <span>{insight.header.readTime}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors text-sm font-medium group cursor-pointer">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-primary-dark transition-colors">
                                    bookmark
                                </span>
                                <span className="hidden sm:inline">Save</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors text-sm font-medium group cursor-pointer">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-primary-dark transition-colors">
                                    share
                                </span>
                                <span className="hidden sm:inline">Share</span>
                            </button>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-text-main dark:text-gray-300 leading-8 space-y-8 text-[1.05rem]">
                        {insight.content.map((block, idx) => (
                            <div
                                key={idx}
                                dangerouslySetInnerHTML={{ __html: block }}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#161c19]/50 border-t border-gray-200 dark:border-gray-800 px-8 py-12 md:px-16 md:py-16">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-8 flex items-center gap-3">
                            Comments{" "}
                            <span className="text-sm font-semibold text-text-muted bg-gray-200 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                                {insight.comments.length}
                            </span>
                        </h3>

                        {/* Comment Input */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                            <div className="flex gap-4">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold shrink-0 text-sm">
                                    ME
                                </div>
                                <div className="w-full">
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-black/20 border-0 rounded-lg p-3 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 placeholder-gray-400 resize-none transition-all focus:bg-white dark:focus:bg-black/40 outline-none"
                                        placeholder="Share your thoughts..."
                                        rows={3}
                                    ></textarea>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-xs text-text-muted font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">
                                                markdown
                                            </span>{" "}
                                            Markdown supported
                                        </p>
                                        <button className="bg-primary hover:bg-primary-dark text-text-main px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer">
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-8">
                            {insight.comments.map((comment, idx) => (
                                <div key={idx} className="flex gap-5 group">
                                    <div
                                        className={`size-10 rounded-full bg-${comment.initialsColor}-100 dark:bg-${comment.initialsColor}-900/30 flex items-center justify-center text-${comment.initialsColor}-700 dark:text-${comment.initialsColor}-300 font-bold text-sm shrink-0`}
                                    >
                                        {comment.initials}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-1.5">
                                            <span className="font-bold text-sm text-text-main dark:text-white">
                                                {comment.author}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {comment.date}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed mb-3">
                                            {comment.content}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <button className="text-xs font-semibold text-text-muted hover:text-primary-dark flex items-center gap-1 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-[16px]">
                                                    reply
                                                </span>{" "}
                                                Reply
                                            </button>
                                            <button className="text-xs font-semibold text-text-muted hover:text-primary-dark flex items-center gap-1 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-[16px]">
                                                    thumb_up
                                                </span>{" "}
                                                {comment.likes}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
