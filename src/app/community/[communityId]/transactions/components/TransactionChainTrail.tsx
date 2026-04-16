"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLink } from "@/lib/navigation";
import { GqlGetTransactionDetailQuery } from "@/types/graphql";

type Chain = NonNullable<NonNullable<GqlGetTransactionDetailQuery["transaction"]>["chain"]>;
type Step = Chain["steps"][number];
type ChainUser = NonNullable<Step["fromUser"] | Step["toUser"]>;

interface TransactionChainTrailProps {
  chain: Chain;
}

/**
 * トランザクション詳細画面で「このポイントが誰から誰へ渡ってきたか」を縦タイムラインで表示する。
 *
 * steps は古い→新しい順に並んでいる想定で、
 * 先頭 step の fromUser から各 step の toUser を繋いで 1 列の連鎖として表示する。
 * 縦線は transactions 側の `.timeline-avatar` と同じスタイルを流用。
 * depth < 2 のときは何も表示しない。
 */
export const TransactionChainTrail = ({ chain }: TransactionChainTrailProps) => {
  const t = useTranslations();

  if (!chain || chain.depth < 2 || chain.steps.length === 0) {
    return null;
  }

  const nodes: ChainUser[] = [];
  const firstFrom = chain.steps[0]?.fromUser;
  if (firstFrom) nodes.push(firstFrom);
  for (const step of chain.steps) {
    if (step.toUser) nodes.push(step.toUser);
  }

  if (nodes.length < 2) return null;

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

      <div>
        {nodes.map((node, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === nodes.length - 1;
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
      </div>
    </div>
  );
};
