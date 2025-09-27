import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function MyPageLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ProtectedLayout currentPath="/users/me">
      {children}
    </ProtectedLayout>
  );
}
