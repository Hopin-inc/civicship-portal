import { useMemo, useState } from "react";
import { GqlEvaluationStatus, useGetReservationQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presentReservationDetail } from "../presenters/presentReservationDetail";
import {
  presentReservationPrice,
  calculateRequiredPointsForApproval,
  calculateRequiredPointsForAttendance,
} from "../presenters/presentReservationPrice";
import { useReservationApproval } from "./approval/useReservationApproval";
import { useCancelSlot } from "./cancellation/useCancelSlot";
import { useCancelState } from "./cancellation/useCancelState";
import { useReservationStatus } from "./cancellation/useCancelablity";
import { useApprovalState } from "./approval/useApprovalState";
import { useAttendanceState } from "./attendance/useAttendanceState";
import { useSaveAttendances } from "./attendance/useSaveAttendances";
import { useOrganizerWallet } from "./useOrganizerWallet";
import type { ReservationMode } from "../types/mode";

/**
 * 予約詳細ページのロジックを統合したhook
 */
export function useReservationDetail(id: string, mode: ReservationMode | null) {
  // データ取得
  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: id ?? "" },
  });

  // データ整形
  const { reservation, opportunity, participations, activityCard, statusMeta } = useMemo(() => {
    if (!data?.reservation) {
      return {
        reservation: null,
        opportunity: null,
        participations: [],
        activityCard: null,
        statusMeta: { label: "", variant: "default" as const, step: "" },
      };
    }
    return presentReservationDetail(data.reservation);
  }, [data]);

  // 料金情報
  const priceInfo = useMemo(() => {
    if (!reservation || !opportunity) return null;
    return presentReservationPrice(reservation, opportunity);
  }, [reservation, opportunity]);

  // キャンセル状態
  const cancelState = useCancelState();

  // 承認状態
  const approvalState = useApprovalState();

  // 出席確認状態
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
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
      reservation?.opportunitySlot?.opportunity?.community?.id || COMMUNITY_ID,
    );
  };

  // 予約ステータス
  const reservationStatus = useReservationStatus(reservation);

  // 主催者ウォレット
  const { currentPoint: organizerBalance, loading: balanceLoading } = useOrganizerWallet({
    organizerId: opportunity?.createdByUser?.id,
    communityId: opportunity?.community?.id || COMMUNITY_ID,
  });

  // 承認処理
  const reservationApproval = useReservationApproval({
    id: id ?? "",
    reservation,
    opportunity,
    refetch,
  });

  // キャンセル処理
  const cancelSlot = useCancelSlot(reservation, opportunity, cancelState.message, {
    onCompleted: () => {
      void refetch();
    },
  });

  // ポイント計算
  const passedCount = Object.values(attendanceData).filter(
    (status) => status === GqlEvaluationStatus.Passed,
  ).length;

  const requiredPointsForApproval = calculateRequiredPointsForApproval(
    priceInfo?.participantCount ?? 0,
    opportunity?.pointsToEarn || 0,
  );

  const requiredPointsForAttendance = calculateRequiredPointsForAttendance(
    passedCount,
    opportunity?.pointsToEarn || 0,
  );

  const isInsufficientBalanceForApproval =
    !balanceLoading && organizerBalance < BigInt(requiredPointsForApproval);
  const isInsufficientBalanceForAttendance =
    !balanceLoading && organizerBalance < BigInt(requiredPointsForAttendance);

  return {
    // データ
    reservation,
    opportunity,
    participations,
    activityCard,
    priceInfo,
    statusMeta,

    // ローディング・エラー
    loading,
    error,

    // キャンセル
    cancelState,
    cancelSlot,
    reservationStatus,

    // 承認
    approvalState,
    reservationApproval,

    // 出席確認
    attendanceState: {
      attendanceData,
      isSaved,
      allEvaluated,
      handleAttendanceChange,
      setIsSaved,
      isSaving,
      isConfirmDialogOpen,
      setIsConfirmDialogOpen,
      handleSaveAllAttendance,
      batchLoading,
    },

    // 残高チェック
    balanceCheck: {
      organizerBalance,
      balanceLoading,
      requiredPointsForApproval,
      requiredPointsForAttendance,
      isInsufficientBalanceForApproval,
      isInsufficientBalanceForAttendance,
      isApplied: reservationStatus.isApplied(),
    },
  };
}
