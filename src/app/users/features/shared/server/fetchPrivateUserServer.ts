import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { performanceTracker } from "@/lib/logging/performance";
import { getCorrelationId } from "@/lib/logging/request-context";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";

export async function fetchPrivateUserServer(): Promise<GqlUser | null> {
  const correlationId = await getCorrelationId();

  return performanceTracker.measure(
    "fetchPrivateUserServer",
    async () => {
      performanceTracker.start(`get-session-cookie:${correlationId}`);
      const cookieStore = await cookies();
      const session = cookieStore.get("session")?.value ?? null;
      const hasSession = !!session;
      performanceTracker.end(`get-session-cookie:${correlationId}`, {
        hasSession,
        correlationId,
      });

      if (!hasSession) {
        return null;
      }

      try {
        const res = await executeServerGraphQLQuery<
          GqlCurrentUserServerQuery,
          GqlCurrentUserServerQueryVariables
        >(
          FETCH_PROFILE_SERVER_QUERY,
          {},
          { Authorization: `Bearer ${session}` },
          { correlationId, source: "UsersMeLayout/fetchPrivateUserServer" }
        );

        return res.currentUser?.user ?? null;
      } catch (error) {
        logger.error("⚠️ Failed to fetch private user (SSR):", {
          message: (error as Error).message,
          stack: (error as Error).stack,
          correlationId,
        });
        return null;
      }
    },
    {
      correlationId,
      source: "UsersMeLayout/fetchPrivateUserServer",
    }
  );
}
