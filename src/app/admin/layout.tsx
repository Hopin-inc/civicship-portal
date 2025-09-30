import { AdminGuard } from "@/components/auth/AdminGuard";
import { metadata } from "./metadata";
import { AuthProvider } from "@/contexts/AuthProvider";

export { metadata };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="min-h-screen flex flex-col">
          <main className="w-full flex-grow pb-16">{children}</main>
        </div>
      </AdminGuard>
    </AuthProvider>
  );
}
