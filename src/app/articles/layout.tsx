import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/articles">
      {children}
    </ProtectedLayout>
  );
}
