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
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { VoteGateInput, VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface VoteGateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

const ROLE_ANY = "__ANY__";

export function VoteGateSheet({
  open,
  onOpenChange,
  nftTokens,
  nftTokensLoading,
}: VoteGateSheetProps) {
  const t = useTranslations();
  const { getValues, setValue, trigger } = useFormContext<VoteTopicFormValues>();

  const [type, setType] = useState<VoteGateInput["type"]>(GqlVoteGateType.Membership);
  const [requiredRole, setRequiredRole] = useState<GqlRole | null>(null);
  const [nftTokenId, setNftTokenId] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    const current = getValues("gate");
    setType(current.type);
    setRequiredRole(current.type === GqlVoteGateType.Membership ? current.requiredRole : null);
    setNftTokenId(current.type === GqlVoteGateType.Nft ? current.nftTokenId : "");
  }, [open, getValues]);

  const handleDone = async () => {
    const next: VoteGateInput =
      type === GqlVoteGateType.Nft
        ? { type: GqlVoteGateType.Nft, requiredRole: null, nftTokenId }
        : { type: GqlVoteGateType.Membership, requiredRole, nftTokenId: null };
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

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground px-1">
              {t("adminVotes.form.gate.type.label")}
            </span>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(v) => {
                if (v === GqlVoteGateType.Nft || v === GqlVoteGateType.Membership) {
                  setType(v);
                }
              }}
              variant="outline"
              className="w-full gap-2"
            >
              <ToggleGroupItem value={GqlVoteGateType.Membership} className="flex-1">
                {t("adminVotes.form.gate.type.MEMBERSHIP")}
              </ToggleGroupItem>
              <ToggleGroupItem value={GqlVoteGateType.Nft} className="flex-1">
                {t("adminVotes.form.gate.type.NFT")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {type === GqlVoteGateType.Membership && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground px-1">
                {t("adminVotes.form.gate.requiredRole.label")}
              </span>
              <Select
                value={requiredRole ?? ROLE_ANY}
                onValueChange={(v) => {
                  setRequiredRole(v === ROLE_ANY ? null : (v as GqlRole));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLE_ANY}>
                    {t("adminVotes.form.gate.requiredRole.any")}
                  </SelectItem>
                  <SelectItem value={GqlRole.Owner}>
                    {t("adminVotes.form.gate.requiredRole.OWNER")}
                  </SelectItem>
                  <SelectItem value={GqlRole.Manager}>
                    {t("adminVotes.form.gate.requiredRole.MANAGER")}
                  </SelectItem>
                  <SelectItem value={GqlRole.Member}>
                    {t("adminVotes.form.gate.requiredRole.MEMBER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === GqlVoteGateType.Nft && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground px-1">
                {t("adminVotes.form.gate.nftToken.label")}
              </span>
              <Select
                value={nftTokenId}
                onValueChange={setNftTokenId}
                disabled={nftTokensLoading}
              >
                <SelectTrigger>
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
            </div>
          )}
        </div>

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
