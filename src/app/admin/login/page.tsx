import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { AuthFooter } from "@/components/admin/auth/AuthFooter";
import { AuthHeader } from "@/components/admin/auth/AuthHeader";
import { AuthInput } from "@/components/admin/auth/AuthInput";
import { SocialAuth } from "@/components/admin/auth/SocialAuth";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Login - BSA Portfolio",
};

export default function AdminLoginPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main transition-colors duration-200 min-h-screen flex flex-col">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                <AuthCard
                    title="Welcome Back"
                    subtitle="Sign in to manage your BSA portfolio"
                >
                    <form action="/admin/dashboard" className="space-y-5">
                        <AuthInput
                            label="Email address"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="admin@example.com"
                            icon="mail"
                            required
                        />

                        <AuthInput
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            icon="lock"
                            required
                        />

                        <div>
                            <Link href="/admin/dashboard">
                                <AuthButton type="button">Sign In</AuthButton>
                            </Link>
                        </div>
                    </form>

                    <SocialAuth />

                    <p className="mt-8 text-center text-sm text-text-muted dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/admin/register"
                            className="font-semibold text-text-main dark:text-white hover:text-primary-dark transition-colors"
                        >
                            Register
                        </Link>
                    </p>
                </AuthCard>
            </main>

            <AuthFooter />
        </div>
    );
}
