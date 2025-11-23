import { metadata } from "./metadata";
import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { logger } from "@/lib/logging";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const gqlUser = await fetchPrivateUserServer();

  logger.info("[LIFF-DEBUG] /users/me layout fetchPrivateUserServer result", {
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

  logger.info("[LIFF-DEBUG] /users/me layout: no SSR user, using ClientLayout with null", {
    component: "MyPageLayout",
  });

  return <ClientLayout ssrUser={null}>{children}</ClientLayout>;
}
