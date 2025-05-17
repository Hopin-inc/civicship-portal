"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RESERVATION } from "@/graphql/experience/reservation/query";
import { ACCEPT_RESERVATION_MUTATION } from "@/graphql/experience/reservation/mutation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { toast } from "sonner";

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const headerConfig = useMemo(() => ({
    title: `応募 ${params.id}`,
    showBackButton: true,
    backTo: "/admin/reservations",
  }), [params.id]);
  useHeaderConfig(headerConfig);

  const { data, loading, error, refetch } = useQuery(GET_RESERVATION, {
    variables: { id: params.id },
  });

  const [acceptReservation, { loading: acceptLoading }] = useMutation(ACCEPT_RESERVATION_MUTATION, {
    onCompleted: () => {
      toast.success("応募を承認しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`承認に失敗しました: ${error.message}`);
    },
  });

  const handleAccept = async () => {
    try {
      await acceptReservation({
        variables: { id: params.id },
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
        <ErrorState message="応募情報の取得に失敗しました" />
      </div>
    );
  }

  const reservation = data?.reservation;
  if (!reservation) {
    return (
      <div className="p-4 pt-16">
        <ErrorState message="応募が見つかりません" />
      </div>
    );
  }

  return (
    <div className="p-4 pt-16">
      <CardWrapper className="p-4 mb-4">
        <h1 className="text-xl font-bold mb-2">応募詳細</h1>
        <div className="space-y-2">
          <p><span className="font-medium">ID:</span> {reservation.id}</p>
          <p><span className="font-medium">ステータス:</span> {reservation.status}</p>
          <p><span className="font-medium">作成日:</span> {new Date(reservation.createdAt).toLocaleDateString('ja-JP')}</p>
          
          {reservation.opportunitySlot && (
            <>
              <p className="font-medium mt-4">イベント情報:</p>
              <p className="ml-2">{reservation.opportunitySlot.opportunity?.title}</p>
              <p className="ml-2 text-sm text-muted-foreground">
                {new Date(reservation.opportunitySlot.startAt).toLocaleDateString('ja-JP')} 〜 {new Date(reservation.opportunitySlot.endAt).toLocaleDateString('ja-JP')}
              </p>
            </>
          )}
          
          {reservation.status === 'PENDING' && (
            <div className="mt-4">
              <Button
                onClick={handleAccept}
                disabled={acceptLoading}
              >
                {acceptLoading ? '処理中...' : '承認する'}
              </Button>
            </div>
          )}
        </div>
      </CardWrapper>
    </div>
  );
}
