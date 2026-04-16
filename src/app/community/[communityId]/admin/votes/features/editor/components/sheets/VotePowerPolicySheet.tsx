"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { VotePowerPolicyInput, VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface VotePowerPolicySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function VotePowerPolicySheet({
  open,
  onOpenChange,
  nftTokens,
  nftTokensLoading,
}: VotePowerPolicySheetProps) {
  const t = useTranslations();
  const { getValues, setValue, trigger, watch } =
    useFormContext<VoteTopicFormValues>();
  const gate = watch("gate");

  const [type, setType] = useState<VotePowerPolicyInput["type"]>(
    GqlVotePowerPolicyType.Flat,
  );
  const [nftTokenId, setNftTokenId] = useState<string>("");
  const [nftError, setNftError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const current = getValues("powerPolicy");
    setType(current.type);
    setNftTokenId(
      current.type === GqlVotePowerPolicyType.NftCount ? current.nftTokenId : "",
    );
    setNftError(null);
  }, [open, getValues]);

  /** gate が NFT のときは gate.nftTokenId を強制的に使う */
  const syncedFromGate =
    type === GqlVotePowerPolicyType.NftCount && gate.type === GqlVoteGateType.Nft;
  const gateNftToken = useMemo(
    () =>
      gate.type === GqlVoteGateType.Nft
        ? nftTokens.find((n) => n.id === gate.nftTokenId) ?? null
        : null,
    [gate, nftTokens],
  );
  const effectiveNftTokenId = syncedFromGate ? gate.nftTokenId ?? "" : nftTokenId;

  const typeDescription =
    type === GqlVotePowerPolicyType.NftCount
      ? t("adminVotes.form.powerPolicy.type.description.NFT_COUNT")
      : t("adminVotes.form.powerPolicy.type.description.FLAT");

  const handleDone = async () => {
    const next: VotePowerPolicyInput =
      type === GqlVotePowerPolicyType.NftCount
        ? {
            type: GqlVotePowerPolicyType.NftCount,
            nftTokenId: effectiveNftTokenId,
          }
        : { type: GqlVotePowerPolicyType.Flat, nftTokenId: null };

    if (next.type === GqlVotePowerPolicyType.NftCount && !next.nftTokenId) {
      setNftError(t("adminVotes.form.errors.nftTokenRequired"));
      return;
    }
    setNftError(null);

    setValue("powerPolicy", next, { shouldDirty: true, shouldValidate: true });
    const valid = await trigger("powerPolicy");
    if (valid) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-6 overflow-y-auto max-h-[80vh]"
      >
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-title-sm">
            {t("adminVotes.form.powerPolicy.label")}
          </SheetTitle>
        </SheetHeader>

        <ItemGroup className="border rounded-lg">
          <Item size="sm">
            <ItemContent>
              <ItemTitle className="font-bold">
                {t("adminVotes.form.powerPolicy.groupTitle")}
              </ItemTitle>
            </ItemContent>
          </Item>

          <ItemSeparator />

          {/* 重みタイプ */}
          <Item size="sm">
            <ItemContent className="space-y-2">
              <ToggleGroup
                type="single"
                value={type}
                onValueChange={(v) => {
                  if (
                    v === GqlVotePowerPolicyType.Flat ||
                    v === GqlVotePowerPolicyType.NftCount
                  ) {
                    setType(v);
                    setNftError(null);
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

          {/* NFT_COUNT: トークン選択 or gate との同期表示 */}
          {type === GqlVotePowerPolicyType.NftCount && (
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
                      value={nftTokenId}
                      onValueChange={(v) => {
                        setNftTokenId(v);
                        setNftError(null);
                      }}
                      disabled={nftTokensLoading || nftTokens.length === 0}
                    >
                      <SelectTrigger
                        className={nftError ? "border-destructive" : undefined}
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
                  {nftError && <p className="text-xs text-destructive">{nftError}</p>}
                </ItemContent>
              </Item>
            </>
          )}
        </ItemGroup>

        <SheetFooter className="pt-6 sm:space-x-2">
          <Button type="button" variant="tertiary" onClick={() => onOpenChange(false)}>
            {t("adminVotes.form.sheet.cancelButton")}
          </Button>
          <Button type="button" variant="primary" onClick={handleDone}>
            {t("adminVotes.form.sheet.saveButton")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
