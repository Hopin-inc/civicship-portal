import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { hasServerSession } from "@/lib/auth/server/session";

export async function getUserServer(): Promise<{
  user: GqlUser | null;
  lineAuthenticated: boolean;
  phoneAuthenticated: boolean;
  lineIdToken: string | null;
  lineTokenExpiresAt: string | null;
}> {
  const cookieStore = await cookies();
  const hasSession = await hasServerSession();

  const phoneAuthenticated = cookieStore.get("phone_authenticated")?.value === "true";

  // exchange で発行した LINE 由来の idToken をクライアントへ受け渡すために読み出す。
  // クライアント側のストアへ初期値として流し込むことで、Firebase 再初期化を待たずに
  // 認証が必要な UI（例: ウォレット送金ボタン）を即座に活性化できる。
  const lineIdTokenCookie = cookieStore.get("auth_line_id_token")?.value ?? null;
  const lineTokenExpiresAtCookie =
    cookieStore.get("auth_line_token_expires_at")?.value ?? null;
  const hasValidIdTokenCookie = Boolean(
    lineIdTokenCookie &&
      lineTokenExpiresAtCookie &&
      Number(lineTokenExpiresAtCookie) > Date.now(),
  );
  const lineIdToken = hasValidIdTokenCookie ? lineIdTokenCookie : null;
  const lineTokenExpiresAt = hasValidIdTokenCookie ? lineTokenExpiresAtCookie : null;

  if (!hasSession) {
    return {
      user: null,
      lineAuthenticated: false,
      phoneAuthenticated: false,
      lineIdToken: null,
      lineTokenExpiresAt: null,
    };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(GET_CURRENT_USER_SERVER_QUERY, {});

    const user: GqlUser | null = res.currentUser?.user ?? null;
    const hasPhoneIdentity = !!user?.identities?.some((i) => i.platform?.toUpperCase() === "PHONE");

    return {
      user,
      lineAuthenticated: true, // SSR時点でsessionがあればtrue扱い
      phoneAuthenticated: hasPhoneIdentity,
      lineIdToken,
      lineTokenExpiresAt,
    };
  } catch (error) {
    logger.warn("⚠️ Failed to fetch currentUser:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return {
      user: null,
      lineAuthenticated: true,
      phoneAuthenticated,
      lineIdToken,
      lineTokenExpiresAt,
    };
  }
}
