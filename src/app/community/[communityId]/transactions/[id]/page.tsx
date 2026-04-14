"use client";

import { use, useMemo, useState } from "react";
import { useGetTransactionDetailQuery } from "@/types/graphql";
import { ErrorState } from "@/components/shared";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import { useTransactionDetailData } from "./lib/useTransactionDetailData";
import { VerificationSection } from "../components/VerificationSection";
import { TransactionImageGrid } from "../components/TransactionImageGrid";
import { TransactionMetadataEditSheet } from "./components/TransactionMetadataEditSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Pencil } from "lucide-react";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useAppRouter } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { GqlMembership, GqlRole, GqlWalletType } from "@/types/graphql";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();

  const { data, loading, refetch } = useGetTransactionDetailQuery({
    variables: { id },
  });
  const currentUserId = useAuthStore((s) => s.state.currentUser?.id);
  const { user: currentUser } = useAuth();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const currentUserRole = currentUser?.memberships?.find(
    (m: GqlMembership) => m.community?.id === communityId,
  )?.role;
  const router = useAppRouter();
  const [editOpen, setEditOpen] = useState(false);

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

  // 送信者本人、またはコミュニティウォレット発の場合はコミュニティオーナー
  const isSender = !!(currentUserId && transaction.fromWallet?.user?.id === currentUserId);
  const isFromCommunityWallet = transaction.fromWallet?.type === GqlWalletType.Community;
  const isOwner = currentUserRole === GqlRole.Owner;
  const canEdit = isSender || (isOwner && isFromCommunityWallet);

  return (
    <div className="p-4 space-y-6">
      {/* ── ヘッダーサマリー（ポイント入力画面風） ── */}
      <div className="flex flex-col items-center gap-4 pt-4 pb-2">
        <div className="flex items-center gap-4">
          {/* from: ユーザーならタップでプロフィールへ、コミュニティなら非インタラクティブ */}
          {detail.fromUserId ? (
            <button
              type="button"
              onClick={() => router.push(`/users/${detail.fromUserId}`)}
              className="flex flex-col items-center gap-1"
            >
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={fromImage ?? ""} alt={detail.fromName} />
                <AvatarFallback className="text-sm">{detail.fromName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground max-w-[72px] truncate text-center">{detail.fromName}</p>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={fromImage ?? ""} alt={detail.fromName} />
                <AvatarFallback className="text-sm">{detail.fromName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground max-w-[72px] truncate text-center">{detail.fromName}</p>
            </div>
          )}

          <ArrowRight className="w-4 h-4 text-muted-foreground mb-4" />

          {/* to: ユーザーならタップでプロフィールへ、コミュニティなら非インタラクティブ */}
          {detail.toUserId ? (
            <button
              type="button"
              onClick={() => router.push(`/users/${detail.toUserId}`)}
              className="flex flex-col items-center gap-1"
            >
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={toImage ?? ""} alt={detail.toName} />
                <AvatarFallback className="text-sm">{detail.toName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground max-w-[72px] truncate text-center">{detail.toName}</p>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={toImage ?? ""} alt={detail.toName} />
                <AvatarFallback className="text-sm">{detail.toName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground max-w-[72px] truncate text-center">{detail.toName}</p>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tabular-nums tracking-tight">
            {detail.pointAmount.toLocaleString()}
          </span>
          <span className="text-2xl text-muted-foreground font-medium">pt</span>
        </div>

        <p className="text-xs text-muted-foreground">
          {formatDateTime(detail.dateTime)} · {detail.transactionType}
        </p>
      </div>

      {/* ── メッセージ（コメント + 画像） ── */}
      <div className="space-y-3">
        {hasMessage ? (
          <>
            {detail.comment && (
              <p className="text-sm whitespace-pre-line break-words leading-relaxed">
                {detail.comment}
              </p>
            )}
            {images.length > 0 && <TransactionImageGrid images={images} />}
          </>
        ) : null}

        {/* 編集ボタン（送信者のみ） */}
        {canEdit && (
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Pencil className="w-3.5 h-3.5" />
            {hasMessage
              ? t("transactions.detail.actions.edit")
              : t("transactions.detail.actions.addMessage")}
          </button>
        )}
      </div>

      {/* ── 検証セクション ── */}
      <VerificationSection transactionId={id} />

      {/* ── 編集シート ── */}
      {canEdit && (
        <TransactionMetadataEditSheet
          transactionId={id}
          initialComment={detail.comment}
          initialImages={images}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
