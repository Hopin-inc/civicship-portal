import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { getCommunityConfig } from "@/lib/communities/config";
import { GqlSysRole } from "@/types/graphql";
import { SsrAuthBridge } from "./SsrAuthBridge";

export default async function CommunitiesLayout({ children }: { children: ReactNode }) {
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();

  if (!user || user.sysRole !== GqlSysRole.SysAdmin) {
    notFound();
  }

  const firstCommunityId = user.memberships?.[0]?.community?.id ?? null;
  let firebaseTenantId: string | null = null;

  if (firstCommunityId) {
    const config = await getCommunityConfig(firstCommunityId);
    firebaseTenantId = config?.firebaseTenantId ?? null;
  }

  return (
    <ApolloProvider>
      <SsrAuthBridge
        ssrCurrentUser={user}
        ssrLineAuthenticated={lineAuthenticated}
        ssrPhoneAuthenticated={phoneAuthenticated}
        firebaseTenantId={firebaseTenantId}
      >
        {children}
        <Toaster />
      </SsrAuthBridge>
    </ApolloProvider>
  );
}
