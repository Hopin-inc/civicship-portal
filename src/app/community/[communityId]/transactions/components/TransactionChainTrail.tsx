"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLink } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GqlGetTransactionDetailQuery } from "@/types/graphql";

type Chain = NonNullable<NonNullable<GqlGetTransactionDetailQuery["transaction"]>["chain"]>;
type Step = Chain["steps"][number];
type ChainUser = NonNullable<Step["fromUser"] | Step["toUser"]>;

interface TransactionChainTrailProps {
  chain: Chain;
  /** 表示から除外するユーザー ID（詳細ページの from/to と重複させないため） */
  excludeUserIds?: (string | null | undefined)[];
}

const DEFAULT_VISIBLE = 3;

/**
 * トランザクション詳細画面で「このポイントがどこから来たか」を縦タイムラインで表示する。
 *
 * - chain.steps の fromUser/toUser を連結して 1 列のユーザー列を作る
 * - 詳細ページ上部に出ている「送信者・受信者」は重複するので除外
 * - 新しい順（直近の経由者 → 発行者）で並べる
 * - デフォルト 3 件、残りは「もっと見る」で展開
 * - depth < 2 / 残ノード 0 件のときは何も表示しない
 */
export const TransactionChainTrail = ({
  chain,
  excludeUserIds = [],
}: TransactionChainTrailProps) => {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  const nodes = useMemo<ChainUser[]>(() => {
    if (!chain || chain.depth < 2 || chain.steps.length === 0) return [];

    // 古い順: [s1.fromUser, s1.toUser, s2.toUser, ..., sN.toUser]
    const chronological: ChainUser[] = [];
    const firstFrom = chain.steps[0]?.fromUser;
    if (firstFrom) chronological.push(firstFrom);
    for (const step of chain.steps) {
      if (step.toUser) chronological.push(step.toUser);
    }

    const excludeSet = new Set(excludeUserIds.filter((v): v is string => !!v));
    const filtered = chronological.filter((u) => !excludeSet.has(u.id));

    // 新しい順（直近 → 発行者）
    return filtered.reverse();
  }, [chain, excludeUserIds]);

  if (nodes.length === 0) return null;

  const visibleNodes = expanded ? nodes : nodes.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = Math.max(nodes.length - DEFAULT_VISIBLE, 0);

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-label-sm text-muted-foreground">
          {t("transactions.chain.journey")}
        </span>
        <span className="text-label-xs text-muted-foreground">
          {t("transactions.chain.stepsSummary", { count: chain.depth })}
        </span>
      </div>

      <Card className="p-4">
        {visibleNodes.map((node, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === visibleNodes.length - 1;
          return (
            <div
              key={`${node.id}-${idx}`}
              className={cn("relative flex gap-3 timeline-item", !isLast && "pb-10")}
            >
              <div
                className={cn(
                  "relative shrink-0 timeline-avatar",
                  isFirst && "timeline-avatar-first",
                  isLast && "timeline-avatar-last",
                )}
              >
                <Avatar className="h-12 w-12 shrink-0 border">
                  <AvatarImage src={node.image ?? ""} alt={node.name} />
                  <AvatarFallback>
                    {node.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <AppLink href={`/users/${node.id}`} className="flex-1 min-w-0 pt-1">
                <p className="text-sm font-semibold truncate">{node.name}</p>
                {node.bio && (
                  <p className="mt-0.5 text-body-xs text-muted-foreground line-clamp-2 leading-snug">
                    {node.bio}
                  </p>
                )}
              </AppLink>
            </div>
          );
        })}

        {!expanded && hiddenCount > 0 && (
          <div className="flex justify-center pt-2">
            <Button
              variant="tertiary"
              size="sm"
              className="bg-white px-6"
              onClick={() => setExpanded(true)}
            >
              <span className="text-label-sm font-bold">
                {t("transactions.chain.showMore", { count: hiddenCount })}
              </span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
