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
      {/* Timeline Rail - アイテム全体に対してabsolute配置 */}
      <div className="absolute left-0 top-0 bottom-0 flex items-start justify-center w-12">
        {/* 上側の線 */}
        <div className="absolute top-0 h-6 w-0.5 bg-red-500 timeline-rail-top" />
        {/* 下側の線 */}
        <div className="absolute top-6 bottom-0 w-0.5 bg-red-500 timeline-rail-bottom" />
      </div>

      {/* Avatar */}
      <div className="relative z-10 shrink-0">
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
