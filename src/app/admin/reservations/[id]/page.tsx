"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RESERVATION } from "@/graphql/experience/reservation/query";
import { ACCEPT_RESERVATION_MUTATION } from "@/graphql/experience/reservation/mutation";
import { OPPORTUNITY_SLOT_SET_HOSTING_STATUS } from "@/graphql/experience/opportunitySlot/mutation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Card, CardFooter } from "@/components/ui/card";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const headerConfig = useMemo(() => ({
    title: `予約詳細`,
    showBackButton: true,
    backTo: "/admin/reservations",
    hideBottomBar: true, // Hide the BottomBar
  }), []);
  useHeaderConfig(headerConfig);

  const { data, loading, error, refetch } = useQuery(GET_RESERVATION, {
    variables: { id: params.id },
  });

  const [acceptReservation, { loading: acceptLoading }] = useMutation(ACCEPT_RESERVATION_MUTATION, {
    onCompleted: () => {
      toast.success("予約を承認しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`承認に失敗しました: ${ error.message }`);
    },
  });

  const [cancelSlot, { loading: cancelLoading }] = useMutation(OPPORTUNITY_SLOT_SET_HOSTING_STATUS, {
    onCompleted: () => {
      toast.success("開催を中止しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`中止に失敗しました: ${ error.message }`);
    },
  });

  const handleAccept = async () => {
    try {
      await acceptReservation({
        variables: {
          id: params.id,
          permission: {
            communityId: data?.reservation?.opportunitySlot?.opportunity?.community?.id || "neo88",
          },
        },
      });
    } catch (e) {
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSlot({
        variables: {
          id: data?.reservation?.opportunitySlot?.id,
          input: {
            hostingStatus: "CANCELLED",
          },
          permission: {
            opportunityId: data?.reservation?.opportunitySlot?.opportunity?.id,
          },
        },
      });
    } catch (e) {
    }
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
        <ErrorState message="予約情報の取得に失敗しました" />
      </div>
    );
  }

  const reservation = data?.reservation;
  if (!reservation) {
    return (
      <div className="p-4 pt-16">
        <ErrorState message="予約が見つかりません" />
      </div>
    );
  }

  const opportunity = reservation?.opportunitySlot?.opportunity;
  const participantCount = reservation?.participations?.length || 0;
  const participationFee = (opportunity?.feeRequired || 0) * participantCount;

  const isWithin7Days = dayjs(reservation?.opportunitySlot?.startsAt).diff(dayjs(), "day") <= 7;
  const futureSlotsCount = opportunity?.slots?.filter((slot: any) =>
    dayjs(slot.startsAt).isAfter(dayjs()) && slot.hostingStatus !== "CANCELLED",
  )?.length || 0;

  return (
    <div className="p-4 pt-16 pb-24">
      <CardWrapper className="p-4 mb-4">
        <h1 className="text-xl font-bold mb-4">予約詳細</h1>

        {/* 予約者情報 */ }
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">予約者</h2>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={ reservation.createdByUser?.image || "" } />
              <AvatarFallback>{ reservation.createdByUser?.name?.[0] || "U" }</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{ reservation.createdByUser?.name || "未設定" }</p>
              <p className="text-sm text-muted-foreground">{ reservation.createdByUser?.currentPrefecture || "不明" }</p>
            </div>
          </div>
        </div>

        {/* 予約ステータス */ }
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">予約ステータス</h2>
          <p className="px-3 py-1 bg-secondary inline-block rounded-full">{ reservation.status }</p>
        </div>

        {/* 予約情報 */ }
        <div>
          <h2 className="font-semibold text-lg mb-2">予約情報</h2>
          <div className="space-y-2">
            <p><span className="font-medium">機会:</span> { opportunity?.title }</p>
            <p><span className="font-medium">機会の日程:</span> 今後 { futureSlotsCount } 件</p>
            <p><span
              className="font-medium">予約した日程:</span> { dayjs(reservation.opportunitySlot?.startsAt).format("YYYY/MM/DD HH:mm") } 〜 { dayjs(reservation.opportunitySlot?.endsAt).format("HH:mm") }
            </p>
            <p><span className="font-medium">参加人数:</span> { participantCount }名</p>
            <p><span
              className="font-medium">参加費:</span> { opportunity?.feeRequired || 0 } × { participantCount } = { participationFee }円
            </p>
            <p><span className="font-medium">緊急連絡先:</span> { reservation.createdByUser?.phoneNumber || "未設定" }</p>
          </div>
        </div>
      </CardWrapper>

      {/* Footer with conditional buttons */ }
      { reservation.status === "APPLIED" && 
        reservation.opportunitySlot?.hostingStatus !== "CANCELLED" && 
        reservation.opportunitySlot?.hostingStatus !== "COMPLETED" && (
        <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
          <CardFooter className="p-4">
            <Button
              className="w-full"
              onClick={ handleAccept }
              disabled={ acceptLoading }
            >
              { acceptLoading ? "処理中..." : "承認する" }
            </Button>
          </CardFooter>
        </Card>
      ) }

      { reservation.status === "ACCEPTED" && !isWithin7Days && 
        reservation.opportunitySlot?.hostingStatus !== "CANCELLED" && 
        reservation.opportunitySlot?.hostingStatus !== "COMPLETED" && (
        <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
          <CardFooter className="p-4">
            <Button
              className="w-full"
              onClick={ handleCancel }
              disabled={ cancelLoading }
              variant="destructive"
            >
              { cancelLoading ? "処理中..." : "開催中止" }
            </Button>
          </CardFooter>
        </Card>
      ) }

      { reservation.status === "ACCEPTED" && isWithin7Days && 
        reservation.opportunitySlot?.hostingStatus !== "CANCELLED" && 
        reservation.opportunitySlot?.hostingStatus !== "COMPLETED" && (
        <Card className="fixed bottom-0 left-0 right-0 max-w-mobile-l mx-auto">
          <CardFooter className="p-4">
            <Button variant="destructive" disabled className="w-full">
              中止不可
            </Button>
          </CardFooter>
        </Card>
      ) }
    </div>
  );
}
