"use client";

import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface PowerPolicySectionProps {
  nftTokens: NftTokenOption[];
}

export function PowerPolicySection({ nftTokens }: PowerPolicySectionProps) {
  const t = useTranslations();
  const { setValue, watch } = useFormContext<VoteTopicFormValues>();
  const gate = watch("gate");
  const powerPolicy = watch("powerPolicy");

  const gateIsNft = gate.type === GqlVoteGateType.Nft;

  /**
   * gate 依存の整合:
   * - gate=MEMBERSHIP のとき powerPolicy を NFT_COUNT のままにしない（FLAT に戻す）
   * - gate=NFT のとき powerPolicy.nftTokenId を gate.nftTokenId に追従
   */
  useEffect(() => {
    if (powerPolicy.type !== GqlVotePowerPolicyType.NftCount) return;
    if (gate.type !== GqlVoteGateType.Nft) {
      setValue(
        "powerPolicy",
        { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
        { shouldDirty: true, shouldValidate: true },
      );
      return;
    }
    if (!gate.nftTokenId) return;
    if (gate.nftTokenId === powerPolicy.nftTokenId) return;
    setValue(
      "powerPolicy",
      { type: GqlVotePowerPolicyType.NftCount, nftTokenId: gate.nftTokenId },
      { shouldDirty: true, shouldValidate: true },
    );
  }, [gate, powerPolicy, setValue]);

  const gateNftToken = useMemo(
    () =>
      gate.type === GqlVoteGateType.Nft
        ? (nftTokens.find((n) => n.id === gate.nftTokenId) ?? null)
        : null,
    [gate, nftTokens],
  );

  const setFlat = () =>
    setValue(
      "powerPolicy",
      { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
      { shouldDirty: true, shouldValidate: true },
    );

  const setNftCount = () => {
    if (gate.type !== GqlVoteGateType.Nft) return;
    setValue(
      "powerPolicy",
      { type: GqlVotePowerPolicyType.NftCount, nftTokenId: gate.nftTokenId ?? "" },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleTypeChange = (next: GqlVotePowerPolicyType) => {
    if (next === powerPolicy.type) return;
    if (next === GqlVotePowerPolicyType.Flat) {
      setFlat();
    } else {
      setNftCount();
    }
  };

  const typeDescription =
    powerPolicy.type === GqlVotePowerPolicyType.NftCount
      ? t("adminVotes.form.powerPolicy.type.description.NFT_COUNT")
      : t("adminVotes.form.powerPolicy.type.description.FLAT");

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">
          {t("adminVotes.form.powerPolicy.label")}
        </span>
        <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
          必須
        </span>
      </div>

      <ItemGroup className="border rounded-lg">
        <Item size="sm">
          <ItemContent className="space-y-2">
            <ToggleGroup
              type="single"
              value={powerPolicy.type}
              onValueChange={(v) => {
                if (
                  v === GqlVotePowerPolicyType.Flat ||
                  v === GqlVotePowerPolicyType.NftCount
                ) {
                  handleTypeChange(v);
                }
              }}
              variant="outline"
              className="grid grid-cols-2 w-full gap-2"
            >
              <ToggleGroupItem
                value={GqlVotePowerPolicyType.Flat}
                className="h-auto min-h-10 whitespace-pre-line text-center leading-tight"
              >
                {t("adminVotes.form.powerPolicy.type.FLAT")}
              </ToggleGroupItem>
              <ToggleGroupItem
                value={GqlVotePowerPolicyType.NftCount}
                disabled={!gateIsNft}
                className="h-auto min-h-10 whitespace-pre-line text-center leading-tight"
              >
                {t("adminVotes.form.powerPolicy.type.NFT_COUNT")}
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              {gateIsNft
                ? typeDescription
                : t("adminVotes.form.powerPolicy.type.requiresNftGate")}
            </p>
          </ItemContent>
        </Item>

        {powerPolicy.type === GqlVotePowerPolicyType.NftCount && gateIsNft && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent className="space-y-2 min-w-0">
                <ItemTitle>
                  {t("adminVotes.form.powerPolicy.nftToken.label")}
                </ItemTitle>
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm truncate">
                  {gateNftToken
                    ? (gateNftToken.name ?? gateNftToken.address)
                    : t("adminVotes.form.gate.summary.nftUnselected")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("adminVotes.form.powerPolicy.nftToken.syncedFromGate")}
                </p>
              </ItemContent>
            </Item>
          </>
        )}
      </ItemGroup>
    </section>
  );
}
