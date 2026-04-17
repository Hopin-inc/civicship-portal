"use client";

import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GqlRole,
  GqlVoteGateType,
  GqlVotePowerPolicyType,
} from "@/types/graphql";
import { VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface VotingRulesSectionProps {
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function VotingRulesSection({
  nftTokens,
  nftTokensLoading,
}: VotingRulesSectionProps) {
  const t = useTranslations();
  const { setValue, watch, formState } = useFormContext<VoteTopicFormValues>();
  const gate = watch("gate");
  const powerPolicy = watch("powerPolicy");

  const gateIsNft = gate.type === GqlVoteGateType.Nft;

  const nftTokenIdError =
    formState.errors.gate &&
    (formState.errors.gate as { nftTokenId?: { message?: string } }).nftTokenId
      ?.message;

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

  const setMembership = (requiredRole: GqlRole) => {
    setValue(
      "gate",
      { type: GqlVoteGateType.Membership, requiredRole, nftTokenId: null },
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      "powerPolicy",
      { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const setNft = (nftTokenId: string) =>
    setValue(
      "gate",
      { type: GqlVoteGateType.Nft, requiredRole: null, nftTokenId },
      { shouldDirty: true, shouldValidate: true },
    );

  const handleGateTypeChange = (next: GqlVoteGateType) => {
    if (next === gate.type) return;
    if (next === GqlVoteGateType.Membership) {
      setMembership(GqlRole.Member);
    } else {
      setNft("");
    }
  };

  const handlePowerPolicyChange = (next: GqlVotePowerPolicyType) => {
    if (next === powerPolicy.type) return;
    if (next === GqlVotePowerPolicyType.Flat) {
      setValue(
        "powerPolicy",
        { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
        { shouldDirty: true, shouldValidate: true },
      );
    } else if (gate.type === GqlVoteGateType.Nft) {
      setValue(
        "powerPolicy",
        {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: gate.nftTokenId ?? "",
        },
        { shouldDirty: true, shouldValidate: true },
      );
    }
  };

  const gateDescription =
    gate.type === GqlVoteGateType.Nft
      ? t("adminVotes.form.gate.type.description.NFT")
      : t("adminVotes.form.gate.type.description.MEMBERSHIP");

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">
          {t("adminVotes.form.votingRules.label")}
        </span>
        <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
          必須
        </span>
      </div>

      <ItemGroup className="border rounded-lg">
        {/* 投票資格タイプ */}
        <Item size="sm">
          <ItemContent className="space-y-2">
            <ToggleGroup
              type="single"
              value={gate.type}
              onValueChange={(v) => {
                if (
                  v === GqlVoteGateType.Nft ||
                  v === GqlVoteGateType.Membership
                ) {
                  handleGateTypeChange(v);
                }
              }}
              variant="outline"
              className="grid grid-cols-2 w-full gap-2"
            >
              <ToggleGroupItem
                value={GqlVoteGateType.Membership}
                className="h-auto min-h-10 whitespace-pre-line text-center leading-tight"
              >
                {t("adminVotes.form.gate.type.MEMBERSHIP")}
              </ToggleGroupItem>
              <ToggleGroupItem
                value={GqlVoteGateType.Nft}
                className="h-auto min-h-10 whitespace-pre-line text-center leading-tight"
              >
                {t("adminVotes.form.gate.type.NFT")}
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">{gateDescription}</p>
          </ItemContent>
        </Item>

        {/* MEMBERSHIP: 最低権限 */}
        {gate.type === GqlVoteGateType.Membership && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent>
                <ItemTitle>
                  {t("adminVotes.form.gate.requiredRole.label")}
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <Select
                  value={gate.requiredRole}
                  onValueChange={(v) => setMembership(v as GqlRole)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GqlRole.Member}>
                      {t("adminVotes.form.gate.requiredRole.MEMBER")}
                    </SelectItem>
                    <SelectItem value={GqlRole.Manager}>
                      {t("adminVotes.form.gate.requiredRole.MANAGER")}
                    </SelectItem>
                    <SelectItem value={GqlRole.Owner}>
                      {t("adminVotes.form.gate.requiredRole.OWNER")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </ItemActions>
            </Item>
          </>
        )}

        {/* NFT: トークン選択 */}
        {gateIsNft && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent className="space-y-2 min-w-0">
                <ItemTitle>
                  {t("adminVotes.form.gate.nftToken.label")}
                </ItemTitle>
                {!nftTokensLoading && nftTokens.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {t("adminVotes.form.gate.nftToken.empty")}
                  </p>
                ) : (
                  <Select
                    value={gate.nftTokenId || undefined}
                    onValueChange={(v) => setNft(v)}
                    disabled={nftTokensLoading || nftTokens.length === 0}
                  >
                    <SelectTrigger
                      className={`overflow-hidden ${nftTokenIdError ? "border-destructive" : ""}`}
                    >
                      <SelectValue
                        placeholder={t(
                          "adminVotes.form.gate.nftToken.placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {nftTokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <span className="block max-w-[260px] truncate">
                            {token.name ?? token.address}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {nftTokenIdError && (
                  <p className="text-xs text-destructive">{nftTokenIdError}</p>
                )}
              </ItemContent>
            </Item>

            {/* NFT: 票の重み */}
            <ItemSeparator />
            <Item size="sm">
              <ItemContent className="space-y-2">
                <ItemTitle>
                  {t("adminVotes.form.powerPolicy.label")}
                </ItemTitle>
                <ToggleGroup
                  type="single"
                  value={powerPolicy.type}
                  onValueChange={(v) => {
                    if (
                      v === GqlVotePowerPolicyType.Flat ||
                      v === GqlVotePowerPolicyType.NftCount
                    ) {
                      handlePowerPolicyChange(v);
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
                    className="h-auto min-h-10 whitespace-pre-line text-center leading-tight"
                  >
                    {t("adminVotes.form.powerPolicy.type.NFT_COUNT")}
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-xs text-muted-foreground">
                  {powerPolicy.type === GqlVotePowerPolicyType.NftCount
                    ? t("adminVotes.form.powerPolicy.type.description.NFT_COUNT")
                    : t("adminVotes.form.powerPolicy.type.description.FLAT")}
                </p>
              </ItemContent>
            </Item>
          </>
        )}
      </ItemGroup>
    </section>
  );
}
