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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface PowerPolicySectionProps {
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function PowerPolicySection({
  nftTokens,
  nftTokensLoading,
}: PowerPolicySectionProps) {
  const t = useTranslations();
  const { setValue, watch, formState } = useFormContext<VoteTopicFormValues>();
  const gate = watch("gate");
  const powerPolicy = watch("powerPolicy");

  const nftTokenIdError =
    formState.errors.powerPolicy &&
    (formState.errors.powerPolicy as { nftTokenId?: { message?: string } }).nftTokenId
      ?.message;

  /** gate が NFT 型 + powerPolicy が NFT_COUNT 型なら、powerPolicy.nftTokenId を gate のものに同期する */
  const syncedFromGate =
    powerPolicy.type === GqlVotePowerPolicyType.NftCount &&
    gate.type === GqlVoteGateType.Nft;

  useEffect(() => {
    if (!syncedFromGate) return;
    if (gate.type !== GqlVoteGateType.Nft) return;
    if (powerPolicy.type !== GqlVotePowerPolicyType.NftCount) return;
    if (!gate.nftTokenId) return;
    if (gate.nftTokenId === powerPolicy.nftTokenId) return;
    setValue(
      "powerPolicy",
      { type: GqlVotePowerPolicyType.NftCount, nftTokenId: gate.nftTokenId },
      { shouldDirty: true, shouldValidate: true },
    );
  }, [syncedFromGate, gate, powerPolicy, setValue]);

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

  const setNftCount = (nftTokenId: string) =>
    setValue(
      "powerPolicy",
      { type: GqlVotePowerPolicyType.NftCount, nftTokenId },
      { shouldDirty: true, shouldValidate: true },
    );

  const handleTypeChange = (next: GqlVotePowerPolicyType) => {
    if (next === powerPolicy.type) return;
    if (next === GqlVotePowerPolicyType.Flat) {
      setFlat();
    } else {
      // gate が NFT ならそこから同期、そうでなければ空文字
      const initialTokenId =
        gate.type === GqlVoteGateType.Nft ? (gate.nftTokenId ?? "") : "";
      setNftCount(initialTokenId);
    }
  };

  const typeDescription =
    powerPolicy.type === GqlVotePowerPolicyType.NftCount
      ? t("adminVotes.form.powerPolicy.type.description.NFT_COUNT")
      : t("adminVotes.form.powerPolicy.type.description.FLAT");

  const currentNftTokenId =
    powerPolicy.type === GqlVotePowerPolicyType.NftCount
      ? powerPolicy.nftTokenId
      : "";

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
              <ToggleGroupItem value={GqlVotePowerPolicyType.Flat}>
                {t("adminVotes.form.powerPolicy.type.FLAT")}
              </ToggleGroupItem>
              <ToggleGroupItem value={GqlVotePowerPolicyType.NftCount}>
                {t("adminVotes.form.powerPolicy.type.NFT_COUNT")}
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">{typeDescription}</p>
          </ItemContent>
        </Item>

        {powerPolicy.type === GqlVotePowerPolicyType.NftCount && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent className="space-y-2">
                <ItemTitle>
                  {t("adminVotes.form.powerPolicy.nftToken.label")}
                </ItemTitle>

                {syncedFromGate ? (
                  <>
                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                      {gateNftToken
                        ? (gateNftToken.name ?? gateNftToken.address)
                        : t("adminVotes.form.gate.summary.nftUnselected")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("adminVotes.form.powerPolicy.nftToken.syncedFromGate")}
                    </p>
                  </>
                ) : !nftTokensLoading && nftTokens.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {t("adminVotes.form.powerPolicy.nftToken.empty")}
                  </p>
                ) : (
                  <Select
                    value={currentNftTokenId}
                    onValueChange={(v) => setNftCount(v)}
                    disabled={nftTokensLoading || nftTokens.length === 0}
                  >
                    <SelectTrigger
                      className={nftTokenIdError ? "border-destructive" : undefined}
                    >
                      <SelectValue
                        placeholder={t(
                          "adminVotes.form.powerPolicy.nftToken.placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {nftTokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          {token.name ?? token.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {nftTokenIdError && !syncedFromGate && (
                  <p className="text-xs text-destructive">{nftTokenIdError}</p>
                )}
              </ItemContent>
            </Item>
          </>
        )}
      </ItemGroup>
    </section>
  );
}
