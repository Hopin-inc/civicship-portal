"use client";

import { useTranslations } from "next-intl";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { VoteTallyList } from "@/shared/vote/components/VoteTallyList";
import type { VoteDetailOption } from "../types/VoteDetailView";

interface VoteDetailOptionsSectionProps {
  options: VoteDetailOption[];
}

export function VoteDetailOptionsSection({
  options,
}: VoteDetailOptionsSectionProps) {
  const t = useTranslations();
  const hasVoteData = options.some((o) => o.voteCount != null);
  const usePower = options.some(
    (o) => o.totalPower != null && o.voteCount != null && o.totalPower !== o.voteCount,
  );

  return (
    <section className="space-y-2">
      <span className="text-sm text-muted-foreground px-1">
        {t("adminVotes.detail.sections.options")}
      </span>

      {hasVoteData ? (
        <VoteTallyList options={options} usePower={usePower} />
      ) : (
        <ItemGroup className="border rounded-lg">
          {options.map((option, idx) => (
            <div key={option.id}>
              {idx !== 0 && <ItemSeparator />}
              <Item size="sm">
                <ItemContent className="min-w-0 flex-1">
                  <ItemTitle className="break-words">{option.label}</ItemTitle>
                </ItemContent>
              </Item>
            </div>
          ))}
        </ItemGroup>
      )}
    </section>
  );
}
