import { AdminLayoutClient } from "@/components/admin/ui/AdminLayoutClient";
import { ToastProvider } from "@/components/shared/Toast";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This will redirect to login if not authenticated or not an admin
    await requireAdmin();

    return (
        <ToastProvider>
            <AdminLayoutClient>
                {children}
            </AdminLayoutClient>
        </ToastProvider>
    );
}
