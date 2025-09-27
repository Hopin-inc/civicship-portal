import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/tickets">
      {children}
    </ProtectedLayout>
  );
}
