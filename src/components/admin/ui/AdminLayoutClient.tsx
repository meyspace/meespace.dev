"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto pb-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
