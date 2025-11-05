import { metadata } from "./metadata";
import { ClientLayout } from "./ClientLayout";
import { performanceTracker } from "@/lib/logging/performance";
import { getCorrelationId } from "@/lib/logging/request-context";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const correlationId = await getCorrelationId();

  return performanceTracker.measure(
    "/users/me Layout Render",
    async () => {
      return <ClientLayout ssrUser={null}>{children}</ClientLayout>;
    },
    {
      route: "/users/me",
      correlationId,
    }
  );
}
