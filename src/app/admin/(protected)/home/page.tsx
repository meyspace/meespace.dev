"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { apiCall } from "@/hooks/useApi";

interface HomeContent {
    // Hero section (from profile)
    full_name: string;
    role: string;
    tagline: string;
    bio: string;
    short_bio: string;
    status: string;
    avatar_url: string;

    // Site settings
    site_name: string;
    site_tagline: string;

    // Footer
    footer_text: string;
    copyright_text: string;
    contact_email: string;
    contact_phone: string;
    location: string;
}

export default function AdminHomePage() {
    const [formData, setFormData] = useState<HomeContent>({
        full_name: '',
        role: '',
        tagline: '',
        bio: '',
        short_bio: '',
        status: '',
        avatar_url: '',
        site_name: '',
        site_tagline: '',
        footer_text: '',
        copyright_text: '',
        contact_email: '',
        contact_phone: '',
        location: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'footer'>('hero');

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        // Fetch profile
        const profileRes = await apiCall<{ id: string; full_name: string; role: string; tagline: string; bio: string; short_bio: string; status: string; avatar_url: string }>('/api/v1/profile');

        // Fetch settings
        const settingsRes = await apiCall<{ site_name: string; site_tagline: string; footer_text: string; copyright_text: string; contact_email: string; contact_phone: string; location: string }>('/api/v1/settings');

        if (profileRes.success && profileRes.data) {
            setFormData(prev => ({
                ...prev,
                full_name: profileRes.data?.full_name || '',
                role: profileRes.data?.role || '',
                tagline: profileRes.data?.tagline || '',
                bio: profileRes.data?.bio || '',
                short_bio: profileRes.data?.short_bio || '',
                status: profileRes.data?.status || '',
                avatar_url: profileRes.data?.avatar_url || '',
            }));
        }

        if (settingsRes.success && settingsRes.data) {
            setFormData(prev => ({
                ...prev,
                site_name: settingsRes.data?.site_name || '',
                site_tagline: settingsRes.data?.site_tagline || '',
                footer_text: settingsRes.data?.footer_text || '',
                copyright_text: settingsRes.data?.copyright_text || '',
                contact_email: settingsRes.data?.contact_email || '',
                contact_phone: settingsRes.data?.contact_phone || '',
                location: settingsRes.data?.location || '',
            }));
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        setIsSaving(true);

        // Update profile (hero section)
        await apiCall('/api/v1/profile', {
            method: 'PUT',
            body: JSON.stringify({
                full_name: formData.full_name,
                role: formData.role,
                tagline: formData.tagline,
                bio: formData.bio,
                short_bio: formData.short_bio,
                status: formData.status,
            }),
        });

        // Update settings (footer section)
        await apiCall('/api/v1/settings', {
            method: 'PUT',
            body: JSON.stringify({
                site_name: formData.site_name,
                site_tagline: formData.site_tagline,
                footer_text: formData.footer_text,
                copyright_text: formData.copyright_text,
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                location: formData.location,
            }),
        });

        setIsSaving(false);
        alert('Saved successfully!');
    };

    const tabs = [
        { id: 'hero' as const, label: 'Hero Section', icon: 'person' },
        { id: 'footer' as const, label: 'Footer', icon: 'bottom_navigation' },
    ];

    if (isLoading) {
        return (
            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex items-center justify-center min-h-[400px]">
                <span className="material-symbols-outlined animate-spin text-4xl text-text-muted">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-6">
            <AdminPageHeader
                title="Home & Footer Content"
                description="Manage hero section and footer content displayed on the landing page"
                rightAction={
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-text-main font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isSaving && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                        <span className="material-symbols-outlined text-lg">save</span>
                        Save Changes
                    </button>
                }
            />

            {/* Tabs */}
            <div className="flex gap-2 bg-white dark:bg-[#1e1e1e] rounded-xl p-2 border border-gray-200 dark:border-gray-800 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-primary/20 text-primary-dark'
                                : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Hero Section Tab */}
            {activeTab === 'hero' && (
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                    <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-dark">person</span>
                        Hero Section
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Role/Title</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="e.g., Product Designer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Tagline</label>
                        <input
                            type="text"
                            value={formData.tagline}
                            onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="A short catchy tagline"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Short Bio</label>
                        <textarea
                            value={formData.short_bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, short_bio: e.target.value }))}
                            rows={3}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="A brief introduction (displayed in hero)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Full Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={5}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="Detailed biography (Markdown supported)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                <option value="">Select status...</option>
                                <option value="Open to Work">Open to Work</option>
                                <option value="Available for Freelance">Available for Freelance</option>
                                <option value="Currently Employed">Currently Employed</option>
                                <option value="Busy">Busy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Site Name</label>
                            <input
                                type="text"
                                value={formData.site_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Your portfolio name"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                    <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-dark">bottom_navigation</span>
                        Footer Content
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Footer Text</label>
                        <textarea
                            value={formData.footer_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
                            rows={3}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            placeholder="Text displayed in the footer section"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Copyright Text</label>
                        <input
                            type="text"
                            value={formData.copyright_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, copyright_text: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="e.g., © 2024 Your Name. All rights reserved."
                        />
                    </div>

                    <h4 className="text-md font-bold text-text-main dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">Contact Information (Footer)</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Contact Email</label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Contact Phone</label>
                            <input
                                type="text"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="e.g., Jakarta, Indonesia"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
