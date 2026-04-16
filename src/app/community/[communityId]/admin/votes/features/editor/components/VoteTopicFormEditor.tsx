"use client";

import { useEffect, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { useVoteTopicEditor } from "../hooks/useVoteTopicEditor";
import { useVoteTopicSave } from "../hooks/useVoteTopicSave";
import { useNftTokens } from "../hooks/useNftTokens";
import { useFormSheets } from "../hooks/useFormSheets";
import { VoteTopicForm } from "./VoteTopicForm";
import { VoteTopicFormSheets } from "./VoteTopicFormSheets";

interface VoteTopicFormEditorProps {
  communityId: string;
  onSuccess?: (id: string) => void;
}

export function VoteTopicFormEditor({
  communityId,
  onSuccess,
}: VoteTopicFormEditorProps) {
  const t = useTranslations();
  const form = useVoteTopicEditor();
  const { save, saving } = useVoteTopicSave({ communityId });
  const { tokens, loading: tokensLoading } = useNftTokens({ communityId });
  const sheets = useFormSheets();

  /**
   * gate が NFT 型 + powerPolicy が NFT_COUNT 型の場合、
   * powerPolicy.nftTokenId を gate.nftTokenId に追従させる。
   * BE が両者の不一致を VALIDATION_ERROR で弾くため、UI 側で強制的に同期する。
   */
  const gateType = form.watch("gate.type");
  const gateNftTokenId =
    form.watch("gate.type") === GqlVoteGateType.Nft
      ? form.watch("gate.nftTokenId")
      : null;
  const powerPolicyType = form.watch("powerPolicy.type");
  const powerPolicyNftTokenId =
    form.watch("powerPolicy.type") === GqlVotePowerPolicyType.NftCount
      ? form.watch("powerPolicy.nftTokenId")
      : null;

  useEffect(() => {
    if (
      gateType === GqlVoteGateType.Nft &&
      powerPolicyType === GqlVotePowerPolicyType.NftCount &&
      gateNftTokenId &&
      gateNftTokenId !== powerPolicyNftTokenId
    ) {
      form.setValue(
        "powerPolicy",
        { type: GqlVotePowerPolicyType.NftCount, nftTokenId: gateNftTokenId },
        { shouldDirty: true, shouldValidate: true },
      );
    }
  }, [gateType, gateNftTokenId, powerPolicyType, powerPolicyNftTokenId, form]);

  const headerConfig = useMemo(
    () => ({
      title: t("adminVotes.page.title"),
      showLogo: false,
      showBackButton: true,
      hideFooter: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const handleSubmit = form.handleSubmit(async (values) => {
    const id = await save(values);
    if (id) onSuccess?.(id);
  });

  return (
    <FormProvider {...form}>
      <VoteTopicForm
        onSubmit={handleSubmit}
        saving={saving}
        nftTokens={tokens}
        onOpenGateSheet={sheets.openGate}
        onOpenPowerPolicySheet={sheets.openPowerPolicy}
      />
      <VoteTopicFormSheets
        gateOpen={sheets.active === "gate"}
        onGateOpenChange={(open) => (open ? sheets.openGate() : sheets.close())}
        powerPolicyOpen={sheets.active === "powerPolicy"}
        onPowerPolicyOpenChange={(open) =>
          open ? sheets.openPowerPolicy() : sheets.close()
        }
        nftTokens={tokens}
        nftTokensLoading={tokensLoading}
      />
    </FormProvider>
  );
}
