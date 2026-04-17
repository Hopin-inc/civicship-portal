"use client";

import { useTranslations } from "next-intl";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import type { VoteDetailOption } from "../types/VoteDetailView";

interface VoteDetailOptionsSectionProps {
  options: VoteDetailOption[];
}

export function VoteDetailOptionsSection({
  options,
}: VoteDetailOptionsSectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-2">
      <span className="text-sm text-muted-foreground px-1">
        {t("adminVotes.detail.sections.options")}
      </span>
      <ItemGroup className="border rounded-lg">
        {options.map((option, idx) => (
          <div key={option.id}>
            {idx !== 0 && <ItemSeparator />}
            <Item size="sm">
              <ItemContent className="min-w-0 flex-1">
                <ItemTitle className="break-words">{option.label}</ItemTitle>
              </ItemContent>
              {option.voteCount != null && (
                <ItemActions>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {t("adminVotes.detail.optionVoteCount", {
                      count: option.voteCount,
                    })}
                    {option.totalPower != null &&
                      option.totalPower !== option.voteCount && (
                        <>
                          {" / "}
                          {t("adminVotes.detail.optionTotalPower", {
                            power: option.totalPower,
                          })}
                        </>
                      )}
                  </span>
                </ItemActions>
              )}
            </Item>
          </div>
        ))}
      </ItemGroup>
    </section>
  );
}
