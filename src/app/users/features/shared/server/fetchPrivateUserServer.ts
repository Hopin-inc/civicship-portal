import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";

export type FetchPrivateUserResult =
  | { type: "success"; user: GqlUser }
  | { type: "unauthenticated" } // No session or auth error (401)
  | { type: "error"; error: Error }; // Server errors, network errors, etc.

export async function fetchPrivateUserServer(): Promise<FetchPrivateUserResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;
  const hasSession = !!session;

  if (!hasSession) {
    return { type: "unauthenticated" };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(FETCH_PROFILE_SERVER_QUERY, {}, { Authorization: `Bearer ${session}` });

    const user = res.currentUser?.user ?? null;
    if (!user) {
      return { type: "unauthenticated" };
    }

    return { type: "success", user };
  } catch (error) {
    const err = error as Error;

    // Check if this is a 401 authentication error
    if (err.message.includes("status: 401")) {
      logger.warn("Authentication failed during SSR (will retry on client)");
      return { type: "unauthenticated" };
    }

    // For other errors (5xx, network issues, etc.), return error state
    logger.error("⚠️ Failed to fetch private user (SSR):", {
      message: err.message,
      stack: err.stack,
    });
    return { type: "error", error: err };
  }
}
