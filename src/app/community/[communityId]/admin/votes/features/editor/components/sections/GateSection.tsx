"use client";

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
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface GateSectionProps {
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function GateSection({ nftTokens, nftTokensLoading }: GateSectionProps) {
  const t = useTranslations();
  const { setValue, watch, formState } = useFormContext<VoteTopicFormValues>();
  const gate = watch("gate");

  const nftTokenIdError =
    formState.errors.gate &&
    (formState.errors.gate as { nftTokenId?: { message?: string } }).nftTokenId?.message;

  const setMembership = (requiredRole: GqlRole) =>
    setValue(
      "gate",
      { type: GqlVoteGateType.Membership, requiredRole, nftTokenId: null },
      { shouldDirty: true, shouldValidate: true },
    );

  const setNft = (nftTokenId: string) =>
    setValue(
      "gate",
      { type: GqlVoteGateType.Nft, requiredRole: null, nftTokenId },
      { shouldDirty: true, shouldValidate: true },
    );

  const handleTypeChange = (next: GqlVoteGateType) => {
    if (next === gate.type) return;
    if (next === GqlVoteGateType.Membership) {
      setMembership(GqlRole.Member);
    } else {
      setNft("");
    }
  };

  const typeDescription =
    gate.type === GqlVoteGateType.Nft
      ? t("adminVotes.form.gate.type.description.NFT")
      : t("adminVotes.form.gate.type.description.MEMBERSHIP");

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">
          {t("adminVotes.form.gate.label")}
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
              value={gate.type}
              onValueChange={(v) => {
                if (v === GqlVoteGateType.Nft || v === GqlVoteGateType.Membership) {
                  handleTypeChange(v);
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
            <p className="text-xs text-muted-foreground">{typeDescription}</p>
          </ItemContent>
        </Item>

        {gate.type === GqlVoteGateType.Membership && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent>
                <ItemTitle>{t("adminVotes.form.gate.requiredRole.label")}</ItemTitle>
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

        {gate.type === GqlVoteGateType.Nft && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent className="space-y-2">
                <ItemTitle>{t("adminVotes.form.gate.nftToken.label")}</ItemTitle>
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
                      className={nftTokenIdError ? "border-destructive" : undefined}
                    >
                      <SelectValue
                        placeholder={t("adminVotes.form.gate.nftToken.placeholder")}
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
          </>
        )}
      </ItemGroup>
    </section>
  );
}
