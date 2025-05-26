"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_RESERVATION } from "@/graphql/experience/reservation/query";
import {
  ACCEPT_RESERVATION_MUTATION,
  REJECT_RESERVATION,
} from "@/graphql/experience/reservation/mutation";
import { OPPORTUNITY_SLOT_SET_HOSTING_STATUS } from "@/graphql/experience/opportunitySlot/mutation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import dayjs from "dayjs";
import { COMMUNITY_ID, displayDuration, displayPhoneNumber, PLACEHOLDER_IMAGE } from "@/utils";
import {
  CalendarIcon,
  Info,
  JapaneseYen,
  MapPin,
  NotepadTextDashed,
  Phone,
  User,
} from "lucide-react";
import { prefectureLabels } from "@/app/users/data/presenter";
import { GqlCurrentPrefecture, GqlOpportunityCategory, GqlReservation } from "@/types/graphql";
import { ReservationStatus } from "@/app/admin/reservations/components/ReservationStatus";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export default function ReservationDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const headerConfig = useMemo(
    () => ({
      title: `応募詳細`,
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/reservations",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const track = useAnalytics();

  const { data, loading, error, refetch } = useQuery(GET_RESERVATION, {
    variables: { id },
  });

  const [acceptReservation, { loading: acceptLoading }] = useMutation(ACCEPT_RESERVATION_MUTATION, {
    onCompleted: () => {
      toast.success("予約を承認しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`承認に失敗しました`);
    },
  });

  const [cancelSlot, { loading: cancelLoading }] = useMutation(
    OPPORTUNITY_SLOT_SET_HOSTING_STATUS,
    {
      onCompleted: () => {
        toast.success("開催を中止しました");
        refetch();
      },
      onError: (error) => {
        toast.error(`中止に失敗しました`);
      },
    },
  );

  const handleAccept = async () => {
    try {
      await acceptReservation({
        variables: {
          id,
          permission: {
            opportunityId: opportunity?.id,
            communityId: opportunity?.community?.id || "neo88",
          },
        },
      });

      if (reservation && opportunity) {
        track({
          name: "accept_application",
          params: {
            reservationId: reservation.id,
            opportunityId: opportunity.id,
            opportunityTitle: opportunity.title,
            category: opportunity.category,
            guest: reservation.participations?.length ?? 0,
            feeRequired: opportunity.feeRequired ?? 0,
            totalFee: (opportunity.feeRequired ?? 0) * (reservation.participations?.length ?? 0),
            scheduledAt:
              reservation.opportunitySlot?.startsAt instanceof Date
                ? reservation.opportunitySlot.startsAt.toISOString()
                : (reservation.opportunitySlot?.startsAt ?? ""),
          },
        });
      }
    } catch (e) {}
  };

  const handleCancel = async () => {
    try {
      await cancelSlot({
        variables: {
          id: reservation?.opportunitySlot?.id,
          input: { status: "CANCELLED" },
          permission: {
            opportunityId: opportunity?.id,
            communityId: opportunity?.community?.id || "neo88",
          },
        },
      });

      if (reservation && opportunity) {
        track({
          name: "cancel_slot",
          params: {
            slotId: reservation.opportunitySlot?.id ?? "",
            opportunityId: opportunity.id,
            opportunityTitle: opportunity.title,
            category: opportunity.category,
          },
        });
      }
    } catch (e) {}
  };

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  const [rejectReservation, { loading: rejectLoading }] = useMutation(REJECT_RESERVATION, {
    onCompleted: () => {
      toast.success("応募を却下しました");
      void refetch();
    },
    onError: (error) => {
      toast.error(`却下に失敗しました`);
    },
  });

  const handleReject = async () => {
    try {
      await rejectReservation({
        variables: {
          id,
          input: { comment: rejectComment },
          permission: {
            opportunityId: opportunity?.id,
            communityId: COMMUNITY_ID,
          },
        },
      });

      if (reservation && opportunity) {
        track({
          name: "reject_application",
          params: {
            reservationId: reservation.id,
            opportunityId: opportunity.id,
            opportunityTitle: opportunity.title,
            category: opportunity.category,
            guest: reservation.participations?.length ?? 0,
            feeRequired: opportunity.feeRequired ?? 0,
            totalFee: (opportunity.feeRequired ?? 0) * (reservation.participations?.length ?? 0),
            scheduledAt:
              reservation.opportunitySlot?.startsAt instanceof Date
                ? reservation.opportunitySlot.startsAt.toISOString()
                : (reservation.opportunitySlot?.startsAt ?? ""),
          },
        });
      }

      setIsRejectDialogOpen(false);
      setRejectComment("");
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="p-4 pt-16 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="予約情報の取得に失敗しました" />
      </div>
    );
  }

  const reservation: GqlReservation = data?.reservation;
  if (!reservation) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="予約が見つかりません" />
      </div>
    );
  }

  const opportunity = reservation?.opportunitySlot?.opportunity;
  const participantCount = reservation?.participations?.length || 0;
  const participationFee = (opportunity?.feeRequired || 0) * participantCount;

  const isWithin1Day = dayjs(reservation.opportunitySlot?.startsAt).diff(dayjs(), "day") < 1;
  const futureSlotsCount =
    opportunity?.slots?.filter(
      (slot: any) => dayjs(slot.startsAt).isAfter(dayjs()) && slot.hostingStatus !== "CANCELLED",
    )?.length || 0;
  const opportunityPagePath =
    opportunity?.category === GqlOpportunityCategory.Activity
      ? `/activities/${opportunity.id}`
      : opportunity?.category === GqlOpportunityCategory.Quest
        ? `/quests/${opportunity.id}`
        : "/";

  const isSlotCancelled = () => reservation.opportunitySlot?.hostingStatus === "CANCELLED";
  const isSlotCompleted = () => reservation.opportunitySlot?.hostingStatus === "COMPLETED";

  const isSlotActive = () => !isSlotCancelled() && !isSlotCompleted();
  const isApplied = () => reservation.status === "APPLIED" && isSlotActive();
  const isAccepted = () => reservation.status === "ACCEPTED" && isSlotActive();
  const isCanceled = () => reservation.status === "CANCELED";
  const isRejected = () => reservation.status === "REJECTED";
  const canCancelReservation = () => isAccepted() && !isWithin1Day;
  const cannotCancelReservation = () => isAccepted() && isWithin1Day;

  const shouldShowOperationNotice =
    isApplied() ||
    canCancelReservation() ||
    cannotCancelReservation() ||
    isCanceled() ||
    isRejected() ||
    isSlotCancelled(); // ✅ 追加

  const operationNoticeText = isApplied()
    ? "応募内容を確認し、承認またはお断りの操作を行ってください。"
    : isCanceled()
      ? "応募は参加者によってキャンセルされました。必要な操作はありません。"
      : isRejected()
        ? "応募のお断りが完了しています。必要な操作はありません。"
        : isSlotCancelled()
          ? "この日付はすでに開催中止されています。必要な操作はありません。"
          : "開催中止は開催24時間前まで可能です。それ以降は緊急連絡先から直接ご連絡ください。";

  const isNeutralNotice = isCanceled() || isRejected() || isSlotCancelled(); // ✅ 追加
  const noticeBgClass = isNeutralNotice
    ? "bg-zinc-50 border-zinc-300 text-zinc-800"
    : "bg-yellow-50 border-yellow-400 text-yellow-800";
  const iconColor = isNeutralNotice ? "text-zinc-600" : "text-yellow-600";

  return (
    <div className="p-6">
      <div className="mb-10">
        {shouldShowOperationNotice && (
          <div className={`p-3 rounded-xl border-[1px] ${noticeBgClass} mb-10`}>
            <div className="flex items-start gap-2">
              <Info className={`w-5 h-5 mt-[3px] ${iconColor}`} />
              <div className="flex-1">
                <p className="font-bold leading-6">
                  {/* 色はテキスト全体で反映済み */}操作のご案内
                </p>
                <p className="text-sm mt-1">{operationNoticeText}</p>
              </div>
            </div>
          </div>
        )}
        <h2 className="text-title-lg mb-3">予約者</h2>
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={reservation.createdByUser?.image || ""} />
            <AvatarFallback>{reservation.createdByUser?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-grow flex flex-col justify-center gap-1">
            <p className="text-body-md font-bold">{reservation.createdByUser?.name || "未設定"}</p>
            <p className="inline-flex items-center gap-1 text-muted-foreground text-label-sm">
              <MapPin size="16" />
              {reservation.createdByUser?.currentPrefecture
                ? prefectureLabels[
                    reservation.createdByUser?.currentPrefecture as GqlCurrentPrefecture
                  ]
                : "不明"}
            </p>
          </div>
          <ReservationStatus status={reservation.status} />
        </div>
      </div>

      <div>
        <h2 className="text-title-lg mb-3 mt-10">予約情報</h2>
        {/* ▼ CardWrapper部分：ブロックの外に出す */}
        <Link href={opportunityPagePath} target="_blank">
          <CardWrapper clickable className="overflow-hidden flex items-center h-24 mb-6">
            <Image
              src={opportunity?.images?.[0] ?? PLACEHOLDER_IMAGE}
              alt={opportunity?.title ?? "要確認"}
              width="96"
              height="96"
            />
            <div className="flex flex-col flex-grow p-4">
              <p className="text-body-md font-bold">{opportunity?.title}</p>
              <p className="text-body-sm text-muted-foreground">
                今後{futureSlotsCount}日程で開催予定
              </p>
            </div>
          </CardWrapper>
        </Link>

        <Card className="mt-6 mb-6">
          <CardContent className="flex flex-col flex-wrap text-body-sm gap-4 p-6">
            <p className="inline-flex items-center gap-2 text-body-md">
              <CalendarIcon size={24} />
              {reservation.opportunitySlot?.startsAt &&
                displayDuration(
                  reservation.opportunitySlot.startsAt,
                  reservation.opportunitySlot.endsAt,
                )}
            </p>
            <p className="inline-flex items-center gap-2 text-body-md">
              <User size={24} />
              {reservation.participations?.length ?? 0}名
            </p>
            <p className="inline-flex items-center gap-2 text-body-md">
              <NotepadTextDashed size={24} />
              {reservation.comment?.trim() ? reservation.comment : "コメントはありません"}
            </p>
            <p className="inline-flex items-center gap-2 text-body-md">
              <JapaneseYen size={24} />
              {participationFee.toLocaleString()}円
              <span className="text-label-sm text-muted-foreground">
                ({opportunity?.feeRequired?.toLocaleString() ?? 0}円×
                {participantCount.toLocaleString()}人)
              </span>
            </p>
            <p className="inline-flex items-center gap-2 text-body-md">
              <Phone size={24} />
              {reservation.createdByUser?.phoneNumber ? (
                <a
                  href={`tel:${reservation.createdByUser.phoneNumber}`}
                  className="text-primary hover:underline"
                >
                  {displayPhoneNumber(reservation.createdByUser.phoneNumber)}
                </a>
              ) : (
                "未設定"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {isApplied() && (
        <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 mb-6 bg-background border-t-2 border-b-card">
          <div className="flex flex-col space-y-3">
            <Button className="w-full" size="lg" onClick={handleAccept} disabled={acceptLoading}>
              {acceptLoading ? "処理中..." : "承認する"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full !text-destructive"
                  size="md"
                  variant="text"
                  disabled={rejectLoading}
                >
                  {rejectLoading ? "処理中..." : "応募を断る"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[400px] rounded-sm">
                <DialogHeader>
                  <DialogTitle className="text-left text-body-sm font-bold pb-2">
                    応募をお断りますか？
                  </DialogTitle>
                  <DialogDescription className="text-left">
                    コメントは任意です。空欄の場合、下の定型文が送信されます。
                  </DialogDescription>
                </DialogHeader>

                <Textarea
                  placeholder="今回は日程の都合により申込を辞退させていただきました。またの機会がございましたら、どうぞよろしくお願い致します。"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="min-h-[120px]"
                />

                <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
                  <DialogClose asChild>
                    <Button variant="tertiary" className="w-full py-4">
                      閉じる
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    disabled={rejectLoading}
                    className="w-full py-4"
                  >
                    {rejectLoading ? "送信中..." : "応募を断る"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {canCancelReservation() && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 mb-6 bg-background border-t-2 border-b-card">
              <Button className="w-full" variant="destructive" disabled={cancelLoading}>
                {cancelLoading ? "処理中..." : "開催中止"}
              </Button>
            </div>
          </DialogTrigger>

          <DialogContent className="w-[90vw] max-w-[400px] rounded-sm">
            <DialogHeader>
              <DialogTitle className="text-left text-body-sm font-bold pb-2">
                開催を中止してよろしいですか？
              </DialogTitle>
              <DialogDescription className="text-left">
                中止が確定すると、参加者に通知され、この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button variant="tertiary" className="w-full py-4">
                  閉じる
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="w-full py-4"
              >
                {cancelLoading ? "中止中..." : "開催を中止する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {cannotCancelReservation() && (
        <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 mb-6 bg-background border-t-2 border-b-card">
          <Button variant="destructive" disabled className="w-full">
            中止不可
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            開催24時間以内のため、緊急連絡先よりご連絡下さい。
          </p>
        </div>
      )}
    </div>
  );
}
