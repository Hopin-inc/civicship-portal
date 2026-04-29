import { ReactNode } from "react";
import { headers } from "next/headers";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { getCommunityConfig } from "@/lib/communities/config";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { SysAdminGuard } from "@/components/auth/SysAdminGuard";
import HeaderProvider from "@/components/providers/HeaderProvider";
import Header from "@/components/layout/Header";

export default async function SysAdminLayout({ children }: { children: ReactNode }) {
  // ミドルウェアが x-community-id cookie から X-Community-Id ヘッダーをセット済み
  const headersList = await headers();
  const communityId = headersList.get("x-community-id") ?? null;

  const [communityConfig, { user, lineAuthenticated, phoneAuthenticated, hasSession }] =
    await Promise.all([
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
          ssrHasSession={hasSession}
        >
          <HeaderProvider>
            <div className="min-h-screen flex flex-col max-w-mobile-l mx-auto w-full bg-background">
              <Header />
              <main className="w-full flex-grow pt-16">
                <SysAdminGuard>{children}</SysAdminGuard>
              </main>
            </div>
          </HeaderProvider>
          <Toaster />
        </AuthProvider>
      </ApolloProvider>
    </CommunityConfigProvider>
  );
}
