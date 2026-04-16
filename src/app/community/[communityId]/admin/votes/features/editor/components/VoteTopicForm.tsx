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
  onOpenGateSheet: () => void;
  onOpenPowerPolicySheet: () => void;
}

export function VoteTopicForm({
  onSubmit,
  saving,
  nftTokens,
  onOpenGateSheet,
  onOpenPowerPolicySheet,
}: VoteTopicFormProps) {
  const t = useTranslations();

  return (
    <form onSubmit={onSubmit} className="space-y-8 py-6">
      <BasicInfoSection />
      <PeriodSection />
      <OptionsSection />
      <GateSection onOpenSheet={onOpenGateSheet} nftTokens={nftTokens} />
      <PowerPolicySection
        onOpenSheet={onOpenPowerPolicySheet}
        nftTokens={nftTokens}
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
