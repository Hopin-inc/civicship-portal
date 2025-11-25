import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import type { GqlUser } from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";

/**
 * Type for FETCH_PROFILE_SERVER_QUERY response
 * Wraps GqlUser which includes wallet fields with currentPointView
 */
type FetchProfileServerResult = {
  currentUser?: {
    user?: GqlUser | null;
  } | null;
};

type FetchProfileServerVariables = Record<string, never>;

export async function fetchPrivateUserServer(): Promise<GqlUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;
  const hasSession = !!session;

  logger.info("[AUTH] fetchPrivateUserServer: checking session", {
    hasSession,
    component: "fetchPrivateUserServer",
  });

  if (!hasSession) {
    logger.info("[AUTH] fetchPrivateUserServer: no session cookie, returning null", {
      component: "fetchPrivateUserServer",
    });
    return null;
  }

  try {
    const res = await executeServerGraphQLQuery<
      FetchProfileServerResult,
      FetchProfileServerVariables
    >(FETCH_PROFILE_SERVER_QUERY, {}, { Authorization: `Bearer ${session}` });

    const user = res.currentUser?.user ?? null;

    logger.info("[AUTH] fetchPrivateUserServer: query succeeded", {
      hasUser: !!user,
      userId: user?.id,
      component: "fetchPrivateUserServer",
    });

    return user;
  } catch (error) {
    logger.warn("[AUTH] fetchPrivateUserServer: query failed", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      component: "fetchPrivateUserServer",
    });
    return null;
  }
}
