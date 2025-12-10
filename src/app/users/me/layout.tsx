import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { logger } from "@/lib/logging";

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  logger.info("[AUTH] /users/me layout: Starting to fetch user", {
    component: "MyPageLayout",
  });

  const gqlUser = await fetchPrivateUserServer();

  logger.info("[AUTH] /users/me layout fetchPrivateUserServer result", {
    hasUser: !!gqlUser,
    userId: gqlUser?.id,
    userName: gqlUser?.name,
    hasWallets: !!gqlUser?.wallets,
    walletsCount: gqlUser?.wallets?.length,
    hasPortfolios: !!gqlUser?.portfolios,
    portfoliosCount: gqlUser?.portfolios?.length,
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
