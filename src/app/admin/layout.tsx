import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { AdminGuard } from "@/components/auth/AdminGuard";
import { metadata } from "./metadata";

export { metadata };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/admin">
      <AdminGuard>
        <div className="min-h-screen flex flex-col">
          <main className="w-full flex-grow pb-16">{children}</main>
        </div>
      </AdminGuard>
    </ProtectedLayout>
  );
}
