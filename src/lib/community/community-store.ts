import { create } from "zustand";
import { logger } from "@/lib/logging";

/**
 * Community ID の状態を管理する Zustand Store
 *
 * Source of Truth の優先順位:
 * 1. SSR: CommunityConfigProvider から初期化
 * 2. Cookie: Store が未初期化の場合のフォールバック
 */

interface CommunityState {
  communityId: string | null;
  initializedAt: number | null;
  source: "ssr" | "cookie" | null;
}

interface CommunityStore {
  state: CommunityState;
  setCommunityId: (id: string, source: "ssr" | "cookie") => void;
  getCommunityId: () => string | null;
  reset: () => void;
}

const initialState: CommunityState = {
  communityId: null,
  initializedAt: null,
  source: null,
};

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  state: initialState,

  setCommunityId: (id: string, source: "ssr" | "cookie") => {
    const prev = get().state;

    // 既に同じ値で初期化済みの場合はスキップ
    if (prev.communityId === id && prev.source === source) {
      logger.debug("[CommunityStore] setCommunityId skipped (same value)", {
        communityId: id,
        source,
        component: "CommunityStore",
      });
      return;
    }

    logger.debug("[CommunityStore] setCommunityId", {
      prev: prev.communityId,
      next: id,
      prevSource: prev.source,
      nextSource: source,
      component: "CommunityStore",
    });

    set({
      state: {
        communityId: id,
        initializedAt: Date.now(),
        source,
      },
    });
  },

  getCommunityId: () => {
    const { communityId, source, initializedAt } = get().state;

    logger.debug("[CommunityStore] getCommunityId", {
      communityId,
      source,
      initializedAt,
      component: "CommunityStore",
    });

    return communityId;
  },

  reset: () => {
    logger.debug("[CommunityStore] reset", {
      prev: get().state,
      component: "CommunityStore",
    });

    set({ state: initialState });
  },
}));
