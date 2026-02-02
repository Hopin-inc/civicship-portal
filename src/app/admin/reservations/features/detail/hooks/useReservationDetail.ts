import { useMemo, useState } from "react";
import {
  GqlEvaluationStatus,
  GqlOpportunityCategory,
  useGetReservationQuery,
} from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { presentReservationDetail } from "../presenters/presentReservationDetail";
import {
  calculateRequiredPointsForApproval,
  calculateRequiredPointsForAttendance,
  presentReservationPrice,
} from "../presenters/presentReservationPrice";
import { presentPaymentBreakdown } from "../presenters/presentPaymentBreakdown";
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
  const config = useCommunityConfig();
  const communityId = config?.communityId ?? null;
  
  // データ取得
  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: id ?? "" },
  });

  // データ整形
  const { reservation, opportunity, participations, statusMeta } = useMemo(() => {
    if (!data?.reservation) {
      return {
        reservation: null,
        opportunity: null,
        participations: [],
        statusMeta: { label: "", variant: "primary" as const, step: "" },
      };
    }
    return presentReservationDetail(data.reservation, communityId);
  }, [data, communityId]);

  // 料金情報
  const priceInfo = useMemo(() => {
    if (!reservation || !opportunity) return null;
    return presentReservationPrice(reservation, opportunity);
  }, [reservation, opportunity]);

  // 支払い方法の内訳
  const paymentBreakdown = useMemo(() => {
    if (!reservation || !opportunity) return undefined;
    return presentPaymentBreakdown(reservation, opportunity);
  }, [reservation, opportunity]);

  // キャンセル状態
  const cancelState = useCancelState();

  // 承認状態
  const approvalState = useApprovalState();

  // 出席確認状態
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { attendanceData, isSaved, handleAttendanceChange, setIsSaved } =
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
      reservation?.opportunitySlot?.opportunity?.community?.id || communityId,
    );
  };

  // 予約ステータス
  const reservationStatus = useReservationStatus(reservation);

  // 主催者ウォレット
  const { currentPoint: organizerBalance, loading: balanceLoading } = useOrganizerWallet({
    organizerId: opportunity?.createdByUser?.id,
    communityId: opportunity?.community?.id || communityId,
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

  // ポイント計算（Questのみチェック）
  const isQuest = opportunity?.category === GqlOpportunityCategory.Quest;
  const pointsToEarn = opportunity?.pointsToEarn || 0;

  const passedCount = Object.values(attendanceData).filter(
    (status) => status === GqlEvaluationStatus.Passed,
  ).length;

  // Questかつポイント報酬がある場合のみ計算
  const requiredPointsForApproval =
    isQuest && pointsToEarn > 0
      ? calculateRequiredPointsForApproval(priceInfo?.participantCount ?? 0, pointsToEarn)
      : 0;

  const requiredPointsForAttendance =
    isQuest && pointsToEarn > 0
      ? calculateRequiredPointsForAttendance(passedCount, pointsToEarn)
      : 0;

  const isInsufficientBalanceForApproval =
    isQuest &&
    pointsToEarn > 0 &&
    !balanceLoading &&
    organizerBalance < BigInt(requiredPointsForApproval);

  const isInsufficientBalanceForAttendance =
    isQuest &&
    pointsToEarn > 0 &&
    !balanceLoading &&
    organizerBalance < BigInt(requiredPointsForAttendance);

  return {
    // データ
    reservation,
    opportunity,
    participations,
    priceInfo,
    paymentBreakdown,
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
