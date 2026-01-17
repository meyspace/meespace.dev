import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { AuthFooter } from "@/components/admin/auth/AuthFooter";
import { AuthHeader } from "@/components/admin/auth/AuthHeader";
import { AuthInput } from "@/components/admin/auth/AuthInput";
import { SocialAuth } from "@/components/admin/auth/SocialAuth";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Register - BSA Portfolio",
};

export default function AdminRegisterPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main transition-colors duration-200 min-h-screen flex flex-col">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                <AuthCard
                    title="Create Admin Account"
                    subtitle="Join the BSA Portfolio management system"
                >
                    <form action="#" method="POST" className="space-y-5">
                        <AuthInput
                            label="Full Name"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Sarah Jenkins"
                            icon="person"
                            required
                        />

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

                        <AuthInput
                            label="Confirm Password"
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            icon="lock_reset"
                            required
                        />

                        <div>
                            <AuthButton type="submit">Create Account</AuthButton>
                        </div>
                    </form>

                    <SocialAuth />

                    <p className="mt-8 text-center text-sm text-text-muted dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/admin/login"
                            className="font-semibold text-text-main dark:text-white hover:text-primary-dark transition-colors"
                        >
                            Login
                        </Link>
                    </p>
                </AuthCard>
            </main>

            <AuthFooter />
        </div>
    );
}
