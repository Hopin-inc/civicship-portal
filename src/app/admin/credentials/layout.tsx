import { SelectionProvider } from "./context/SelectionContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SelectionProvider>
      {children}
    </SelectionProvider>
  );
}
