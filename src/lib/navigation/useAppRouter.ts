"use client";

/**
 * useAppRouter - next/navigation の useRouter ラッパー
 *
 * すべてのプログラム的なナビゲーションでこのフックを使用することで、
 * パスベースルーティングへの移行時にコード変更なしで対応可能
 */

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { getCommunityIdClient } from "@/lib/community";
import { resolvePath } from "./path-resolver";

interface AppRouterOptions {
  /**
   * パス解決をスキップする場合は true を指定
   */
  skipPathResolution?: boolean;
  /**
   * 明示的に communityId を指定する場合
   */
  communityId?: string | null;
}

interface AppRouter {
  /**
   * 指定したパスに遷移
   */
  push: (href: string, options?: NavigateOptions & AppRouterOptions) => void;
  /**
   * 現在の履歴エントリを置き換えて遷移
   */
  replace: (href: string, options?: NavigateOptions & AppRouterOptions) => void;
  /**
   * 履歴を一つ戻る
   */
  back: () => void;
  /**
   * 履歴を一つ進む
   */
  forward: () => void;
  /**
   * 現在のルートをリフレッシュ（Server Components の再レンダリング）
   */
  refresh: () => void;
  /**
   * 指定したパスをプリフェッチ
   */
  prefetch: (href: string, options?: AppRouterOptions) => void;
}

/**
 * useAppRouter フック
 *
 * next/navigation の useRouter の代替として使用し、
 * push/replace/prefetch でパス解決を自動で行う
 *
 * @example
 * const router = useAppRouter();
 *
 * // 基本的な使用方法
 * router.push('/settings');
 *
 * // パス解決をスキップ
 * router.push('/api/logout', { skipPathResolution: true });
 *
 * // 明示的に communityId を指定
 * router.push('/settings', { communityId: 'community-a' });
 */
export function useAppRouter(): AppRouter {
  const router = useRouter();

  const resolveHref = useCallback(
    (href: string, options?: AppRouterOptions): string => {
      if (options?.skipPathResolution) {
        return href;
      }
      const communityId = options?.communityId ?? getCommunityIdClient();
      return resolvePath(href, communityId);
    },
    []
  );

  const push = useCallback(
    (href: string, options?: NavigateOptions & AppRouterOptions) => {
      const { skipPathResolution, communityId, ...navigateOptions } =
        options ?? {};
      const resolvedHref = resolveHref(href, {
        skipPathResolution,
        communityId,
      });
      router.push(resolvedHref, navigateOptions);
    },
    [router, resolveHref]
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions & AppRouterOptions) => {
      const { skipPathResolution, communityId, ...navigateOptions } =
        options ?? {};
      const resolvedHref = resolveHref(href, {
        skipPathResolution,
        communityId,
      });
      router.replace(resolvedHref, navigateOptions);
    },
    [router, resolveHref]
  );

  const prefetch = useCallback(
    (href: string, options?: AppRouterOptions) => {
      const resolvedHref = resolveHref(href, options);
      router.prefetch(resolvedHref);
    },
    [router, resolveHref]
  );

  return useMemo(
    () => ({
      push,
      replace,
      back: router.back,
      forward: router.forward,
      refresh: router.refresh,
      prefetch,
    }),
    [push, replace, router.back, router.forward, router.refresh, prefetch]
  );
}
