"use client";

import React, { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { displayDuration, displayPhoneNumber } from "@/utils";
import { CalendarIcon, JapaneseYen, Phone, User } from "lucide-react";
import { GqlReservation, useGetReservationQuery } from "@/types/graphql";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { cn } from "@/lib/utils";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import getReservationStatusMeta from "@/app/admin/reservations/hooks/useGetReservationStatusMeta";
import NotFound from "@/app/not-found";
import { useReservationApproval } from "@/app/admin/reservations/[id]/approval/hooks/useReservationApproval";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useReservationStatus } from "../cancellation/hooks/useCancelablity";
import { useApprovalState } from "@/app/admin/reservations/[id]/approval/hooks/useApprovalState";

export default function ReservationApprovalPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const headerConfig = useMemo(
    () => ({
      title: `新規申込の対応`,
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/reservations",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const {
    isAcceptSheetOpen,
    setIsAcceptSheetOpen,
    isRejectSheetOpen,
    setIsRejectSheetOpen,
    editable,
    setEditable,
    message,
    setMessage,
    DEFAULT_MESSAGE,
  } = useApprovalState();

  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: id ?? "" },
  });
  const reservation: GqlReservation | undefined | null = data?.reservation;
  const opportunity = reservation?.opportunitySlot?.opportunity;

  const { isApplied } = useReservationStatus(reservation);

  const { handleAccept, handleReject, acceptLoading, rejectLoading } = useReservationApproval({
    id: id ?? "",
    reservation,
    opportunity,
    refetch,
  });

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
        <ErrorState title="申込情報の取得に失敗しました" />
      </div>
    );
  }

  if (!reservation || !opportunity) {
    return (
      <div className="p-4 pt-16">
        <NotFound titleTarget="申込" />
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
        <h2 className="text-title-sm font-bold mb-3">申込者</h2>
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

        <h2 className="text-title-sm font-bold mb-3">申込内容</h2>
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

      {isApplied() && (
        <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-6 bg-background border-t-2 border-b-card space-y-3">
          <Sheet open={isAcceptSheetOpen} onOpenChange={setIsAcceptSheetOpen}>
            <SheetTrigger asChild>
              <Button className="w-full" variant="primary" size={"lg"}>
                申込を承認する
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
              <SheetHeader className="text-left pb-6">
                <SheetTitle>申し込みを承認してよろしいですか？</SheetTitle>
                <SheetDescription>
                  一度承認すると、あとから取り消すことはできません。
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-3">
                <Button onClick={handleAccept} disabled={acceptLoading} className="w-full py-4">
                  {acceptLoading ? "処理中..." : "承認する"}
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setIsAcceptSheetOpen(false)}
                  className="w-full py-4"
                >
                  閉じる
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={isRejectSheetOpen} onOpenChange={setIsRejectSheetOpen}>
            <SheetTrigger asChild>
              <Button className="w-full !text-destructive" variant="text">
                申込をお断りする
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
              <SheetHeader className="text-left pb-6">
                <SheetTitle>申し込みをお断りしますか？</SheetTitle>
                <SheetDescription>
                  申し込みをお断りすると申込者に通知され、あとから取り消すことはできません。
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
                  onClick={() => handleReject(message)}
                  disabled={rejectLoading}
                  variant="destructive"
                  className="w-full py-4"
                >
                  {rejectLoading ? "送信中..." : "申込をお断りする"}
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setIsRejectSheetOpen(false)}
                  className="w-full py-4"
                >
                  閉じる
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
