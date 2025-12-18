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
import Image from "next/image";
import { currentCommunityConfig } from "@/lib/communities/metadata";

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
      label: t("transactions.detail.transactionType"),
      value: detail.transactionType,
    },
        {
          label: t("transactions.detail.dateTime"),
          value: formatDateTime(detail.dateTime),
          showTruncate: false,
        },
    {
      label: t("transactions.detail.from"),
      value: detail.fromName,
    },
    {
      label: t("transactions.detail.pointAmount"),
      value: `${detail.pointAmount.toLocaleString()}pt`,
    },
    {
      label: t("transactions.detail.to"),
      value: detail.toName,
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
      <>
        <div className="flex justify-center mt-10">
          <div>
            <Image
              src={currentCommunityConfig.squareLogoPath}
              alt={currentCommunityConfig.title}
              width={120}
              height={120}
              className="object-cover border-none shadow-none mx-auto rounded-sm"
            />
          </div>
        </div>
        <div className="mt-6 p-4">
          <div className="grid grid-cols-1 gap-1">
            {infoCards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
          <VerificationSection transactionId={id} />
        </div>
      </>
    );
}
