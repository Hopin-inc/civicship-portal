"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/shared";
import { GqlVerificationStatus, useVerifyTransactionsQuery } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { getCardanoExplorerTxUrl } from "@/app/[communityId]/transactions/[id]/lib/getCardanoExploerTxUrl";

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

  if (!showVerification || loading) {
    return (
      <div className="mt-6 flex flex-col items-center gap-2">
        <Button variant="text" onClick={handleShowVerification} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("transactions.detail.verification.loading")}
            </>
          ) : (
            t("transactions.detail.verification.showButton")
          )}
        </Button>
        <p className="text-label-xs text-muted-foreground text-center">
          {t("transactions.detail.verification.description")}
        </p>
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

  if (!isVerified) {
    return (
      <div className="pl-6 mt-12 text-center text-label-sm text-muted-foreground">
        {t("transactions.detail.verification.notVerified")}
      </div>
    );
  }

  const explorerUrl = verificationResult.transactionHash
    ? getCardanoExplorerTxUrl(verificationResult.transactionHash)
    : null;

  return (
    <div className="mt-12">
      {/* 検証完了メッセージ */}
      <div className="pl-6">
        <div className="mb-1 flex items-center gap-1 text-label-sm text-success">
          <ShieldCheck className="h-4 w-4" />
          {t("transactions.detail.verification.result")}
        </div>
        <div className="mb-3 text-left text-body-xs text-muted-foreground leading-relaxed">
          {t("transactions.detail.verification.resultDescription")}
        </div>
      </div>

      {/* 検証情報 */}
      <div className="grid grid-cols-1 gap-1">
        {verificationResult.transactionHash && (
          <InfoCard
            label={t("transactions.detail.verification.transactionHash")}
            value={verificationResult.transactionHash}
            showCopy
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
            showCopy
            copyData={verificationResult.rootHash}
            truncatePattern="middle"
            truncateHead={6}
            truncateTail={4}
          />
        )}
      </div>

      {/* Explorer リンク */}
      {explorerUrl && (
        <div className="mt-4 flex justify-center">
          <Button variant="text">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              <span>{t("transactions.detail.verification.openExplorer")}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};
