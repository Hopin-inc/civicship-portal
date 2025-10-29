import { metadata } from "./metadata";
import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const result = await fetchPrivateUserServer();

  if (result.type === "success") {
    const portfolios = (result.user.portfolios ?? []).map(mapGqlPortfolio);

    return (
      <UserProfileProvider
        value={{
          userId: result.user.id,
          isOwner: true,
          gqlUser: result.user,
          portfolios,
        }}
      >
        <ClientLayout ssrState="success" ssrUser={result.user}>
          {children}
        </ClientLayout>
      </UserProfileProvider>
    );
  }

  if (result.type === "error") {
    // SSR failed with server error - pass error state to client
    return (
      <ClientLayout ssrState="error" ssrUser={null} ssrError={result.error.message}>
        {children}
      </ClientLayout>
    );
  }

  // Unauthenticated - let client retry
  return (
    <ClientLayout ssrState="unauthenticated" ssrUser={null}>
      {children}
    </ClientLayout>
  );
}
