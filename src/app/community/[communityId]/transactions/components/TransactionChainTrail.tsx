"use client";

import { useState } from "react";
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
  chain?: Chain | null;
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
 * - chain が null / depth < 2 / 残ノード 0 件のときは何も表示しない
 */
export const TransactionChainTrail = ({
  chain,
  excludeUserIds = [],
}: TransactionChainTrailProps) => {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  // chain は最大 10 ステップに制限されているため memoize せず素直に計算。
  const nodes = buildTrailNodes(chain, excludeUserIds);

  if (!chain || nodes.length === 0) return null;

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
        {visibleNodes.map((node, idx) => (
          <ChainNodeItem
            key={`${node.id}-${idx}`}
            node={node}
            isFirst={idx === 0}
            isLast={idx === visibleNodes.length - 1}
          />
        ))}

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

/** chain.steps からユーザーの縦列を組み立てる（除外 + 新しい順）。 */
const buildTrailNodes = (
  chain: Chain | null | undefined,
  excludeUserIds: (string | null | undefined)[],
): ChainUser[] => {
  if (!chain || chain.depth < 2 || chain.steps.length === 0) return [];

  // 古い順: [s1.fromUser, s1.toUser, s2.toUser, ..., sN.toUser]
  const chronological: ChainUser[] = [
    chain.steps[0]?.fromUser,
    ...chain.steps.map((step) => step.toUser),
  ].filter((u): u is ChainUser => !!u);

  const excludeSet = new Set(excludeUserIds.filter((v): v is string => !!v));
  return chronological.filter((u) => !excludeSet.has(u.id)).reverse();
};

interface ChainNodeItemProps {
  node: ChainUser;
  isFirst: boolean;
  isLast: boolean;
}

/** 縦タイムライン 1 行ぶん（アバター + 名前 + bio）。rail は `.timeline-avatar` に任せる。 */
const ChainNodeItem = ({ node, isFirst, isLast }: ChainNodeItemProps) => (
  <div className={cn("relative flex gap-3 timeline-item", !isLast && "pb-10")}>
    <div
      className={cn(
        "relative shrink-0 timeline-avatar",
        isFirst && "timeline-avatar-first",
        isLast && "timeline-avatar-last",
      )}
    >
      <Avatar className="h-10 w-10 shrink-0 border">
        <AvatarImage src={node.image ?? ""} alt={node.name} />
        <AvatarFallback>{node.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
      </Avatar>
    </div>
    <AppLink href={`/users/${node.id}`} className="flex-1 min-w-0 pt-0.5">
      <p className="text-sm font-semibold truncate">{node.name}</p>
      {node.bio && (
        <p className="mt-0.5 text-body-xs text-muted-foreground line-clamp-2 leading-snug">
          {node.bio}
        </p>
      )}
    </AppLink>
  </div>
);
