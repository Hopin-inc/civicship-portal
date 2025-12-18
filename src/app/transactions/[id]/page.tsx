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

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      },
      {
        label: t("transactions.detail.to"),
        value: detail.toName,
      },
      {
        label: t("transactions.detail.pointAmount"),
        value: `${detail.pointAmount.toLocaleString()}pt`,
      },
      ...(detail.comment
        ? [
            {
              label: t("transactions.detail.comment"),
              value: detail.comment,
              showTruncate: false,
            },
          ]
        : []),
    ];

        return (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-1">
                        {infoCards.map((card) => (
                          <InfoCard key={card.label} {...card} />
                        ))}
          </div>
          <VerificationSection transactionId={id} />
        </div>
      );
}
