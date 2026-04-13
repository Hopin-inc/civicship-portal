"use client";

import { use, useMemo } from "react";
import { useGetTransactionDetailQuery } from "@/types/graphql";
import { ErrorState, InfoCard } from "@/components/shared";
import { InfoCardProps } from "@/types";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import { useTransactionDetailData } from "./lib/useTransactionDetailData";
import { VerificationSection } from "../components/VerificationSection";
import { TransactionImageGrid } from "./components/TransactionImageGrid";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();

  const { data, loading } = useGetTransactionDetailQuery({
    variables: { id },
  });

  const headerConfig = useMemo(
    () => ({
      title: t("transactions.detail.header.title"),
      showBackButton: true,
      showLogo: false,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const transaction = data?.transaction;
  const { detail } = useTransactionDetailData(transaction, t);

  if (loading) return <LoadingIndicator />;

  if (!transaction || !detail) {
    return <ErrorState title={t("transactions.detail.notFound")} />;
  }

  const infoCards: InfoCardProps[] = [
    {
      label: t("transactions.detail.dateTime"),
      value: formatDateTime(detail.dateTime),
      showTruncate: false,
    },
    {
      label: t("transactions.detail.transactionType"),
      value: detail.transactionType,
    },
    {
      label: t("transactions.detail.from"),
      value: detail.fromName,
      ...(detail.fromUserId && { internalLink: `/users/${detail.fromUserId}` }),
    },
    {
      label: t("transactions.detail.to"),
      value: detail.toName,
      ...(detail.toUserId && { internalLink: `/users/${detail.toUserId}` }),
    },
    {
      label: t("transactions.detail.pointAmount"),
      value: `${detail.pointAmount.toLocaleString()}pt`,
    },
  ];

  const images = transaction.images ?? [];
  const hasMessage = !!detail.comment || images.length > 0;

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-1">
        {infoCards.map((card) => (
          <InfoCard key={card.label} {...card} />
        ))}
      </div>

      {hasMessage && (
        <div className="space-y-3 px-1">
          {detail.comment && (
            <p className="text-sm whitespace-pre-line break-words leading-relaxed">
              {detail.comment}
            </p>
          )}
          {images.length > 0 && <TransactionImageGrid images={images} />}
        </div>
      )}

      <VerificationSection transactionId={id} />
    </div>
  );
}
