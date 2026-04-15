"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
 * トランザクション詳細画面で「このポイントが誰から誰へ渡ってきたか」を
 * 最小限の横並び UI で可視化する。
 *
 * steps は古い→新しい順に並んでいる想定で、
 * 先頭 step の fromUser から各 step の toUser を繋いで 1 列の連鎖として表示する。
 * depth が 1（単発）のときは何も表示しない。
 */
export const TransactionChainTrail = ({ chain }: TransactionChainTrailProps) => {
  const t = useTranslations();

  if (!chain || chain.depth < 2 || chain.steps.length === 0) {
    return null;
  }

  // 先頭 step の fromUser を起点に、各 step の toUser を繋ぐ
  const nodes: ChainUser[] = [];
  const firstFrom = chain.steps[0]?.fromUser;
  if (firstFrom) nodes.push(firstFrom);
  for (const step of chain.steps) {
    if (step.toUser) nodes.push(step.toUser);
  }

  if (nodes.length < 2) return null;

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-label-sm text-muted-foreground">
          {t("transactions.chain.journey")}
        </span>
        <span className="text-label-xs text-muted-foreground">
          {t("transactions.chain.stepsSummary", { count: chain.depth })}
        </span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-muted-foreground/15 px-3 py-2">
        {nodes.map((node, idx) => (
          <div key={`${node.id}-${idx}`} className="flex items-center gap-1 shrink-0">
            <AppLink
              href={`/users/${node.id}`}
              className="flex flex-col items-center gap-1 max-w-[56px]"
            >
              <Avatar className="h-7 w-7 border">
                <AvatarImage src={node.image ?? ""} alt={node.name} />
                <AvatarFallback className="text-[10px]">
                  {node.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-muted-foreground truncate max-w-[56px] text-center">
                {node.name}
              </span>
            </AppLink>
            {idx < nodes.length - 1 && (
              <ChevronRight
                className="w-3 h-3 text-muted-foreground/60 shrink-0"
                strokeWidth={2}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
