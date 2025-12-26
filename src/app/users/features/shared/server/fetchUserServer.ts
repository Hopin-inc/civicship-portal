import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlUser } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { GET_PUBLIC_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { cookies } from "next/headers";

export async function fetchUserServer(
  userId: string,
  communityId?: string
): Promise<GqlUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const headers: Record<string, string> = {};
    if (cookieHeader) {
      headers.cookie = cookieHeader;
    }
    if (communityId) {
      headers["X-Community-Id"] = communityId;
    }

    const res = await executeServerGraphQLQuery<
      { user: GqlUser | null },
      { id: string }
    >(
      GET_PUBLIC_USER_SERVER_QUERY,
      { id: userId },
      headers
    );

    return res.user ?? null;
  } catch (error) {
    logger.warn("⚠️ Failed to fetch user (SSR):", {
      userId,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return null;
  }
}
