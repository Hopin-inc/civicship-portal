import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function PlacesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/places">
      {children}
    </ProtectedLayout>
  );
}
