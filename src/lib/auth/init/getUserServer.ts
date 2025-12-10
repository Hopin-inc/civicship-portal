import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { hasServerSession, getServerCookieHeader } from "@/lib/auth/server/session";

export async function getUserServer(): Promise<{
  user: GqlUser | null;
  lineAuthenticated: boolean;
  phoneAuthenticated: boolean;
}> {
  const cookieStore = await cookies();
  const hasSession = await hasServerSession();
  const cookieHeader = await getServerCookieHeader();

  const phoneAuthenticated = cookieStore.get("phone_authenticated")?.value === "true";

  logger.info("[AUTH] getUserServer: checking session", {
    hasSession,
    hasCookieHeader: !!cookieHeader,
    cookieHeaderLength: cookieHeader?.length ?? 0,
    phoneAuthenticated,
    component: "getUserServer",
  });

  if (!hasSession) {
    logger.info("[AUTH] getUserServer: no session, returning null", {
      component: "getUserServer",
    });
    return {
      user: null,
      lineAuthenticated: false,
      phoneAuthenticated: false,
    };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(GET_CURRENT_USER_SERVER_QUERY, {}, cookieHeader ? { cookie: cookieHeader } : {});

    const user: GqlUser | null = res.currentUser?.user ?? null;
    const hasPhoneIdentity = !!user?.identities?.some((i) => i.platform?.toUpperCase() === "PHONE");

    logger.info("[AUTH] getUserServer: query succeeded", {
      hasUser: !!user,
      userId: user?.id,
      hasPhoneIdentity,
      component: "getUserServer",
    });

    return {
      user,
      lineAuthenticated: true, // SSR時点でsessionがあればtrue扱い
      phoneAuthenticated: hasPhoneIdentity,
    };
  } catch (error) {
    logger.warn("[AUTH] getUserServer: query failed", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      component: "getUserServer",
    });
    return {
      user: null,
      lineAuthenticated: true,
      phoneAuthenticated,
    };
  }
}
