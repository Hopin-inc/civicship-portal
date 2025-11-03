import { metadata } from "./metadata";
import { ClientLayout } from "./ClientLayout";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { performanceTracker } from "@/lib/logging/performance";
import { getCorrelationId } from "@/lib/logging/request-context";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const correlationId = await getCorrelationId();

  return performanceTracker.measure(
    "/users/me Layout Render",
    async () => {
      const gqlUser = await fetchPrivateUserServer();

      if (gqlUser) {
        performanceTracker.start(`map-portfolios:${correlationId}`);
        const portfolios = (gqlUser.portfolios ?? []).map(mapGqlPortfolio);
        performanceTracker.end(`map-portfolios:${correlationId}`, {
          portfolioCount: portfolios.length,
          correlationId,
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
      correlationId,
    }
  );
}
