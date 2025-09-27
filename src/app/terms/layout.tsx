import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/terms">
      {children}
    </ProtectedLayout>
  );
}
