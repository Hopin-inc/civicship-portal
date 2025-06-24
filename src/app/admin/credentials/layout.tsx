import CredentialHeader from "./components/CredentialHeader";
import { SelectionProvider } from "./context/SelectionContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SelectionProvider>
      <CredentialHeader />
      {children}
    </SelectionProvider>
  );
}
