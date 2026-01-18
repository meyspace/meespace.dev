import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

interface FooterData {
    profile?: {
        full_name?: string;
        email?: string;
        social_links?: {
            linkedin?: string;
            github?: string;
        };
    };
    settings?: {
        contact_email?: string;
        copyright_text?: string;
    };
}

async function getFooterData(): Promise<FooterData> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const [profileRes, settingsRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/profile`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/settings`, { next: { revalidate: 60 } }),
        ]);

        const profile = profileRes.ok ? (await profileRes.json()).data : null;
        const settings = settingsRes.ok ? (await settingsRes.json()).data : null;

        return { profile, settings };
    } catch {
        return {};
    }
}

export async function Footer() {
    const { profile, settings } = await getFooterData();

    const name = profile?.full_name || "Portfolio";
    const email = settings?.contact_email || profile?.email || "hello@example.com";
    const linkedinUrl = profile?.social_links?.linkedin;
    const githubUrl = profile?.social_links?.github;
    const copyrightText = settings?.copyright_text || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;

    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 bg-white dark:bg-[#1e1e1e] transition-colors duration-200">
            <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-text-muted dark:text-gray-500">
                    {copyrightText}
                </p>
                <div className="flex items-center gap-6">
                    {linkedinUrl && (
                        <Link
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-text-muted hover:text-primary-dark transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    )}
                    {githubUrl && (
                        <Link
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-text-muted hover:text-primary-dark transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                    )}
                    <a
                        href={`mailto:${email}`}
                        className="text-text-muted hover:text-primary-dark transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <Mail className="w-5 h-5 inline mr-1" />
                        {email}
                    </a>
                </div>
            </div>
        </footer>
    );
}
