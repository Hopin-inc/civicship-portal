import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlCurrentUserServerQueryVariables, GqlUser } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";
import { hasServerSession, getServerCookieHeader } from "@/lib/auth/server/session";

type FetchProfileServerResult = {
  currentUser?: { user?: GqlUser | null } | null;
};

export async function fetchPrivateUserServer(): Promise<GqlUser | null> {
  const hasSession = await hasServerSession();
  const cookieHeader = await getServerCookieHeader();

  logger.info("[AUTH] fetchPrivateUserServer: checking session", {
    hasSession,
    hasCookieHeader: !!cookieHeader,
    cookieHeaderLength: cookieHeader?.length,
    component: "fetchPrivateUserServer",
  });

  if (!hasSession) {
    logger.warn("[AUTH] fetchPrivateUserServer: no session cookie, returning null", {
      hasCookieHeader: !!cookieHeader,
      component: "fetchPrivateUserServer",
    });
    return null;
  }

  try {
    logger.info("[AUTH] fetchPrivateUserServer: executing GraphQL query", {
      component: "fetchPrivateUserServer",
    });

    const res = await executeServerGraphQLQuery<
      FetchProfileServerResult,
      GqlCurrentUserServerQueryVariables
    >(FETCH_PROFILE_SERVER_QUERY, {}, cookieHeader ? { cookie: cookieHeader } : {});

    logger.info("[AUTH] fetchPrivateUserServer: query response received", {
      hasCurrentUser: !!res.currentUser,
      hasUser: !!res.currentUser?.user,
      component: "fetchPrivateUserServer",
    });

    const user = res.currentUser?.user ?? null;

    logger.info("[AUTH] fetchPrivateUserServer: query succeeded", {
      hasUser: !!user,
      userId: user?.id,
      userName: user?.name,
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

    return user;
  } catch (error) {
    logger.error("[AUTH] fetchPrivateUserServer: query failed", {
      errorType: error?.constructor?.name,
      message: (error as Error).message,
      stack: (error as Error).stack,
      fullError: JSON.stringify(error, null, 2),
      component: "fetchPrivateUserServer",
    });
    return null;
  }
}
