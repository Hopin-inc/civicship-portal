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
      {/* Timeline Rail - 縦線 + Avatar */}
      <div className="relative flex flex-col items-center self-stretch">
        {/* 上側の線 - アイテム上端からAvatar中心（50%）まで */}
        <div className="absolute left-1/2 top-0 bottom-1/2 w-px -translate-x-1/2 bg-muted-foreground/30 timeline-rail-top" />

        {/* Avatar（z-indexで線の上に表示） */}
        <div className="relative z-10">
          {avatar}
        </div>

        {/* 下側の線 - Avatar中心（50%）からアイテム下端まで */}
        <div className="absolute left-1/2 top-1/2 bottom-0 w-px -translate-x-1/2 bg-muted-foreground/30 timeline-rail-bottom" />
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
