"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TransactionTimelineItemProps {
  avatar: ReactNode;
  header: ReactNode;
  actionLabel: ReactNode;
  messageCard?: ReactNode;
  href?: string | null;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * タイムライン形式のトランザクションアイテム
 *
 * 構成:
 * - Avatar: ユーザーアイコン（疑似要素で縦線を描画）
 * - Header: 名前と日時
 * - ActionLabel: アクション情報（矢印/符号 + 名前 + ポイント）
 * - MessageCard: メッセージ（オプション）
 *
 * リンクが指定された場合、Header + ActionLabel のみを `<a>` でラップする。
 * MessageCard は `<button>` 等のインタラクティブ要素を含む可能性があるため、
 * HTML 仕様上の「リンク内にインタラクティブ要素」を避けるために `<a>` の外に配置する。
 */
export const TransactionTimelineItem = ({
  avatar,
  header,
  actionLabel,
  messageCard,
  href,
  isFirst = false,
  isLast = false,
}: TransactionTimelineItemProps) => {
  const avatarClasses = cn(
    "relative shrink-0 timeline-avatar",
    isFirst && "timeline-avatar-first",
    isLast && "timeline-avatar-last",
  );

  if (href) {
    // Render <a> around only the non-interactive content (header + actionLabel).
    // messageCard may contain <button> elements (e.g. image grid), so it must
    // sit outside the <a> to avoid invalid nested interactive elements.
    return (
      <div className="relative flex gap-3 pb-10 timeline-item">
        <div className={avatarClasses}>{avatar}</div>
        <div className="flex-1 min-w-0">
          <a
            href={href}
            className={cn(
              "block cursor-pointer rounded-lg transition-colors",
              "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
            )}
          >
            {header}
            <div className="mt-1">{actionLabel}</div>
          </a>
          {messageCard && <div className="mt-2">{messageCard}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-3 pb-10 timeline-item">
      <div className={avatarClasses}>{avatar}</div>
      <div className="flex-1 min-w-0">
        {header}
        <div className="mt-1">{actionLabel}</div>
        {messageCard && <div className="mt-2">{messageCard}</div>}
      </div>
    </div>
  );
};
