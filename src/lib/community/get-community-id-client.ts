"use client";

import { useCommunityStore } from "./community-store";
import { logger } from "@/lib/logging";

/**
 * Client Side 用
 * Zustand store から取得、なければ Cookie からフォールバック
 */
export function getCommunityIdClient(): string | null {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    logger.warn("[getCommunityIdClient] Called on server side - returning null", {
      component: "getCommunityIdClient",
    });
    return null;
  }

  // 1. Zustand store から取得
  const storeId = useCommunityStore.getState().state.communityId;
  if (storeId) {
    logger.debug("[getCommunityIdClient] Got from store", {
      communityId: storeId,
      source: "store",
      component: "getCommunityIdClient",
    });
    return storeId;
  }

  // 2. Cookie からフォールバック
  const cookieId = parseCookieValue("x-community-id");
  if (cookieId) {
    logger.debug("[getCommunityIdClient] Got from cookie (fallback)", {
      communityId: cookieId,
      source: "cookie",
      component: "getCommunityIdClient",
    });
    // Store にも保存
    useCommunityStore.getState().setCommunityId(cookieId, "cookie");
    return cookieId;
  }

  logger.warn("[getCommunityIdClient] No communityId available", {
    storeState: useCommunityStore.getState().state,
    hasCookies: typeof document !== "undefined" ? document.cookie.length > 0 : false,
    component: "getCommunityIdClient",
  });

  return null;
}

/**
 * Cookie から値をパースするユーティリティ
 * ブラウザによって "; " または ";" で区切られる可能性があるため、正規表現で対応
 */
function parseCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  // 大文字小文字を区別しない正規表現でCookieを検索
  const regex = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`, "i");
  const match = document.cookie.match(regex);
  if (!match) return null;

  return decodeURIComponent(match[1]) || null;
}
