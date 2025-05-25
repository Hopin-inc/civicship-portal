"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlReservation, useGetReservationQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { CalendarIcon, JapaneseYen, Phone, User } from "lucide-react";
import { displayDuration, displayPhoneNumber } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import getReservationStatusMeta from "@/app/admin/reservations/hooks/useGetReservationStatusMeta";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import NotFound from "@/app/not-found";
import { useCancelSlot } from "@/app/admin/reservations/[id]/cancellation/hooks/useCancelSlot";
import { useCancelState } from "@/app/admin/reservations/[id]/cancellation/hooks/useCancelState";
import { useReservationStatus } from "@/app/admin/reservations/[id]/cancellation/hooks/useCancelablity";

export default function ReservationCancellationPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const headerConfig = useMemo(
    () => ({
      title: `予約詳細`,
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/reservations",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const {
    isSheetOpen,
    setIsSheetOpen,
    editable,
    setEditable,
    message,
    setMessage,
    DEFAULT_MESSAGE,
  } = useCancelState();

  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: id ?? "" },
  });

  const reservation: GqlReservation | undefined | null = data?.reservation;
  const opportunity = reservation?.opportunitySlot?.opportunity;

  const { canCancelReservation, cannotCancelReservation } = useReservationStatus(reservation);

  const { handleCancel, loading: cancelLoading } = useCancelSlot(reservation, opportunity, {
    onCompleted: () => {
      void refetch();
    },
  });

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="予約情報を読み込めませんでした" />
      </div>
    );
  }

  if (!reservation || !opportunity) {
    return (
      <div className="p-4 pt-16">
        <NotFound titleTarget="予約" />
      </div>
    );
  }

  const activityCard = presenterActivityCard(opportunity);
  const participantCount = reservation.participations?.length || 0;
  const participationFee = (opportunity.feeRequired || 0) * participantCount;

  const { label, variant } = getReservationStatusMeta(reservation);

  return (
    <div className="p-6 mt-4">
      <div>
        <h2 className="text-title-sm font-bold mb-3">予約者</h2>
        <Card className="mb-10 shadow-none border-0">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-grow min-w-0">
              <Avatar>
                <AvatarImage src={reservation.createdByUser?.image || ""} />
                <AvatarFallback>{reservation.createdByUser?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base truncate">
                {reservation.createdByUser?.name || "未設定"}
              </CardTitle>
            </div>
            <div className="flex-shrink-0">
              <Badge variant={variant}>{label}</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {reservation.createdByUser?.bio?.trim() && (
              <p className="inline-flex items-center text-body-md">
                {reservation.createdByUser.bio}
              </p>
            )}

            <p className="inline-flex items-center gap-2 text-body-md">
              {reservation.createdByUser?.phoneNumber ? (
                <>
                  <Phone size={24} />
                  <a
                    href={`tel:${reservation.createdByUser.phoneNumber}`}
                    className="text-primary hover:underline"
                  >
                    {displayPhoneNumber(reservation.createdByUser.phoneNumber)}
                  </a>
                </>
              ) : (
                "未設定"
              )}
            </p>
          </CardContent>
        </Card>

        <h2 className="text-title-sm font-bold mb-3">予約内容</h2>
        <Card className="mb-10 shadow-none border-0">
          <CardHeader>
            <OpportunityCardHorizontal
              opportunity={activityCard}
              withShadow={false}
            ></OpportunityCardHorizontal>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
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
              <JapaneseYen size={24} />
              {participationFee.toLocaleString()}円
              <span className="text-label-sm text-muted-foreground">
                ({opportunity.feeRequired?.toLocaleString() ?? 0}円×
                {participantCount.toLocaleString()}人)
              </span>
            </p>
          </CardContent>
        </Card>

        <h2 className="text-title-sm font-bold mb-3">コメント</h2>
        <p
          className={cn(
            "inline-flex items-center text-body-md",
            !reservation.comment?.trim() && "text-muted-foreground",
          )}
        >
          {reservation.comment?.trim() ? reservation.comment : "コメントはありません"}
        </p>
      </div>

      {canCancelReservation() && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 min-h-[140px]">
              <Button className="w-full" size="lg" variant="destructive" disabled={cancelLoading}>
                {cancelLoading ? "処理中..." : "開催中止"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                開催の24時間前まで、アプリから中止操作が可能です。
              </p>
            </div>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
            <SheetHeader className="text-left pb-6">
              <SheetTitle>開催を中止してよろしいですか？</SheetTitle>
              <SheetDescription>
                開催を中止すると予約者に通知され、あとから取り消すことはできません。
              </SheetDescription>
            </SheetHeader>

            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="edit-message" className="text-sm">
                メッセージを編集する
              </label>
              <Switch id="edit-message" checked={editable} onCheckedChange={setEditable} />
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={DEFAULT_MESSAGE}
              disabled={!editable}
              className="min-h-[120px] mb-6"
            ></Textarea>

            <div className="space-y-3">
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="w-full py-4"
              >
                {cancelLoading ? "中止中..." : "開催を中止する"}
              </Button>
              <Button
                variant="tertiary"
                onClick={() => setIsSheetOpen(false)}
                className="w-full py-4"
              >
                閉じる
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {cannotCancelReservation() && (
        <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 min-h-[140px]">
          <Button variant="destructive" disabled className="w-full">
            中止不可
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            開催24時間以内のため、電話番号よりご連絡下さい。
          </p>
        </div>
      )}
    </div>
  );
}
