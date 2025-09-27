import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function WalletsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/wallets">
      {children}
    </ProtectedLayout>
  );
}
