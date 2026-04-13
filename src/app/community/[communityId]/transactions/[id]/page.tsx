"use client";

import { use, useMemo } from "react";
import { useGetTransactionDetailQuery } from "@/types/graphql";
import { ErrorState } from "@/components/shared";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import { useTransactionDetailData } from "./lib/useTransactionDetailData";
import { VerificationSection } from "../components/VerificationSection";
import { TransactionImageGrid } from "./components/TransactionImageGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

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

  const images = transaction.images ?? [];
  const hasMessage = !!detail.comment || images.length > 0;

  const fromImage = transaction.fromWallet?.user?.image ?? transaction.fromWallet?.community?.image ?? undefined;
  const toImage = transaction.toWallet?.user?.image ?? transaction.toWallet?.community?.image ?? undefined;

  return (
    <div className="p-4 space-y-6">
      {/* ── ヘッダーサマリー（ポイント入力画面風） ── */}
      <div className="flex flex-col items-center gap-4 pt-4 pb-2">
        {/* 送り元 → 送り先 */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src={fromImage ?? ""} alt={detail.fromName} />
              <AvatarFallback className="text-sm">{detail.fromName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground max-w-[72px] truncate text-center">{detail.fromName}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground mb-4" />
          <div className="flex flex-col items-center gap-1">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src={toImage ?? ""} alt={detail.toName} />
              <AvatarFallback className="text-sm">{detail.toName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground max-w-[72px] truncate text-center">{detail.toName}</p>
          </div>
        </div>

        {/* ポイント数 */}
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tabular-nums tracking-tight">
            {detail.pointAmount.toLocaleString()}
          </span>
          <span className="text-2xl text-muted-foreground font-medium">pt</span>
        </div>

        {/* 日時・種別 */}
        <p className="text-xs text-muted-foreground">
          {formatDateTime(detail.dateTime)} · {detail.transactionType}
        </p>
      </div>

      {/* ── メッセージ（コメント + 画像） ── */}
      {hasMessage && (
        <div className="space-y-3">
          {detail.comment && (
            <p className="text-sm whitespace-pre-line break-words leading-relaxed">
              {detail.comment}
            </p>
          )}
          {images.length > 0 && <TransactionImageGrid images={images} />}
        </div>
      )}

      {/* ── 検証セクション ── */}
      <VerificationSection transactionId={id} />
    </div>
  );
}
