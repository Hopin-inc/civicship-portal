"use client";

import React, { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlEvaluationStatus, GqlParticipation, useGetReservationQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import getReservationStatusMeta from "../features/detail/hooks/useGetReservationStatusMeta";
import NotFound from "@/app/not-found";
import { useReservationApproval } from "../features/detail/hooks/approval/useReservationApproval";
import { useCancelSlot } from "../features/detail/hooks/cancellation/useCancelSlot";
import { useCancelState } from "../features/detail/hooks/cancellation/useCancelState";
import { useReservationStatus } from "../features/detail/hooks/cancellation/useCancelablity";
import { useApprovalState } from "../features/detail/hooks/approval/useApprovalState";
import AdminReservationDetails from "../features/detail/components/AdminReservationDetail";
import CancelReservationSheet from "../features/detail/components/CancelReservationSheet";
import ApprovalSheet from "../features/detail/components/ApprovalSheet";
import AttendanceSheet from "../features/detail/components/AttendanceSheet";
import { useAttendanceState } from "../features/detail/hooks/attendance/useAttendanceState";
import { useSaveAttendances } from "../features/detail/hooks/attendance/useSaveAttendances";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { PriceInfo } from "@/app/admin/reservations/types";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";
import { useOrganizerWallet } from "../features/detail/hooks/useOrganizerWallet";
import { InsufficientBalanceNotice } from "../features/detail/components/InsufficientBalanceNotice";

export default function ReservationPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");

  const mode = useMemo(() => {
    if (modeParam === "approval" || modeParam === "attendance" || modeParam === "cancellation") {
      return modeParam;
    }
    return null;
  }, [modeParam]);

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

  // Renamed states to avoid conflicts
  const {
    isSheetOpen: isCancelSheetOpen,
    setIsSheetOpen: setIsCancelSheetOpen,
    editable: cancelEditable,
    setEditable: setCancelEditable,
    message: cancelMessage,
    setMessage: setCancelMessage,
    DEFAULT_MESSAGE: CANCEL_DEFAULT_MESSAGE,
  } = useCancelState();

  const {
    isAcceptSheetOpen,
    setIsAcceptSheetOpen,
    isRejectSheetOpen,
    setIsRejectSheetOpen,
    editable: approvalEditable,
    setEditable: setApprovalEditable,
    message: approvalMessage,
    setMessage: setApprovalMessage,
    DEFAULT_MESSAGE: APPROVAL_DEFAULT_MESSAGE,
  } = useApprovalState();

  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: id ?? "" },
  });

  const reservation = data?.reservation;
  const opportunity = reservation?.opportunitySlot?.opportunity;
  const slot = reservation?.opportunitySlot;

  const participations = (reservation?.participations ?? []).filter(
    (p): p is GqlParticipation & { user: NonNullable<GqlParticipation["user"]> } => !!p.user,
  );

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
      slot?.opportunity?.community?.id || COMMUNITY_ID,
    );
  };

  const { isApplied } = useReservationStatus(reservation);

  const { currentPoint: organizerBalance, loading: balanceLoading } = useOrganizerWallet({
    organizerId: opportunity?.createdByUser?.id,
    communityId: opportunity?.community?.id || COMMUNITY_ID,
  });

  const { handleAccept, handleReject, acceptLoading, rejectLoading } = useReservationApproval({
    id: id ?? "",
    reservation,
    opportunity,
    refetch,
  });

  const { canCancelReservation, cannotCancelReservation } = useReservationStatus(reservation);

  const { handleCancel, loading: cancelLoading } = useCancelSlot(
    reservation,
    opportunity,
    cancelMessage,
    {
      onCompleted: () => {
        void refetch();
      },
    },
  );

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
  const feeRequired = opportunity.feeRequired ?? 0;
  const pointsRequired = opportunity.pointsRequired ?? 0;
  const pointsToEarn = opportunity.pointsToEarn ?? 0;
  const participationFee = feeRequired * participantCount;
  const totalPointsRequired = pointsRequired * participantCount;
  const totalPointsToEarn = pointsToEarn * participantCount;
  const isPointsOnly = isPointsOnlyOpportunity(feeRequired, pointsRequired);

  const passedCount = Object.values(attendanceData).filter(
    (status) => status === GqlEvaluationStatus.Passed,
  ).length;

  const requiredPointsForApproval = participantCount * (opportunity?.pointsToEarn || 0);
  const requiredPointsForAttendance = passedCount * (opportunity?.pointsToEarn || 0);

  const isInsufficientBalanceForApproval =
    !balanceLoading && organizerBalance < BigInt(requiredPointsForApproval);
  const isInsufficientBalanceForAttendance =
    !balanceLoading && organizerBalance < BigInt(requiredPointsForAttendance);

  const priceInfo: PriceInfo = {
    participationFee,
    participantCount,
    pointsRequired,
    totalPointsRequired,
    isPointsOnly,
    category: opportunity.category,
    pointsToEarn,
    totalPointsToEarn,
  };

  const { label, variant } = getReservationStatusMeta(reservation);

  return (
    <div className="p-6">
      <InsufficientBalanceNotice
        mode={mode}
        isApplied={isApplied()}
        isInsufficientBalanceForApproval={isInsufficientBalanceForApproval}
        isInsufficientBalanceForAttendance={isInsufficientBalanceForAttendance}
        requiredPointsForApproval={requiredPointsForApproval}
        requiredPointsForAttendance={requiredPointsForAttendance}
        organizerBalance={organizerBalance}
      />

      <div>
        <AdminReservationDetails
          reservation={reservation}
          activityCard={activityCard}
          priceInfo={priceInfo}
          label={label}
          variant={variant}
        />
      </div>

      {mode === "approval" && (
        <ApprovalSheet
          isApplied={isApplied()}
          isAcceptSheetOpen={isAcceptSheetOpen}
          setIsAcceptSheetOpen={setIsAcceptSheetOpen}
          isRejectSheetOpen={isRejectSheetOpen}
          setIsRejectSheetOpen={setIsRejectSheetOpen}
          acceptLoading={acceptLoading}
          rejectLoading={rejectLoading}
          handleAccept={handleAccept}
          handleReject={handleReject}
          editable={approvalEditable}
          setEditable={setApprovalEditable}
          message={approvalMessage}
          setMessage={setApprovalMessage}
          DEFAULT_MESSAGE={APPROVAL_DEFAULT_MESSAGE}
        />
      )}

      {mode === "cancellation" && (
        <CancelReservationSheet
          canCancelReservation={canCancelReservation()}
          isSheetOpen={isCancelSheetOpen}
          setIsSheetOpen={setIsCancelSheetOpen}
          cancelLoading={cancelLoading}
          handleCancel={handleCancel}
          editable={cancelEditable}
          setEditable={setCancelEditable}
          message={cancelMessage}
          setMessage={setCancelMessage}
          DEFAULT_MESSAGE={CANCEL_DEFAULT_MESSAGE}
          cannotCancelReservation={cannotCancelReservation()}
        />
      )}

      {mode === "attendance" && (
        <AttendanceSheet
          participations={participations}
          attendanceData={attendanceData}
          handleAttendanceChange={handleAttendanceChange}
          isSaved={isSaved}
          isSaving={isSaving}
          batchLoading={batchLoading}
          isConfirmDialogOpen={isConfirmDialogOpen}
          setIsConfirmDialogOpen={setIsConfirmDialogOpen}
          handleSaveAllAttendance={handleSaveAllAttendance}
          allEvaluated={allEvaluated}
          opportunity={opportunity}
          isInsufficientBalance={isInsufficientBalanceForAttendance}
        />
      )}
    </div>
  );
}
