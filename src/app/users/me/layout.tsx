import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { logger } from "@/lib/logging";

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const gqlUser = await fetchPrivateUserServer();

  logger.debug("[AUTH] /users/me layout fetchPrivateUserServer result", {
    hasUser: !!gqlUser,
    userId: gqlUser?.id,
    component: "MyPageLayout",
  });

  const portfolios = gqlUser ? (gqlUser.portfolios ?? []).map(mapGqlPortfolio) : [];

  // Always wrap children in UserProfileProvider to prevent useUserProfileContext from throwing during SSR
  // When gqlUser is null, ClientLayout will handle fetching the user client-side
  return (
    <UserProfileProvider
      value={{
        userId: gqlUser?.id,
        isOwner: true,
        gqlUser: gqlUser,
        portfolios,
      }}
    >
      <ClientLayout ssrUser={gqlUser}>{children}</ClientLayout>
    </UserProfileProvider>
  );
}
