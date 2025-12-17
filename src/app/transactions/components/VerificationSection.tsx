"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/shared";
import { useVerifyTransactionsQuery, GqlVerificationStatus } from "@/types/graphql";
import { useTranslations } from "next-intl";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface VerificationSectionProps {
  transactionId: string;
}

export const VerificationSection = ({ transactionId }: VerificationSectionProps) => {
  const t = useTranslations();
  const [showVerification, setShowVerification] = useState(false);

  const { data, loading, error } = useVerifyTransactionsQuery({
    variables: { txIds: [transactionId] },
    skip: !showVerification,
  });

  const verificationResult = data?.verifyTransactions?.[0];

  const handleShowVerification = () => {
    setShowVerification(true);
  };

  if (!showVerification) {
    return (
      <div className="mt-6 flex flex-col items-center gap-2">
        <Button variant="secondary" onClick={handleShowVerification}>
          {t("transactions.detail.verification.showButton")}
        </Button>
        <p className="text-label-xs text-muted-foreground text-center">
          {t("transactions.detail.verification.description")}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center text-label-sm text-destructive">
        {t("transactions.detail.verification.error")}
      </div>
    );
  }

  if (!verificationResult) {
    return (
      <div className="mt-6 text-center text-label-sm text-muted-foreground">
        {t("transactions.detail.verification.notFound")}
      </div>
    );
  }

  const isVerified = verificationResult.status === GqlVerificationStatus.Verified;

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-1">
        {verificationResult.transactionHash && (
          <InfoCard
            label={t("transactions.detail.verification.transactionHash")}
            value={verificationResult.transactionHash}
            showCopy={true}
            copyData={verificationResult.transactionHash}
            truncatePattern="middle"
            truncateHead={6}
            truncateTail={4}
          />
        )}
        {verificationResult.rootHash && (
          <InfoCard
            label={t("transactions.detail.verification.rootHash")}
            value={verificationResult.rootHash}
            showCopy={true}
            copyData={verificationResult.rootHash}
            truncatePattern="middle"
            truncateHead={6}
            truncateTail={4}
          />
        )}
        {verificationResult.label !== null && verificationResult.label !== undefined && (
          <InfoCard
            label={t("transactions.detail.verification.label")}
            value={String(verificationResult.label)}
          />
        )}
      </div>
    </div>
  );
};
