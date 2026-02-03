/**
 * Navigation Module
 *
 * パスベースルーティングへの移行をサポートするナビゲーション抽象化レイヤー
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
 * ## 移行戦略
 *
 * 1. PR 1.5（現在）: このモジュールを導入し、全てのナビゲーションをラップ
 *    - `NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING=false`（デフォルト）
 *    - パスは変換されない（既存の動作を維持）
 *
 * 2. PR 2.0: フラグを有効化してパスベースルーティングに移行
 *    - `NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING=true`
 *    - パスが自動的に `/community/{communityId}/...` 形式に変換される
 */

// Client-side components and hooks
export { AppLink, default as Link } from "./AppLink";
export { useAppRouter } from "./useAppRouter";

// Path resolution utilities (can be used on both client and server)
export {
  resolvePath,
  isPathBasedModeEnabled,
  getExcludedPathPatterns,
} from "./path-resolver";

// Note: Server-side utilities are exported from './server' to avoid
// importing server-only code in client bundles
// import { appRedirect, resolvePathServer } from '@/lib/navigation/server';
