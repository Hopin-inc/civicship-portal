"use client";

import React, { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlParticipation, useGetReservationQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import getReservationStatusMeta from "@/app/admin/reservations/hooks/useGetReservationStatusMeta";
import NotFound from "@/app/not-found";
import { useReservationApproval } from "@/app/admin/reservations/hooks/approval/useReservationApproval";
import { useCancelSlot } from "@/app/admin/reservations/hooks/cancellation/useCancelSlot";
import { useCancelState } from "@/app/admin/reservations/hooks/cancellation/useCancelState";
import { useReservationStatus } from "@/app/admin/reservations/hooks/cancellation/useCancelablity";
import { useApprovalState } from "@/app/admin/reservations/hooks/approval/useApprovalState";
import AdminReservationDetails from "@/app/admin/reservations/[id]/components/AdminReservationDetail";
import CancelReservationSheet from "@/app/admin/reservations/components/CancelReservationSheet";
import ApprovalSheet from "@/app/admin/reservations/components/ApprovalSheet";
import AttendanceSheet from "@/app/admin/reservations/components/AttendanceSheet";
import { useAttendanceState } from "@/app/admin/reservations/hooks/attendance/useAttendanceState";
import { useSaveAttendances } from "@/app/admin/reservations/hooks/attendance/useSaveAttendances";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { PriceInfo } from "@/app/admin/reservations/types";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

export default function ReservationPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

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
  const participationFee = feeRequired * participantCount;
  const totalPointsRequired = pointsRequired * participantCount;
  const isPointsOnly = isPointsOnlyOpportunity(feeRequired, pointsRequired);

  const priceInfo = {
    participationFee,
    participantCount,
    pointsRequired,
    totalPointsRequired,
    isPointsOnly,
  };

  const { label, variant } = getReservationStatusMeta(reservation);

  return (
    <div className="p-6 mt-4">
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
        />
      )}
    </div>
  );
}
