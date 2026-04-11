import { ReactNode } from "react";
import { headers } from "next/headers";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { getCommunityConfig } from "@/lib/communities/config";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { AuthProvider } from "@/contexts/AuthProvider";

export default async function CreateLayout({ children }: { children: ReactNode }) {
  // ミドルウェアが x-community-id cookie から X-Community-Id ヘッダーをセット済み
  const headersList = await headers();
  const communityId = headersList.get("x-community-id") ?? null;

  const [communityConfig, { user, lineAuthenticated, phoneAuthenticated }] = await Promise.all([
    communityId ? getCommunityConfig(communityId) : Promise.resolve(null),
    getUserServer(),
  ]);

  return (
    <CommunityConfigProvider config={communityConfig} isFromDatabase={!!communityConfig}>
      <ApolloProvider>
        <AuthProvider
          ssrCurrentUser={user}
          ssrLineAuthenticated={lineAuthenticated}
          ssrPhoneAuthenticated={phoneAuthenticated}
        >
          {children}
          <Toaster />
        </AuthProvider>
      </ApolloProvider>
    </CommunityConfigProvider>
  );
}
