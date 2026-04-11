import { ReactNode } from "react";
import { cookies } from "next/headers";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { getCommunityConfig } from "@/lib/communities/config";
import { SsrAuthBridge } from "./SsrAuthBridge";

export default async function CommunitiesLayout({ children }: { children: ReactNode }) {
  // /communities/* はミドルウェアがスキップされるため X-Community-Id ヘッダーが付かない。
  // Cookie から communityId を取得して firebaseTenantId を解決する。
  const cookieStore = await cookies();
  const communityId = cookieStore.get("x-community-id")?.value ?? null;

  let firebaseTenantId: string | null = null;
  if (communityId) {
    // getCommunityConfig は communityId を GraphQL 変数として渡すためヘッダー不要
    const config = await getCommunityConfig(communityId);
    firebaseTenantId = config?.firebaseTenantId ?? null;
  }

  return (
    <ApolloProvider>
      <SsrAuthBridge
        ssrCurrentUser={null}
        ssrLineAuthenticated={false}
        ssrPhoneAuthenticated={false}
        firebaseTenantId={firebaseTenantId}
      >
        {children}
        <Toaster />
      </SsrAuthBridge>
    </ApolloProvider>
  );
}
