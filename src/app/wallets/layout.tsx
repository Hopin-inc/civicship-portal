import { metadata } from "./metadata";
import { AuthProvider } from "@/contexts/AuthProvider";
import { RouteGuard } from "@/components/auth/RouteGuard";

export { metadata };

export default function WalletsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RouteGuard>{children}</RouteGuard>
    </AuthProvider>
  );
}
