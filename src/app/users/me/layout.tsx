import { AuthProvider } from "@/contexts/AuthProvider";
import { metadata } from "./metadata";

export { metadata };

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
