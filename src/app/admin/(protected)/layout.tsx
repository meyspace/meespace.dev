import { AdminSidebar } from "@/components/admin/ui/AdminSidebar";

export default function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 overflow-y-auto pb-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
