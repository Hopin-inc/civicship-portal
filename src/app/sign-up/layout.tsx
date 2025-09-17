import { AuthProvider } from "@/contexts/AuthProvider";
import { metadata } from "./metadata";
import { RouteGuard } from "@/components/auth/RouteGuard";

export { metadata };

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><RouteGuard>{children}</RouteGuard></AuthProvider>;
}