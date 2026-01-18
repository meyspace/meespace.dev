"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Comment {
    id: string;
    author_name: string;
    author_email?: string;
    author_initials: string;
    author_initials_color: string;
    content: string;
    created_at: string;
    likes_count: number;
    depth: number;
    parent_comment_id?: string;
    replies: Comment[];
}

interface BlogCommentsProps {
    slug: string;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getColorClasses(color: string): { bg: string; text: string } {
    const colorMap: Record<string, { bg: string; text: string }> = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
        green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
        orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
        red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
        cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
    };
    return colorMap[color] || colorMap.blue;
}

function CommentItem({ comment, onReply, depth = 0 }: { comment: Comment; onReply: (parentId: string) => void; depth?: number }) {
    const colors = getColorClasses(comment.author_initials_color);
    const maxDepth = 3; // Maximum nesting depth for visual purposes
    const visualDepth = Math.min(depth, maxDepth);

    return (
        <div className={`flex gap-4 ${visualDepth > 0 ? `ml-${Math.min(visualDepth * 8, 24)} pl-4 border-l-2 border-gray-200 dark:border-gray-700` : ''}`}>
            <div className={`size-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} font-bold text-sm shrink-0`}>
                {comment.author_initials}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                    <span className="font-bold text-sm text-text-main dark:text-white">{comment.author_name}</span>
                    <span className="text-xs text-text-muted">{formatDate(comment.created_at)}</span>
                    {comment.depth > 0 && (
                        <span className="text-xs text-primary-dark bg-primary/10 px-1.5 py-0.5 rounded">reply</span>
                    )}
                </div>
                {/* Render markdown content */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-text-main dark:text-gray-300 leading-relaxed mb-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {comment.content}
                    </ReactMarkdown>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onReply(comment.id)}
                        className="text-xs font-semibold text-text-muted hover:text-primary-dark flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                        Reply
                    </button>
                </div>

                {/* Nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function BlogComments({ slug }: BlogCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ author_name: '', author_email: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyToName, setReplyToName] = useState<string>('');

    // Fetch comments function
    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/v1/blog/${slug}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.data?.comments || []);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    // Fetch comments on mount
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.author_name || !formData.content) return;

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/v1/blog/${slug}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    parent_comment_id: replyTo,
                }),
            });

            if (res.ok) {
                setFormData({ author_name: '', author_email: '', content: '' });
                setReplyTo(null);
                setReplyToName('');
                // Refetch comments to show the new one
                await fetchComments();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = (parentId: string) => {
        // Find the comment to get the author name
        const findComment = (comments: Comment[], id: string): Comment | null => {
            for (const c of comments) {
                if (c.id === id) return c;
                if (c.replies) {
                    const found = findComment(c.replies, id);
                    if (found) return found;
                }
            }
            return null;
        };
        const comment = findComment(comments, parentId);
        setReplyTo(parentId);
        setReplyToName(comment?.author_name || '');
        // Scroll to comment form
        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelReply = () => {
        setReplyTo(null);
        setReplyToName('');
    };

    // Count total comments including nested
    const countComments = (comments: Comment[]): number => {
        return comments.reduce((acc, c) => acc + 1 + countComments(c.replies || []), 0);
    };

    return (
        <div className="bg-gray-50 dark:bg-[#161c19]/50 border-t border-gray-200 dark:border-gray-800 px-8 py-12 md:px-16 md:py-16">
            <div className="max-w-3xl mx-auto">
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-8 flex items-center gap-3">
                    Comments
                    <span className="text-sm font-semibold text-text-muted bg-gray-200 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                        {countComments(comments)}
                    </span>
                </h3>

                {/* Comment Input */}
                <div id="comment-form" className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                    {replyTo && (
                        <div className="mb-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-text-main dark:text-white">
                                <span className="text-text-muted">Replying to </span>
                                <strong>{replyToName}</strong>
                            </span>
                            <button onClick={cancelReply} className="text-sm text-red-500 hover:underline">Cancel</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                value={formData.author_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                                placeholder="Your name *"
                                required
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                            <input
                                type="email"
                                value={formData.author_email}
                                onChange={(e) => setFormData(prev => ({ ...prev, author_email: e.target.value }))}
                                placeholder="Email (optional)"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 placeholder-gray-400 resize-none outline-none"
                            placeholder={replyTo ? `Reply to ${replyToName}...` : "Share your thoughts... (Markdown supported)"}
                            rows={3}
                            required
                        ></textarea>

                        <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-text-muted font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">markdown</span>
                                Markdown supported
                            </p>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-primary-dark text-text-main px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? 'Posting...' : replyTo ? 'Post Reply' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Comments List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <span className="material-symbols-outlined animate-spin text-2xl text-text-muted">progress_activity</span>
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} onReply={handleReply} depth={0} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-text-muted text-sm">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
