import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlCurrentUserServerQueryVariables, GqlUser } from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";

type FetchProfileServerResult = {
  currentUser?: { user?: GqlUser | null } | null;
};

export async function fetchPrivateUserServer(): Promise<GqlUser | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Check for session cookie (support both "session" and "__session" names)
  const hasSession = cookieHeader.includes("session=") || cookieHeader.includes("__session=");

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
      GqlCurrentUserServerQueryVariables
    >(FETCH_PROFILE_SERVER_QUERY, {}, cookieHeader ? { cookie: cookieHeader } : {});

    const user = res.currentUser?.user ?? null;

    logger.info("[AUTH] fetchPrivateUserServer: query succeeded", {
      hasUser: !!user,
      userId: user?.id,
      component: "fetchPrivateUserServer",
    });

    logger.info("[AUTH] fetchPrivateUserServer: wallet data snapshot", {
      hasUser: !!user,
      walletsCount: user?.wallets?.length ?? 0,
      walletSummary: (user?.wallets ?? []).map((w) => ({
        id: w.id,
        type: w.type,
        communityId: w.community?.id,
        hasCurrentPointView: w.currentPointView != null,
        currentPoint: w.currentPointView?.currentPoint ?? "__MISSING__",
      })),
      component: "fetchPrivateUserServer",
    });

    // Log raw wallet structure for debugging
    if (user?.wallets && user.wallets.length > 0) {
      logger.info("[AUTH] fetchPrivateUserServer: raw wallet structure", {
        firstWallet: JSON.stringify(user.wallets[0], null, 2),
        component: "fetchPrivateUserServer",
      });
    }

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
