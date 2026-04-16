"use client";

import { useEffect, useState } from "react";
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
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { VoteGateInput, VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface VoteGateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function VoteGateSheet({
  open,
  onOpenChange,
  nftTokens,
  nftTokensLoading,
}: VoteGateSheetProps) {
  const t = useTranslations();
  const { getValues, setValue, trigger } = useFormContext<VoteTopicFormValues>();

  const [type, setType] = useState<VoteGateInput["type"]>(GqlVoteGateType.Membership);
  const [requiredRole, setRequiredRole] = useState<GqlRole>(GqlRole.Member);
  const [nftTokenId, setNftTokenId] = useState<string>("");
  const [nftError, setNftError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const current = getValues("gate");
    setType(current.type);
    setRequiredRole(
      current.type === GqlVoteGateType.Membership ? current.requiredRole : GqlRole.Member,
    );
    setNftTokenId(current.type === GqlVoteGateType.Nft ? current.nftTokenId : "");
    setNftError(null);
  }, [open, getValues]);

  const typeDescription =
    type === GqlVoteGateType.Nft
      ? t("adminVotes.form.gate.type.description.NFT")
      : t("adminVotes.form.gate.type.description.MEMBERSHIP");

  const handleDone = async () => {
    const next: VoteGateInput =
      type === GqlVoteGateType.Nft
        ? { type: GqlVoteGateType.Nft, requiredRole: null, nftTokenId }
        : { type: GqlVoteGateType.Membership, requiredRole, nftTokenId: null };

    if (next.type === GqlVoteGateType.Nft && !next.nftTokenId) {
      setNftError(t("adminVotes.form.errors.nftTokenRequired"));
      return;
    }
    setNftError(null);

    setValue("gate", next, { shouldDirty: true, shouldValidate: true });
    const valid = await trigger("gate");
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
            {t("adminVotes.form.gate.label")}
          </SheetTitle>
        </SheetHeader>

        <ItemGroup className="border rounded-lg">
          <Item size="sm">
            <ItemContent>
              <ItemTitle className="font-bold">
                {t("adminVotes.form.gate.groupTitle")}
              </ItemTitle>
            </ItemContent>
          </Item>

          <ItemSeparator />

          {/* 資格タイプ（MEMBERSHIP / NFT） */}
          <Item size="sm">
            <ItemContent className="space-y-2">
              <ToggleGroup
                type="single"
                value={type}
                onValueChange={(v) => {
                  if (v === GqlVoteGateType.Nft || v === GqlVoteGateType.Membership) {
                    setType(v);
                    setNftError(null);
                  }
                }}
                variant="outline"
                className="grid grid-cols-2 w-full gap-2"
              >
                <ToggleGroupItem value={GqlVoteGateType.Membership}>
                  {t("adminVotes.form.gate.type.MEMBERSHIP")}
                </ToggleGroupItem>
                <ToggleGroupItem value={GqlVoteGateType.Nft}>
                  {t("adminVotes.form.gate.type.NFT")}
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-muted-foreground">{typeDescription}</p>
            </ItemContent>
          </Item>

          <ItemSeparator />

          {/* MEMBERSHIP: 最低ロール */}
          {type === GqlVoteGateType.Membership && (
            <Item size="sm">
              <ItemContent>
                <ItemTitle>{t("adminVotes.form.gate.requiredRole.label")}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Select
                  value={requiredRole}
                  onValueChange={(v) => setRequiredRole(v as GqlRole)}
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
          )}

          {/* NFT: トークン選択 */}
          {type === GqlVoteGateType.Nft && (
            <Item size="sm">
              <ItemContent className="space-y-2">
                <ItemTitle>{t("adminVotes.form.gate.nftToken.label")}</ItemTitle>
                {!nftTokensLoading && nftTokens.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {t("adminVotes.form.gate.nftToken.empty")}
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
                        placeholder={t("adminVotes.form.gate.nftToken.placeholder")}
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
          )}
        </ItemGroup>

        <SheetFooter className="pt-6 sm:space-x-2">
          <Button
            type="button"
            variant="tertiary"
            onClick={() => onOpenChange(false)}
          >
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
