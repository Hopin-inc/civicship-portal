import { metadata } from "./metadata";
import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { performanceTracker } from "@/lib/logging/performance";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  return performanceTracker.measure(
    "/users/me Layout Render",
    async () => {
      const gqlUser = await fetchPrivateUserServer();

      if (gqlUser) {
        performanceTracker.start("map-portfolios");
        const portfolios = (gqlUser.portfolios ?? []).map(mapGqlPortfolio);
        performanceTracker.end("map-portfolios", {
          portfolioCount: portfolios.length,
        });

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
    },
    {
      route: "/users/me",
    }
  );
}
