"use client";

/**
 * AppLink - next/link のラッパーコンポーネント
 *
 * すべての内部リンクでこのコンポーネントを使用することで、
 * パスベースルーティングへの移行時にコード変更なしで対応可能
 */

import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";

import { getCommunityIdClient } from "@/lib/community";
import { resolvePath } from "./path-resolver";

type AppLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
  /**
   * パス解決をスキップする場合は true を指定
   * 外部リンクや特殊なケースで使用
   */
  skipPathResolution?: boolean;
  /**
   * 明示的に communityId を指定する場合
   * 指定しない場合は自動的に取得
   */
  communityId?: string | null;
};

/**
 * URLのパス名から communityId を抽出する
 * /community/{communityId}/... の形式にマッチ
 * SSR とクライアントで一貫した値が得られるため hydration mismatch を防ぐ
 */
function getCommunityIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/community\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * AppLink コンポーネント
 *
 * next/link の代替として使用し、パス解決を自動で行う
 *
 * @example
 * // 基本的な使用方法（推奨）
 * <AppLink href="/settings">設定</AppLink>
 *
 * // パス解決をスキップ（外部リンクや特殊なケース）
 * <AppLink href="https://example.com" skipPathResolution>外部リンク</AppLink>
 *
 * // 明示的に communityId を指定
 * <AppLink href="/settings" communityId="community-a">設定</AppLink>
 */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(
  function AppLink(
    {
      href,
      children,
      skipPathResolution = false,
      communityId: explicitCommunityId,
      ...props
    },
    ref
  ) {
    const pathname = usePathname();

    const resolvedHref = useMemo(() => {
      if (skipPathResolution) {
        return href;
      }

      // usePathname() は SSR とクライアントで同じ値を返すため hydration mismatch が起きない
      // getCommunityIdClient() (Cookie/Store) は SSR では null になるためフォールバックとして使用
      const communityId =
        explicitCommunityId ??
        getCommunityIdFromPathname(pathname) ??
        getCommunityIdClient();
      return resolvePath(href, communityId);
    }, [href, skipPathResolution, explicitCommunityId, pathname]);

    return (
      <Link ref={ref} href={resolvedHref} {...props}>
        {children}
      </Link>
    );
  }
);

export default AppLink;
