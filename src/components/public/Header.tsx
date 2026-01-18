"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SiteSettings {
    site_name?: string;
    logo_url?: string;
    logo_url_dark?: string;
}

export function Header() {
    const pathname = usePathname();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        fetch('/api/v1/settings')
            .then(res => res.json())
            .then(data => setSettings(data.data || {}))
            .catch(() => setSettings({}));
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleContactClick = () => {
        setMobileMenuOpen(false);
        if (pathname === '/') {
            const element = document.getElementById('contact');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.href = '/#contact';
        }
    };

    const siteName = settings?.site_name || 'Meyspace';

    // Determine which logo to use based on theme
    const isDark = mounted && resolvedTheme === 'dark';
    const logoUrl = isDark && settings?.logo_url_dark
        ? settings.logo_url_dark
        : settings?.logo_url;

    const navLinks = [
        { href: '/', label: 'Home', active: pathname === '/' },
        { href: '/about', label: 'About', active: pathname === '/about' },
        { href: '/insights', label: 'Insights', active: pathname.startsWith('/insights') },
        { href: '/projects', label: 'Projects', active: pathname.startsWith('/projects') },
    ];

    return (
        <>
            <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
                <header className="pointer-events-auto bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 md:gap-8 max-w-4xl w-full transition-colors duration-200">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/" className="flex items-center justify-center shrink-0">
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={siteName}
                                    width={32}
                                    height={32}
                                    className="h-7 sm:h-8 w-auto object-contain"
                                />
                            ) : (
                                <div className="size-7 sm:size-8 bg-primary rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-base sm:text-lg font-mono font-bold text-text-main">{`{}`}</span>
                                </div>
                            )}
                        </Link>
                        <Link href="/" className="text-text-main dark:text-white text-base sm:text-lg font-bold tracking-tight">
                            {siteName}
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${link.active ? 'text-primary-dark' : 'text-text-main dark:text-gray-300 hover:text-primary-dark'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={handleContactClick}
                            className="bg-primary hover:bg-primary-dark transition-colors text-text-main px-5 py-2 rounded-full text-sm font-bold tracking-wide cursor-pointer"
                        >
                            Contact Me
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-text-main dark:text-white">
                            {mobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </header>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute top-24 left-4 right-4 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-4 space-y-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${link.active
                                    ? 'bg-primary/10 text-primary-dark'
                                    : 'text-text-main dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                        {/* Contact Button */}
                        <button
                            onClick={handleContactClick}
                            className="w-full bg-primary hover:bg-primary-dark transition-colors text-text-main px-4 py-3 rounded-xl text-sm font-bold cursor-pointer"
                        >
                            Contact Me
                        </button>

                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-sm text-text-muted dark:text-gray-400">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
