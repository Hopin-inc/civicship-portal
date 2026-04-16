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
}

/**
 * トランザクション詳細画面で「このポイントの道のり」を縦タイムラインで表示する。
 *
 * 表示ルール:
 * - 2 人以下（直接送金）: 非表示（詳細ヘッダーで完結するため冗長）
 * - 3 人（発行者・経由 1 人・最終着地点）: 3 人そのまま縦に並べる
 * - 4 人以上: 先頭と末尾を表示し、間の経由者は「もっと見る (N人)」で展開
 */
export const TransactionChainTrail = ({ chain }: TransactionChainTrailProps) => {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations();

  const nodes = buildTrailNodes(chain);
  if (nodes.length < 3) return null;

  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];
  const middleNodes = nodes.slice(1, -1);
  const shouldCollapseMiddle = middleNodes.length >= 2 && !expanded;

  return (
    <div className="mt-8">
      <div className="mb-3">
        <span className="text-label-sm text-muted-foreground">
          {t("transactions.chain.journey")}
        </span>
      </div>

      <Card className="p-4">
        <ChainNodeItem node={firstNode} isFirst isLast={false} />

        {shouldCollapseMiddle ? (
          <ChainExpandRow
            count={middleNodes.length}
            onClick={() => setExpanded(true)}
          />
        ) : (
          middleNodes.map((node, idx) => (
            <ChainNodeItem
              key={`${node.id}-mid-${idx}`}
              node={node}
              isFirst={false}
              isLast={false}
            />
          ))
        )}

        <ChainNodeItem node={lastNode} isFirst={false} isLast />
      </Card>
    </div>
  );
};

/** chain.steps からユーザーの時系列列を作る（古い → 新しい）。 */
const buildTrailNodes = (chain: Chain | null | undefined): ChainUser[] => {
  if (!chain || chain.depth < 2 || chain.steps.length === 0) return [];

  return [
    chain.steps[0]?.fromUser,
    ...chain.steps.map((step) => step.toUser),
  ].filter((u): u is ChainUser => !!u);
};

interface ChainNodeItemProps {
  node: ChainUser;
  isFirst: boolean;
  isLast: boolean;
}

/** 縦タイムライン 1 行ぶん（アバター + 名前 + bio）。rail は `.timeline-avatar` に任せる。 */
const ChainNodeItem = ({ node, isFirst, isLast }: ChainNodeItemProps) => (
  <AppLink
    href={`/users/${node.id}`}
    className={cn(
      "relative flex gap-3 timeline-item",
      !isLast && "pb-10",
      "rounded-md -mx-1 px-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
    )}
  >
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
    <div className={cn("flex-1 min-w-0", node.bio ? "pt-0.5" : "self-center")}>
      <p className="text-sm font-semibold truncate">{node.name}</p>
      {node.bio && (
        <p className="mt-0.5 text-body-xs text-muted-foreground line-clamp-2 leading-snug">
          {node.bio}
        </p>
      )}
    </div>
  </AppLink>
);

interface ChainExpandRowProps {
  count: number;
  onClick: () => void;
}

/** 畳まれた中間ノード用のプレースホルダ行。rail だけ継続させてボタンを置く。 */
const ChainExpandRow = ({ count, onClick }: ChainExpandRowProps) => {
  const t = useTranslations();
  return (
    <div className="relative flex gap-3 pb-10 timeline-item">
      {/* アバター位置は空。rail（.timeline-avatar の疑似要素）だけ通す */}
      <div className="relative shrink-0 timeline-avatar w-10 h-10" />
      <div className="flex-1 min-w-0 pt-0.5">
        <Button
          variant="tertiary"
          size="sm"
          className="bg-white px-6"
          onClick={onClick}
        >
          <span className="text-label-sm font-bold">
            {t("transactions.chain.showMore", { count })}
          </span>
        </Button>
      </div>
    </div>
  );
};
