"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface Profile {
    id?: string;
    full_name: string;
    role?: string;
    tagline?: string;
    bio?: string;
    short_bio?: string;
    status?: string;
    avatar_url?: string;
    resume_url?: string;
    email?: string;
    phone?: string;
    location?: string;
    social_links?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        website?: string;
    };
}

interface Settings {
    id?: string;
    site_name: string;
    site_tagline?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    favicon_url?: string;
    logo_url?: string;
    og_image_url?: string;
    contact_email?: string;
    contact_phone?: string;
    footer_text?: string;
    copyright_text?: string;
}

export default function AdminSettingsPage() {
    const [profile, setProfile] = useState<Profile>({
        full_name: '',
        role: '',
        tagline: '',
        short_bio: '',
        avatar_url: '',
        resume_url: '',
        email: '',
        location: '',
        social_links: {},
    });
    const [settings, setSettings] = useState<Settings>({
        site_name: '',
        site_tagline: '',
        seo_title: '',
        seo_description: '',
        contact_email: '',
        footer_text: '',
        copyright_text: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [profileRes, settingsRes] = await Promise.all([
            apiCall<Profile>('/api/v1/profile'),
            apiCall<Settings>('/api/v1/settings'),
        ]);

        if (profileRes.success && profileRes.data) {
            setProfile(profileRes.data);
        }
        if (settingsRes.success && settingsRes.data) {
            setSettings(settingsRes.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);

        const [profileRes, settingsRes] = await Promise.all([
            apiCall('/api/v1/profile', { method: 'PUT', body: profile }),
            apiCall('/api/v1/settings', { method: 'PUT', body: settings }),
        ]);

        if (profileRes.success && settingsRes.success) {
            showToast('Settings saved successfully', 'success');
        } else {
            showToast('Some settings failed to save', 'error');
        }

        setIsSaving(false);
    };

    const RightAction = (
        <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
            {isSaving ? (
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
                <span className="material-symbols-outlined text-sm">save</span>
            )}
            Save Changes
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader title="Settings" description="Manage your portfolio configuration and preferences." />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="animate-pulse space-y-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Settings"
                description="Manage your portfolio configuration and preferences."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-8">

                {/* General Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">General Settings</h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="site-name">
                                    Site Name
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all placeholder:text-gray-400"
                                    id="site-name"
                                    type="text"
                                    value={settings.site_name || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="seo-desc">
                                    SEO Meta Description
                                </label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all placeholder:text-gray-400 h-24 resize-none"
                                    id="seo-desc"
                                    value={settings.seo_description || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seo_description: e.target.value }))}
                                />
                                <p className="mt-2 text-xs text-text-muted dark:text-gray-500 text-right">
                                    {(settings.seo_description || '').length}/160 characters
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profile Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">Profile Settings</h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center gap-4 shrink-0">
                                <ImageUpload
                                    label="Profile Photo"
                                    folder="profile/avatar"
                                    currentUrl={profile.avatar_url}
                                    onUpload={(url) => setProfile(prev => ({ ...prev, avatar_url: url }))}
                                    accept="image/*"
                                    helperText="JPG, PNG, max 5MB"
                                    className="w-32"
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="full-name">
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="full-name"
                                        type="text"
                                        value={profile.full_name || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="title">
                                        Title / Role
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="title"
                                        type="text"
                                        value={profile.role || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                                        placeholder="e.g. Business System Analyst"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="email"
                                        type="email"
                                        value={profile.email || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="bio">
                                        Short Bio
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all placeholder:text-gray-400 h-24 resize-none"
                                        id="bio"
                                        value={profile.short_bio || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, short_bio: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CV / Resume Upload */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">CV / Resume</h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUpload
                                label="Resume / CV File"
                                folder="profile/resume"
                                currentUrl={profile.resume_url}
                                onUpload={(url) => setProfile(prev => ({ ...prev, resume_url: url }))}
                                accept=".pdf,.doc,.docx"
                                helperText="Upload your resume (PDF recommended)"
                            />
                            {profile.resume_url && (
                                <div className="flex items-center justify-center">
                                    <a
                                        href={profile.resume_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-sage-green/10 hover:bg-sage-green/20 text-sage-green rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined">download</span>
                                        View Current CV
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">Social Links</h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="linkedin">
                                    LinkedIn URL
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                    id="linkedin"
                                    placeholder="https://linkedin.com/in/username"
                                    type="url"
                                    value={profile.social_links?.linkedin || ''}
                                    onChange={(e) => setProfile(prev => ({ ...prev, social_links: { ...prev.social_links, linkedin: e.target.value } }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="github">
                                    GitHub URL
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                    id="github"
                                    placeholder="https://github.com/username"
                                    type="url"
                                    value={profile.social_links?.github || ''}
                                    onChange={(e) => setProfile(prev => ({ ...prev, social_links: { ...prev.social_links, github: e.target.value } }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="twitter">
                                    Twitter / X URL
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                    id="twitter"
                                    placeholder="https://twitter.com/username"
                                    type="url"
                                    value={profile.social_links?.twitter || ''}
                                    onChange={(e) => setProfile(prev => ({ ...prev, social_links: { ...prev.social_links, twitter: e.target.value } }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="website">
                                    Personal Website
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                    id="website"
                                    placeholder="https://yourwebsite.com"
                                    type="url"
                                    value={profile.social_links?.website || ''}
                                    onChange={(e) => setProfile(prev => ({ ...prev, social_links: { ...prev.social_links, website: e.target.value } }))}
                                />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
