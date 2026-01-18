import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
    children: ReactNode;
    className?: string;
}

export function BentoCard({ children, className }: BentoCardProps) {
    return (
        <div
            className={cn(
                "bento-card bg-white dark:bg-[#1f2623] rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden relative group",
                className
            )}
        >
            {children}
        </div>
    );
}

