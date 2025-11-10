import { metadata } from "./metadata";
import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const gqlUser = await fetchPrivateUserServer();

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

  return <ClientLayout ssrUser={null}>{children}</ClientLayout>;
}
