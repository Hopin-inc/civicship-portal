import { ReactNode } from "react";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";

export default function CommunitiesLayout({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider>
      {children}
      <Toaster />
    </ApolloProvider>
  );
}
