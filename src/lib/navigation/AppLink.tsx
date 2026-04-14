"use client";

/**
 * AppLink - next/link のラッパーコンポーネント
 *
 * すべての内部リンクでこのコンポーネントを使用することで、
 * パスベースルーティングへの移行時にコード変更なしで対応可能
 */

import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode, useMemo } from "react";

import { useCommunityConfigOptional } from "@/contexts/CommunityConfigContext";
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
    // Context から取得した communityId は SSR と hydration の両方で一貫している。
    // getCommunityIdClient() は typeof window !== "undefined" チェックを持つため、
    // SSR では null を返すが hydration 時には cookie から値を読むため不一致が生じる。
    const communityConfig = useCommunityConfigOptional();

    const resolvedHref = useMemo(() => {
      if (skipPathResolution) {
        return href;
      }

      const communityId = explicitCommunityId ?? communityConfig?.communityId ?? null;
      return resolvePath(href, communityId);
    }, [href, skipPathResolution, explicitCommunityId, communityConfig?.communityId]);

    return (
      <Link ref={ref} href={resolvedHref} {...props}>
        {children}
      </Link>
    );
  }
);

export default AppLink;
