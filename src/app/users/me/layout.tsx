import { metadata } from "./metadata";
import { getCurrentUserServer } from "@/lib/auth/getCurrentUserServer";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  await getCurrentUserServer();
  return <>{children}</>;
}
