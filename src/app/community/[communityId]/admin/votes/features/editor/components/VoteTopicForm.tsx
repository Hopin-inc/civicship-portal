"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { PeriodSection } from "./sections/PeriodSection";
import { OptionsSection } from "./sections/OptionsSection";
import { GateSection } from "./sections/GateSection";
import { PowerPolicySection } from "./sections/PowerPolicySection";
import { NftTokenOption } from "../hooks/useNftTokens";

interface VoteTopicFormProps {
  onSubmit: (e: FormEvent) => void;
  saving: boolean;
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function VoteTopicForm({
  onSubmit,
  saving,
  nftTokens,
  nftTokensLoading,
}: VoteTopicFormProps) {
  const t = useTranslations();

  return (
    <form onSubmit={onSubmit} className="space-y-8 py-6">
      <BasicInfoSection />
      <PeriodSection />
      <OptionsSection />
      <GateSection nftTokens={nftTokens} nftTokensLoading={nftTokensLoading} />
      <PowerPolicySection
        nftTokens={nftTokens}
        nftTokensLoading={nftTokensLoading}
      />

      <div className="w-full max-w-[345px] mx-auto">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={saving}
        >
          {saving ? t("adminVotes.form.submitting") : t("adminVotes.form.submitButton")}
        </Button>
      </div>
    </form>
  );
}
