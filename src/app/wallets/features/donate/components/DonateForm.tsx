"use client";

import React from "react";
import { GqlUser } from "@/types/graphql";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string) => void;
}

export function DonateForm({
  user,
  currentPoint,
  isLoading,
  onBack,
  onSubmit,
}: Props) {
  return (
    <TransferInputStep
      user={user}
      isLoading={isLoading}
      onBack={onBack}
      onSubmit={onSubmit}
      currentPoint={currentPoint}
      title="ポイントをあげる"
      recipientLabel="にあげる"
      submitLabel="あげる"
      backLabel="あげる相手を選び直す"
      presetAmounts={[1000, 3000, 5000, 10000]}
    />
  );
}
