"use client";

import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import { getCommunityIdClient } from "@/lib/community/get-community-id-client";

/** トークン期限切れ判定の猶予（5分前からリフレッシュ対象） */
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

/** 同時リフレッシュ呼び出しを1本に束ねるための Promise */
let refreshPromise: Promise<string | null> | null = null;

/**
 * exchange 経由で取得した lineTokens.idToken の有効性を確認し、
 * 期限切れまたは5分以内に失効する場合は自動的にリフレッシュして返す。
 *
 * - firebaseUser が存在するパスでは Firebase SDK の getIdToken() が自動リフレッシュ
 *   するためこの関数を使わない。
 * - 複数のリクエストが同時に期限切れを検知した場合でもリフレッシュ呼び出しは
 *   1回だけ実行される（Promise の共有）。
 */
export async function getValidLineIdToken(): Promise<string | null> {
  const { lineTokens } = useAuthStore.getState().state;

  if (!lineTokens.idToken) return null;

  // expiresAt がない場合は期限情報なし → 有効とみなしてそのまま返す
  if (!lineTokens.expiresAt) {
    return lineTokens.idToken;
  }

  // 有効期限あり → 残り時間を確認
  const expiresAt = Number(lineTokens.expiresAt);
  if (expiresAt - Date.now() > REFRESH_THRESHOLD_MS) {
    return lineTokens.idToken;
  }

  // refreshToken がない場合はそのまま返して API 側に判断を委ねる
  if (!lineTokens.refreshToken) {
    logger.warn("[TokenRefresher] Token near expiry but no refreshToken available", {
      component: "TokenRefresher",
    });
    return lineTokens.idToken;
  }

  // 同時呼び出しを1本に束ねる
  if (!refreshPromise) {
    refreshPromise = doRefresh(lineTokens.refreshToken).finally(() => {
      refreshPromise = null;
    });
  }

  // リフレッシュ失敗（null）の場合は既存トークンにフォールバックする。
  // null を返すと Apollo requestLink の mutation pre-check（idToken が truthy）を
  // 通過した後に Authorization ヘッダなしでリクエストが送られてしまい、
  // サーバーが匿名扱いにして auth:token-expired が発火しない状態になるため。
  const refreshed = await refreshPromise;
  return refreshed ?? lineTokens.idToken;
}

async function doRefresh(refreshToken: string): Promise<string | null> {
  try {
    const communityId = getCommunityIdClient();

    logger.info("[TokenRefresher] Refreshing expired exchange token", {
      component: "TokenRefresher",
    });

    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(communityId ? { "x-community-id": communityId } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      logger.error("[TokenRefresher] Refresh request failed", {
        status: res.status,
        component: "TokenRefresher",
      });
      return null;
    }

    const { idToken, refreshToken: newRefreshToken, expiresAt } = await res.json();

    useAuthStore.getState().setState({
      lineTokens: {
        idToken,
        // API がリフレッシュトークンを返さないケースに備えて既存トークンを維持する
        refreshToken: newRefreshToken || refreshToken,
        expiresAt,
      },
    });

    logger.info("[TokenRefresher] Token refreshed successfully", {
      component: "TokenRefresher",
    });

    return idToken;
  } catch (error) {
    logger.error("[TokenRefresher] Unexpected error during refresh", {
      error: error instanceof Error ? error.message : String(error),
      component: "TokenRefresher",
    });
    return null;
  }
}
