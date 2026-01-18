"use client";

import { useState, useEffect } from "react";
import { Linkedin, Bookmark } from "lucide-react";

interface ProjectSidebarProps {
    title: string;
    slug: string;
}

export function ProjectSidebar({ title, slug }: ProjectSidebarProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Check if already saved
        if (typeof window !== 'undefined') {
            const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
            setIsSaved(savedProjects.includes(slug));
        }

        // Scroll progress
        const handleScroll = () => {
            const article = document.querySelector('article');
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            const progress = Math.min(
                Math.max((scrollY - articleTop + windowHeight * 0.3) / articleHeight, 0),
                1
            );
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    const handleSave = () => {
        const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        if (isSaved) {
            const updated = savedProjects.filter((s: string) => s !== slug);
            localStorage.setItem('savedProjects', JSON.stringify(updated));
            setIsSaved(false);
        } else {
            savedProjects.push(slug);
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
            setIsSaved(true);
        }
    };

    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return '';
    };

    const shareToLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, '_blank');
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getShareUrl())}`, '_blank');
    };

    return (
        <aside className="hidden lg:flex flex-col items-center gap-8 sticky top-32 h-fit pt-8 w-[60px] shrink-0">
            <div className="flex flex-col gap-4">
                {/* LinkedIn Share */}
                <button
                    onClick={shareToLinkedIn}
                    aria-label="Share on LinkedIn"
                    className="size-10 rounded-full bg-white dark:bg-[#1f2623] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-text-muted hover:text-[#0077b5] hover:scale-110 transition-all duration-200"
                >
                    <Linkedin className="w-5 h-5" />
                </button>

                {/* Twitter/X Share */}
                <button
                    onClick={shareToTwitter}
                    aria-label="Share on Twitter"
                    className="size-10 rounded-full bg-white dark:bg-[#1f2623] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-text-muted hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                </button>

                {/* Bookmark */}
                <button
                    onClick={handleSave}
                    aria-label="Bookmark"
                    className={`size-10 rounded-full bg-white dark:bg-[#1f2623] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-all duration-200 ${isSaved ? 'text-primary-dark' : 'text-text-muted hover:text-primary-dark'}`}
                >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Scroll Progress */}
            <div className="h-32 w-1 bg-gray-200 dark:bg-gray-800 rounded-full relative overflow-hidden mt-2">
                <div
                    className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-150"
                    style={{ height: `${scrollProgress * 100}%` }}
                ></div>
            </div>

            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider rotate-90 mt-4 whitespace-nowrap">
                Progress
            </span>
        </aside>
    );
}
