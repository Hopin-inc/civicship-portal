import ProtectedLayout from '@/components/auth/ProtectedLayout';
import CredentialHeader from "./components/CredentialHeader";
import { SelectionProvider } from "./context/SelectionContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/admin/credentials">
      <SelectionProvider>
        <CredentialHeader />
        {children}
      </SelectionProvider>
    </ProtectedLayout>
  );
}
