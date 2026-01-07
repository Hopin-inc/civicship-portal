import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { logger } from "@/lib/logging";
import { headers, cookies } from "next/headers";

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  const gqlUser = await fetchPrivateUserServer(communityId);

  logger.debug("[AUTH] /users/me layout fetchPrivateUserServer result", {
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

  logger.debug("[AUTH] /users/me layout: no SSR user, using ClientLayout with null", {
    component: "MyPageLayout",
  });

  return <ClientLayout ssrUser={null}>{children}</ClientLayout>;
}
