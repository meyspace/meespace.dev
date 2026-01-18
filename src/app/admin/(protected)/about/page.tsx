"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface AboutSection {
    id?: string;
    section_key: string;
    title?: string;
    content?: Record<string, unknown>;
    display_order?: number;
    is_active?: boolean;
}

export default function AdminAboutPage() {
    const [sections, setSections] = useState<Record<string, AboutSection>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    // Form state for each section
    const [header, setHeader] = useState({ title: '', subtitle: '' });
    const [story, setStory] = useState({
        title: '',
        tag: '',
        year: '',
        image: '',
        content: ['']
    });
    const [funFact, setFunFact] = useState({ title: '', description: '' });
    const [offline, setOffline] = useState({ title: '', description: '' });

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const res = await apiCall<{ sections: Record<string, AboutSection> }>('/api/v1/about?admin=true');
        if (res.success && res.data) {
            const secs = res.data.sections || {};
            setSections(secs);

            // Populate form state from database columns
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const headerData = secs.header as any;
            if (headerData) {
                setHeader({
                    title: headerData.title || '',
                    subtitle: headerData.subtitle || ''
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const storyData = secs.story as any;
            if (storyData) {
                // Parse content which is stored as JSON string of paragraphs
                let paragraphs = [''];
                try {
                    const parsed = JSON.parse(storyData.content || '[]');
                    paragraphs = Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
                } catch {
                    paragraphs = storyData.content ? [storyData.content] : [''];
                }
                setStory({
                    title: storyData.title || '',
                    tag: storyData.story_tag || '',
                    year: storyData.story_year || '',
                    image: storyData.image_url || '',
                    content: paragraphs
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const funFactData = secs.funFact as any;
            if (funFactData) {
                setFunFact({
                    title: funFactData.title || '',
                    description: funFactData.content || ''
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const offlineData = secs.offline as any;
            if (offlineData) {
                setOffline({
                    title: offlineData.title || '',
                    description: offlineData.content || ''
                });
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        setIsSaving(true);
        let hasError = false;

        // Save each section
        const sectionsToSave = [
            { section_key: 'header', content: header, title: 'Header' },
            { section_key: 'story', content: story, title: 'My Story' },
            { section_key: 'funFact', content: funFact, title: 'Fun Fact' },
            { section_key: 'offline', content: offline, title: 'When Offline' },
        ];

        for (const section of sectionsToSave) {
            const res = await apiCall(`/api/v1/about?section=${section.section_key}`, {
                method: 'PUT',
                body: {
                    title: section.title,
                    content: section.content,
                    is_active: true,
                },
            });
            if (!res.success) {
                hasError = true;
            }
        }

        setIsSaving(false);

        if (hasError) {
            showToast('Some sections failed to save', 'error');
        } else {
            showToast('About page content saved successfully', 'success');
        }
    };

    const addParagraph = () => {
        setStory(prev => ({ ...prev, content: [...prev.content, ''] }));
    };

    const updateParagraph = (index: number, value: string) => {
        setStory(prev => ({
            ...prev,
            content: prev.content.map((p, i) => i === index ? value : p)
        }));
    };

    const removeParagraph = (index: number) => {
        if (story.content.length > 1) {
            setStory(prev => ({
                ...prev,
                content: prev.content.filter((_, i) => i !== index)
            }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="About Page Content"
                description="Manage your About page sections like My Story, Fun Fact, and When Offline"
                rightAction={
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">save</span>
                                Save All Changes
                            </>
                        )}
                    </button>
                }
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-6">
                {/* Header Section */}
                <section className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">title</span>
                        Page Header
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={header.title}
                                onChange={(e) => setHeader(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                placeholder="About Me"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                value={header.subtitle}
                                onChange={(e) => setHeader(prev => ({ ...prev, subtitle: e.target.value }))}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                placeholder="My journey and experiences"
                            />
                        </div>
                    </div>
                </section>

                {/* My Story Section */}
                <section className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">auto_stories</span>
                        My Story
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={story.title}
                                    onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="My Story"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    Tag
                                </label>
                                <input
                                    type="text"
                                    value={story.tag}
                                    onChange={(e) => setStory(prev => ({ ...prev, tag: e.target.value }))}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="Background"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    Year
                                </label>
                                <input
                                    type="text"
                                    value={story.year}
                                    onChange={(e) => setStory(prev => ({ ...prev, year: e.target.value }))}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="2024"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Photo
                            </label>
                            <ImageUpload
                                label=""
                                folder="about"
                                currentUrl={story.image}
                                onUpload={(url) => setStory(prev => ({ ...prev, image: url }))}
                                accept="image/*"
                                helperText="JPG, PNG, max 5MB"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Story Paragraphs
                            </label>
                            <div className="space-y-2">
                                {story.content.map((paragraph, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <textarea
                                            value={paragraph}
                                            onChange={(e) => updateParagraph(idx, e.target.value)}
                                            className="flex-1 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green min-h-[100px]"
                                            placeholder={`Paragraph ${idx + 1}...`}
                                        />
                                        {story.content.length > 1 && (
                                            <button
                                                onClick={() => removeParagraph(idx)}
                                                className="px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addParagraph}
                                className="mt-2 text-sm text-sage-green hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Add Paragraph
                            </button>
                        </div>
                    </div>
                </section>

                {/* Fun Fact Section */}
                <section className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-500">lightbulb</span>
                        Fun Fact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={funFact.title}
                                onChange={(e) => setFunFact(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                placeholder="Fun Fact"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={funFact.description}
                                onChange={(e) => setFunFact(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green min-h-[80px]"
                                placeholder="Share something interesting about yourself..."
                            />
                        </div>
                    </div>
                </section>

                {/* When Offline Section */}
                <section className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500">hiking</span>
                        When Offline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={offline.title}
                                onChange={(e) => setOffline(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                placeholder="When Offline"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={offline.description}
                                onChange={(e) => setOffline(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green min-h-[80px]"
                                placeholder="What do you do when you're not working..."
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
