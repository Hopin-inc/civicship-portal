/**
 * Server-side Navigation Utilities
 *
 * Server Components / Server Actions / Route Handlers で使用する
 * パス解決およびリダイレクトユーティリティ
 *
 * 注意: このファイルは "use server" ディレクティブを含まないため、
 * Server Components や Route Handlers で直接インポートして使用可能
 */

import { redirect, RedirectType } from "next/navigation";

import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { resolvePath } from "./path-resolver";

interface AppRedirectOptions {
  /**
   * パス解決をスキップする場合は true を指定
   */
  skipPathResolution?: boolean;
  /**
   * 明示的に communityId を指定する場合
   */
  communityId?: string | null;
  /**
   * リダイレクトのタイプ
   */
  type?: RedirectType;
}

/**
 * Server-side パス解決
 *
 * Server Components / Server Actions で使用するパス解決関数
 * headers() から communityId を自動取得する
 *
 * @param path - 解決するパス
 * @param options - オプション
 * @returns 解決されたパス
 *
 * @example
 * // Server Component で使用
 * const settingsPath = await resolvePathServer('/settings');
 *
 * // 明示的に communityId を指定
 * const settingsPath = await resolvePathServer('/settings', { communityId: 'community-a' });
 */
export async function resolvePathServer(
  path: string,
  options?: Pick<AppRedirectOptions, "skipPathResolution" | "communityId">
): Promise<string> {
  if (options?.skipPathResolution) {
    return path;
  }

  const communityId =
    options?.communityId ?? (await getCommunityIdFromHeader());
  return resolvePath(path, communityId);
}

/**
 * Server-side リダイレクト（パス解決付き）
 *
 * Server Components / Server Actions で使用するリダイレクト関数
 * パスを自動的に解決してからリダイレクトする
 *
 * @param path - リダイレクト先のパス
 * @param options - オプション
 *
 * @example
 * // Server Component で使用
 * await appRedirect('/login');
 *
 * // パス解決をスキップ
 * await appRedirect('/api/logout', { skipPathResolution: true });
 *
 * // replace タイプで リダイレクト
 * await appRedirect('/dashboard', { type: RedirectType.replace });
 */
export async function appRedirect(
  path: string,
  options?: AppRedirectOptions
): Promise<never> {
  const resolvedPath = await resolvePathServer(path, {
    skipPathResolution: options?.skipPathResolution,
    communityId: options?.communityId,
  });

  return redirect(resolvedPath, options?.type);
}

/**
 * Server-side リダイレクト（パス解決付き、同期版）
 *
 * communityId を明示的に渡す場合に使用する同期版
 * headers() を呼び出さないため、非同期コンテキスト外でも使用可能
 *
 * @param path - リダイレクト先のパス
 * @param communityId - コミュニティID
 * @param type - リダイレクトのタイプ
 *
 * @example
 * // communityId を既に取得している場合
 * appRedirectSync('/dashboard', communityId);
 */
export function appRedirectSync(
  path: string,
  communityId: string | null,
  type?: RedirectType
): never {
  const resolvedPath = resolvePath(path, communityId);
  return redirect(resolvedPath, type);
}
