import { AdminGuard } from "@/components/auth/AdminGuard";
import { generateMetadata } from "./metadata";

export { generateMetadata };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col">
        <main className="w-full flex-grow pb-16">{children}</main>
      </div>
    </AdminGuard>
  );
}
