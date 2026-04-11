import { ReactNode } from "react";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { getCommunityConfig } from "@/lib/communities/config";
import { SsrAuthBridge } from "./SsrAuthBridge";
import { headers } from "next/headers";

export default async function CreateLayout({ children }: { children: ReactNode }) {
  // ミドルウェアが X-Community-Id ヘッダーをセットするため、headers() から取得できる
  const headersList = await headers();
  const communityId = headersList.get("x-community-id") ?? null;

  let firebaseTenantId: string | null = null;
  if (communityId) {
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
