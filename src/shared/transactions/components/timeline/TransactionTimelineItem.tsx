"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TransactionTimelineItemProps {
  avatar: ReactNode;
  header: ReactNode;
  actionLabel: ReactNode;
  messageCard?: ReactNode;
  profileHref?: string | null;
}

export const TransactionTimelineItem = ({
  avatar,
  header,
  actionLabel,
  messageCard,
  profileHref,
}: TransactionTimelineItemProps) => {
  const content = (
    <div className="relative flex gap-3 pb-6 timeline-item">
      {/* Avatar - 疑似要素で縦線を描画 */}
      <div className="relative shrink-0 timeline-avatar">
        {avatar}
      </div>

      {/* Content エリア */}
      <div className="flex-1 min-w-0">
        {header}
        <div className="mt-1">
          {actionLabel}
        </div>
        {messageCard && (
          <div className="mt-2">
            {messageCard}
          </div>
        )}
      </div>
    </div>
  );

  if (profileHref) {
    return (
      <a
        href={profileHref}
        className={cn(
          "block cursor-pointer rounded-lg transition-colors",
          "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        )}
      >
        {content}
      </a>
    );
  }

  return content;
};
