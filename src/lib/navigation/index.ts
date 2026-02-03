/**
 * Navigation Module
 *
 * パスベース・ルーティング（/community/[communityId]/...）のためのナビゲーション抽象化レイヤー
 *
 * ## 使用方法
 *
 * ### Client Components
 * ```tsx
 * import { AppLink, useAppRouter } from '@/lib/navigation';
 *
 * // Link の代わりに AppLink を使用
 * <AppLink href="/settings">設定</AppLink>
 *
 * // useRouter の代わりに useAppRouter を使用
 * const router = useAppRouter();
 * router.push('/settings');
 * ```
 *
 * ### Server Components / Server Actions
 * ```tsx
 * import { appRedirect, resolvePathServer } from '@/lib/navigation/server';
 *
 * // redirect の代わりに appRedirect を使用
 * await appRedirect('/login');
 *
 * // パスを解決するだけ
 * const resolvedPath = await resolvePathServer('/settings');
 * ```
 *
 * ## パス解決ルール
 *
 * - communityId がある場合: `/path` → `/community/{communityId}/path`
 * - 除外パス（/api/**）: 変換されない
 */

// Client-side components and hooks
export { AppLink } from "./AppLink";
export { useAppRouter } from "./useAppRouter";

// Path resolution utilities (can be used on both client and server)
export { resolvePath, getExcludedPathPatterns } from "./path-resolver";

// Note: Server-side utilities are exported from './server' to avoid
// importing server-only code in client bundles
// import { appRedirect, resolvePathServer } from '@/lib/navigation/server';
