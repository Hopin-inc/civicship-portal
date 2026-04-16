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
import { GqlVotePowerPolicyType } from "@/types/graphql";
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
  const { getValues, setValue, trigger } = useFormContext<VoteTopicFormValues>();

  const [type, setType] = useState<VotePowerPolicyInput["type"]>(
    GqlVotePowerPolicyType.Flat,
  );
  const [nftTokenId, setNftTokenId] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    const current = getValues("powerPolicy");
    setType(current.type);
    setNftTokenId(
      current.type === GqlVotePowerPolicyType.NftCount ? current.nftTokenId : "",
    );
  }, [open, getValues]);

  const handleDone = async () => {
    const next: VotePowerPolicyInput =
      type === GqlVotePowerPolicyType.NftCount
        ? { type: GqlVotePowerPolicyType.NftCount, nftTokenId }
        : { type: GqlVotePowerPolicyType.Flat, nftTokenId: null };
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

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground px-1">
              {t("adminVotes.form.powerPolicy.type.label")}
            </span>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(v) => {
                if (
                  v === GqlVotePowerPolicyType.Flat ||
                  v === GqlVotePowerPolicyType.NftCount
                ) {
                  setType(v);
                }
              }}
              variant="outline"
              className="w-full gap-2"
            >
              <ToggleGroupItem value={GqlVotePowerPolicyType.Flat} className="flex-1">
                {t("adminVotes.form.powerPolicy.type.FLAT")}
              </ToggleGroupItem>
              <ToggleGroupItem value={GqlVotePowerPolicyType.NftCount} className="flex-1">
                {t("adminVotes.form.powerPolicy.type.NFT_COUNT")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {type === GqlVotePowerPolicyType.NftCount && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground px-1">
                {t("adminVotes.form.powerPolicy.nftToken.label")}
              </span>
              <Select
                value={nftTokenId}
                onValueChange={setNftTokenId}
                disabled={nftTokensLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("adminVotes.form.powerPolicy.nftToken.placeholder")}
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
