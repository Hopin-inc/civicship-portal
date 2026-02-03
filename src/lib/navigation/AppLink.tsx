"use client";

/**
 * AppLink - next/link のラッパーコンポーネント
 *
 * すべての内部リンクでこのコンポーネントを使用することで、
 * パスベースルーティングへの移行時にコード変更なしで対応可能
 */

import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode, useMemo } from "react";

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
    const resolvedHref = useMemo(() => {
      if (skipPathResolution) {
        return href;
      }

      const communityId = explicitCommunityId ?? getCommunityIdClient();
      return resolvePath(href, communityId);
    }, [href, skipPathResolution, explicitCommunityId]);

    return (
      <Link ref={ref} href={resolvedHref} {...props}>
        {children}
      </Link>
    );
  }
);

export default AppLink;
