import { AdminGuard } from "@/components/auth/AdminGuard";
import AdminErrorBoundary from "@/components/auth/AdminErrorBoundary";
import { metadata } from "./metadata";

export { metadata };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <main className="w-full flex-grow pb-16">{children}</main>
        </div>
      </AdminErrorBoundary>
    </AdminGuard>
  );
}
