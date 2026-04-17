"use client";

import { useTranslations } from "next-intl";
import { GqlRole } from "@/types/graphql";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import type { VoteDetailGate } from "../types/VoteDetailView";

interface VoteDetailGateSectionProps {
  gate: VoteDetailGate;
}

type Translator = ReturnType<typeof useTranslations>;

function roleLabel(role: GqlRole, t: Translator): string {
  switch (role) {
    case GqlRole.Owner:
      return t("adminVotes.form.gate.requiredRole.OWNER");
    case GqlRole.Manager:
      return t("adminVotes.form.gate.requiredRole.MANAGER");
    case GqlRole.Member:
    default:
      return t("adminVotes.form.gate.requiredRole.MEMBER");
  }
}

export function VoteDetailGateSection({ gate }: VoteDetailGateSectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-2">
      <span className="text-sm text-muted-foreground px-1">
        {t("adminVotes.detail.sections.gate")}
      </span>
      <ItemGroup className="border rounded-lg">
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              {gate.type === "membership"
                ? t("adminVotes.form.gate.type.MEMBERSHIP")
                : t("adminVotes.form.gate.type.NFT")}
            </ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item size="sm">
          <ItemContent>
            <span className="text-sm text-muted-foreground">
              {gate.type === "membership"
                ? `${t("adminVotes.form.gate.requiredRole.label")}: ${roleLabel(gate.requiredRole, t)}`
                : `NFT: ${gate.tokenName ?? "—"}`}
            </span>
          </ItemContent>
        </Item>
      </ItemGroup>
    </section>
  );
}
