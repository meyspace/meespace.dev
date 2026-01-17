import { ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <div className="w-full max-w-md space-y-8 mt-[80px]">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-text-muted dark:text-gray-400">
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
