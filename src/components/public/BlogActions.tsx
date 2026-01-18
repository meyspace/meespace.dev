"use client";

import { useState } from "react";

interface BlogActionsProps {
    title: string;
    slug: string;
}

export function BlogActions({ title, slug }: BlogActionsProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSave = () => {
        // Save to localStorage for now (could be extended to API for logged-in users)
        const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');

        if (isSaved) {
            // Remove from saved
            const updated = savedPosts.filter((s: string) => s !== slug);
            localStorage.setItem('savedBlogPosts', JSON.stringify(updated));
            setIsSaved(false);
        } else {
            // Add to saved
            savedPosts.push(slug);
            localStorage.setItem('savedBlogPosts', JSON.stringify(savedPosts));
            setIsSaved(true);
        }
    };

    // Check if already saved on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
            setIsSaved(savedPosts.includes(slug));
        }
    });

    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return '';
    };

    const shareOptions = [
        {
            name: 'Copy Link',
            icon: 'link',
            action: async () => {
                await navigator.clipboard.writeText(getShareUrl());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        },
        {
            name: 'Twitter/X',
            icon: 'share',
            action: () => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getShareUrl())}`, '_blank');
            }
        },
        {
            name: 'LinkedIn',
            icon: 'share',
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, '_blank');
            }
        },
        {
            name: 'Facebook',
            icon: 'share',
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank');
            }
        },
    ];

    return (
        <div className="flex gap-2 relative">
            <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium group cursor-pointer ${isSaved ? 'text-primary-dark' : 'text-text-muted'}`}
            >
                <span className={`material-symbols-outlined text-[20px] transition-colors ${isSaved ? 'text-primary-dark' : 'group-hover:text-primary-dark'}`}>
                    {isSaved ? 'bookmark' : 'bookmark_border'}
                </span>
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <div className="relative">
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors text-sm font-medium group cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px] group-hover:text-primary-dark transition-colors">share</span>
                    <span className="hidden sm:inline">Share</span>
                </button>

                {showShareMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowShareMenu(false)}
                        />

                        {/* Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={() => {
                                        option.action();
                                        if (option.name !== 'Copy Link') {
                                            setShowShareMenu(false);
                                        }
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg text-text-muted">
                                        {option.name === 'Copy Link' && copied ? 'check' : option.icon}
                                    </span>
                                    {option.name === 'Copy Link' && copied ? 'Copied!' : option.name}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
