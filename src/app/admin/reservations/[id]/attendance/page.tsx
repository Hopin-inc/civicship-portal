"use client";

import React, { useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarIcon, JapaneseYen, Phone, User } from "lucide-react";
import { GqlEvaluationStatus, GqlParticipation, useGetReservationQuery } from "@/types/graphql";
import { cn } from "@/lib/utils";
import { displayDuration, displayPhoneNumber } from "@/utils";
import { useParams } from "next/navigation";
import { useAttendanceState } from "@/app/admin/reservations/[id]/attendance/hooks/useAttendanceState";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import getReservationStatusMeta from "@/app/admin/reservations/hooks/useGetReservationStatusMeta";
import { Badge } from "@/components/ui/badge";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { useSaveAttendances } from "@/app/admin/reservations/[id]/attendance/hooks/useSaveAttendances";

export default function SlotDetailPage() {
  const params = useParams();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";
  const headerConfig = useMemo(
    () => ({
      title: `出欠の入力`,
      showLogo: false,
      showBackButton: true,
      backTo: "/admin/reservations",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: id ?? "" },
  });
  const reservation = data?.reservation;
  const opportunity = reservation?.opportunitySlot?.opportunity;
  const participations = data?.reservation?.participations ?? [];
  const slot = data?.reservation?.opportunitySlot;

  const { attendanceData, isSaved, allEvaluated, handleAttendanceChange, setIsSaved } =
    useAttendanceState(participations);

  const { save: saveAttendances, loading: batchLoading } = useSaveAttendances({
    onSuccess: () => {
      setIsSaved(true);
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const handleSaveAllAttendance = async () => {
    setIsSaving(true);
    setIsConfirmDialogOpen(false);

    await saveAttendances(
      participations,
      attendanceData,
      slot?.opportunity?.community?.id || "neo88",
    );
  };

  if (loading && participations.length === 0) {
    return (
      <div className="p-4 pt-16 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="開催日程の取得に失敗しました" />
      </div>
    );
  }

  if (!reservation || !opportunity || !slot) {
    return (
      <div className="p-4 pt-16">
        <ErrorState title="開催日程が見つかりません" />
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
            "inline-flex items-center text-body-md mb-10",
            !reservation.comment?.trim() && "text-muted-foreground",
          )}
        >
          {reservation.comment?.trim() ? reservation.comment : "コメントはありません"}
        </p>
      </div>

      <h2 className="text-title-sm font-bold mb-3">参加者</h2>
      {participations.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">参加者が見つかりません</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          {participations.map((participation: GqlParticipation, index: number) => (
            <Card
              key={participation.id}
              className={cn(
                "transition-colors",
                index !== participations.length - 1 && "border-b rounded-none",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  <Avatar>
                    <AvatarImage src={participation.user?.image || ""} />
                    <AvatarFallback>{participation.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-base truncate">
                    {participation.user?.name || "未設定"}
                  </CardTitle>
                </div>

                {/* 出欠トグル */}
                <ToggleGroup
                  type="single"
                  orientation="vertical"
                  value={attendanceData[participation.id] || GqlEvaluationStatus.Pending}
                  onValueChange={(value) => {
                    if (value)
                      handleAttendanceChange(participation.id, value as GqlEvaluationStatus);
                  }}
                  disabled={
                    isSaved ||
                    isSaving ||
                    batchLoading ||
                    (participation.evaluation !== null && participation.evaluation !== undefined)
                  }
                  className="flex-shrink-0"
                >
                  <ToggleGroupItem value={GqlEvaluationStatus.Passed} aria-label="参加">
                    参加
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={GqlEvaluationStatus.Failed}
                    color="danger"
                    aria-label="不参加"
                  >
                    不参加
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardHeader>
            </Card>
          ))}

          <Sheet open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <SheetTrigger asChild>
              {participations.length > 0 && !isSaved && (
                <div className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto p-4 bg-background border-t-2 border-b-card space-y-3 z-50">
                  <Button className="w-full py-4" disabled={isSaving || allEvaluated} size="lg">
                    {isSaving ? "保存中..." : allEvaluated ? "すべて対応済み" : "出欠を保存する"}
                  </Button>
                </div>
              )}
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-8">
              <SheetHeader className="text-left pb-6">
                <SheetTitle>出欠情報を保存しますか？</SheetTitle>
                <SheetDescription>
                  保存後は編集できなくなります。本当に保存してよろしいですか？
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-3 mt-4">
                <Button
                  onClick={handleSaveAllAttendance}
                  disabled={isSaving}
                  size={"lg"}
                  className="w-full py-4"
                  variant="primary"
                >
                  {isSaving ? "保存中..." : "保存する"}
                </Button>
                <Button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  variant="tertiary"
                  className="w-full py-4"
                >
                  キャンセル
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
