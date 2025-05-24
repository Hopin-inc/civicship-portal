"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_RESERVATION } from "@/graphql/experience/reservation/query";
import { ACCEPT_RESERVATION_MUTATION } from "@/graphql/experience/reservation/mutation";
import { OPPORTUNITY_SLOT_SET_HOSTING_STATUS } from "@/graphql/experience/opportunitySlot/mutation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Card, CardFooter } from "@/components/ui/card";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import dayjs from "dayjs";
import { displayDuration, displayPhoneNumber } from "@/utils";
import { CalendarIcon, JapaneseYen, MapPin, NotepadTextDashed, Phone, User } from "lucide-react";
import { prefectureLabels } from "@/app/users/data/presenter";
import { GqlCurrentPrefecture, GqlOpportunityCategory } from "@/types/graphql";
import { ReservationStatus } from "@/app/admin/reservations/components/ReservationStatus";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ReservationDetailPage() {
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

  const { data, loading, error, refetch } = useQuery(GET_RESERVATION, {
    variables: { id },
  });

  const [acceptReservation, { loading: acceptLoading }] = useMutation(ACCEPT_RESERVATION_MUTATION, {
    onCompleted: () => {
      toast.success("予約を承認しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`承認に失敗しました: ${error.message}`);
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
        toast.error(`中止に失敗しました: ${error.message}`);
      },
    },
  );

  const handleAccept = async () => {
    try {
      await acceptReservation({
        variables: {
          id,
          permission: {
            opportunityId: data?.reservation?.opportunitySlot?.opportunity?.id,
            communityId: data?.reservation?.opportunitySlot?.opportunity?.community?.id || "neo88",
          },
        },
      });
    } catch (e) {}
  };

  const handleCancel = async () => {
    try {
      await cancelSlot({
        variables: {
          id: data?.reservation?.opportunitySlot?.id,
          input: {
            status: "CANCELLED",
          },
          permission: {
            opportunityId: data?.reservation?.opportunitySlot?.opportunity?.id,
            communityId: data?.reservation?.opportunitySlot?.opportunity?.community?.id || "neo88",
          },
        },
      });
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

  const reservation = data?.reservation;
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

  const isWithin7Days = dayjs(reservation?.opportunitySlot?.startsAt).diff(dayjs(), "day") <= 7;
  const futureSlotsCount =
    opportunity?.slots?.filter(
      (slot: any) => dayjs(slot.startsAt).isAfter(dayjs()) && slot.hostingStatus !== "CANCELLED",
    )?.length || 0;
  const opportunityPagePath =
    opportunity.category === GqlOpportunityCategory.Activity
      ? `/activities/${opportunity.id}`
      : opportunity.category === GqlOpportunityCategory.Quest
        ? `/quests/${opportunity.id}`
        : "/";

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-title-md mb-3">予約者</h2>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={reservation.createdByUser?.image || ""} />
            <AvatarFallback>{reservation.createdByUser?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-grow flex flex-col justify-center gap-1">
            <p className="text-label-md">{reservation.createdByUser?.name || "未設定"}</p>
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
        <h2 className="text-title-md mb-3">予約情報</h2>
        <Link href={opportunityPagePath} target="_blank">
          <CardWrapper clickable className="overflow-hidden flex items-center h-24">
            <Image src={opportunity?.images[0]} alt={opportunity?.title} width="96" height="96" />
            <div className="flex flex-col flex-grow p-4">
              <p className="text-body-md">{opportunity?.title}</p>
              <p className="text-body-sm text-muted-foreground">
                今後{futureSlotsCount}日程で開催予定
              </p>
            </div>
          </CardWrapper>
        </Link>
        <div className="flex flex-col flex-wrap text-body-sm gap-4 mt-6">
          <p className="inline-flex items-center gap-2 text-body-md">
            <CalendarIcon size="24" />
            {reservation.opportunitySlot?.startsAt &&
              displayDuration(
                reservation.opportunitySlot.startsAt,
                reservation.opportunitySlot.endsAt,
              )}
          </p>
          <p className="inline-flex items-center gap-2 text-body-md">
            <User size="24" />
            {reservation.participations?.length ?? 0}名
          </p>
          <p className="inline-flex items-center gap-2 text-body-md">
            <NotepadTextDashed size="24" />
            {reservation.comment ?? "コメントはありません"}
          </p>
          <p className="inline-flex items-center gap-2 text-body-md">
            <JapaneseYen size="24" />
            {participationFee.toLocaleString()}円
            <span className="text-label-sm text-muted-foreground">
              ({opportunity?.feeRequired?.toLocaleString() ?? 0}円×
              {participantCount.toLocaleString()}人)
            </span>
          </p>
          <p className="inline-flex items-center gap-2 text-body-md">
            <Phone size="24" />
            {reservation.createdByUser?.phoneNumber
              ? displayPhoneNumber(reservation.createdByUser?.phoneNumber)
              : "未設定"}
          </p>
        </div>
      </div>

      {/* Footer with conditional buttons */}
      {reservation.status === "APPLIED" &&
        reservation.opportunitySlot?.hostingStatus !== "CANCELLED" &&
        reservation.opportunitySlot?.hostingStatus !== "COMPLETED" && (
          <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
            <CardFooter className="p-4">
              <Button className="w-full" onClick={handleAccept} disabled={acceptLoading}>
                {acceptLoading ? "処理中..." : "承認する"}
              </Button>
            </CardFooter>
          </Card>
        )}

      {reservation.status === "ACCEPTED" &&
        !isWithin7Days &&
        reservation.opportunitySlot?.hostingStatus !== "CANCELLED" &&
        reservation.opportunitySlot?.hostingStatus !== "COMPLETED" && (
          <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
            <CardFooter className="p-4">
              <Button
                className="w-full"
                onClick={handleCancel}
                disabled={cancelLoading}
                variant="destructive"
              >
                {cancelLoading ? "処理中..." : "開催中止"}
              </Button>
            </CardFooter>
          </Card>
        )}

      {reservation.status === "ACCEPTED" &&
        isWithin7Days &&
        reservation.opportunitySlot?.hostingStatus !== "CANCELLED" &&
        reservation.opportunitySlot?.hostingStatus !== "COMPLETED" && (
          <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
            <CardFooter className="p-4">
              <Button variant="destructive" disabled className="w-full">
                中止不可
              </Button>
            </CardFooter>
          </Card>
        )}
    </div>
  );
}
