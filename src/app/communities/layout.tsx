import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { GqlSysRole } from "@/types/graphql";
import { SsrAuthBridge } from "./SsrAuthBridge";

export default async function CommunitiesLayout({ children }: { children: ReactNode }) {
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();

  if (!user || user.sysRole !== GqlSysRole.SysAdmin) {
    notFound();
  }

  return (
    <ApolloProvider>
      <SsrAuthBridge
        ssrCurrentUser={user}
        ssrLineAuthenticated={lineAuthenticated}
        ssrPhoneAuthenticated={phoneAuthenticated}
      >
        {children}
        <Toaster />
      </SsrAuthBridge>
    </ApolloProvider>
  );
}
