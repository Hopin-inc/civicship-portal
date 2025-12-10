import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { logger } from "@/lib/logging";

// Force dynamic rendering to ensure fetchPrivateUserServer runs on every request
export const dynamic = 'force-dynamic';

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const gqlUser = await fetchPrivateUserServer();

  logger.info("[AUTH] /users/me layout fetchPrivateUserServer result", {
    hasUser: !!gqlUser,
    userId: gqlUser?.id,
    component: "MyPageLayout",
  });

  if (gqlUser) {
    const portfolios = (gqlUser.portfolios ?? []).map(mapGqlPortfolio);

    return (
      <UserProfileProvider
        value={{
          userId: gqlUser.id,
          isOwner: true,
          gqlUser,
          portfolios,
        }}
      >
        <ClientLayout ssrUser={gqlUser}>{children}</ClientLayout>
      </UserProfileProvider>
    );
  }

  logger.info("[AUTH] /users/me layout: no SSR user, using ClientLayout with null", {
    component: "MyPageLayout",
  });

  return <ClientLayout ssrUser={null}>{children}</ClientLayout>;
}
