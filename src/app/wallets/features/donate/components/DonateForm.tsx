"use client";

import React from "react";
import { GqlUser } from "@/types/graphql";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";
import { useTranslations } from "next-intl";

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  isAuthReady?: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string) => void;
}

export function DonateForm({
  user,
  currentPoint,
  isLoading,
  isAuthReady,
  onBack,
  onSubmit,
}: Props) {
  const t = useTranslations();
  return (
    <TransferInputStep
      user={user}
      isLoading={isLoading}
      isAuthReady={isAuthReady}
      onBack={onBack}
      onSubmit={onSubmit}
      currentPoint={currentPoint}
      title={t("wallets.donate.pageTitle")}
      recipientKey="wallets.donate.recipientRich"
      submitLabel={t("wallets.donate.submitLabel")}
      backLabel={t("wallets.donate.backLabel")}
      presetAmounts={[1000, 3000, 5000, 10000]}
    />
  );
}
