import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/opportunities">
      {children}
    </ProtectedLayout>
  );
}
