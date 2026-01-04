"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import NotFound from "@/app/not-found";
import AdminReservationDetails from "../features/detail/components/AdminReservationDetail";
import CancelReservationSheet from "../features/detail/components/CancelReservationSheet";
import ApprovalSheet from "../features/detail/components/ApprovalSheet";
import AttendanceSheet from "../features/detail/components/AttendanceSheet";
import { InsufficientBalanceNotice } from "../features/detail/components/InsufficientBalanceNotice";
import { useReservationDetail } from "../features/detail/hooks/useReservationDetail";
import { isReservationMode } from "../features/detail/types/mode";

export default function ReservationPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");

  const mode = useMemo(() => {
    if (modeParam && isReservationMode(modeParam)) {
      return modeParam;
    }
    return null;
  }, [modeParam]);

  const headerConfig = useMemo(
    () => ({
      title: "予約詳細",
      showBackButton: true,
      showLogo: false,
      backTo: "/admin/reservations",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const {
    reservation,
    opportunity,
    priceInfo,
    paymentBreakdown,
    statusMeta,
    loading,
    error,
    cancelState,
    cancelSlot,
    reservationStatus,
    approvalState,
    reservationApproval,
    attendanceState,
    balanceCheck,
  } = useReservationDetail(id ?? "", mode);

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

  if (!reservation || !opportunity || !priceInfo) {
    return (
      <div className="p-4 pt-16">
        <NotFound />
      </div>
    );
  }

  return (
    <div className="p-6">
      <InsufficientBalanceNotice
        mode={mode}
        isApplied={balanceCheck.isApplied}
        isInsufficientBalanceForApproval={balanceCheck.isInsufficientBalanceForApproval}
        isInsufficientBalanceForAttendance={balanceCheck.isInsufficientBalanceForAttendance}
        requiredPointsForApproval={balanceCheck.requiredPointsForApproval}
        requiredPointsForAttendance={balanceCheck.requiredPointsForAttendance}
        organizerBalance={balanceCheck.organizerBalance}
        showAttendanceInfo={mode === "attendance"}
        opportunity={opportunity}
      />

      <div>
        <AdminReservationDetails
          reservation={reservation}
          priceInfo={priceInfo}
          paymentBreakdown={paymentBreakdown}
          label={statusMeta.label}
          variant={statusMeta.variant}
        />
      </div>

      {mode === "approval" && (
        <ApprovalSheet
          isApplied={balanceCheck.isApplied}
          isAcceptSheetOpen={approvalState.isAcceptSheetOpen}
          setIsAcceptSheetOpen={approvalState.setIsAcceptSheetOpen}
          isRejectSheetOpen={approvalState.isRejectSheetOpen}
          setIsRejectSheetOpen={approvalState.setIsRejectSheetOpen}
          acceptLoading={reservationApproval.acceptLoading}
          rejectLoading={reservationApproval.rejectLoading}
          handleAccept={reservationApproval.handleAccept}
          handleReject={reservationApproval.handleReject}
          editable={approvalState.editable}
          setEditable={approvalState.setEditable}
          message={approvalState.message}
          setMessage={approvalState.setMessage}
          DEFAULT_MESSAGE={approvalState.DEFAULT_MESSAGE}
        />
      )}

      {mode === "cancellation" && (
        <CancelReservationSheet
          canCancelReservation={reservationStatus.canCancelReservation()}
          isSheetOpen={cancelState.isSheetOpen}
          setIsSheetOpen={cancelState.setIsSheetOpen}
          cancelLoading={cancelSlot.loading}
          handleCancel={cancelSlot.handleCancel}
          editable={cancelState.editable}
          setEditable={cancelState.setEditable}
          message={cancelState.message}
          setMessage={cancelState.setMessage}
          DEFAULT_MESSAGE={cancelState.DEFAULT_MESSAGE}
          cannotCancelReservation={reservationStatus.cannotCancelReservation()}
        />
      )}

      {mode === "attendance" && (
        <AttendanceSheet
          participations={reservation.participations ?? []}
          attendanceData={attendanceState.attendanceData}
          handleAttendanceChange={attendanceState.handleAttendanceChange}
          isSaved={attendanceState.isSaved}
          isSaving={attendanceState.isSaving}
          batchLoading={attendanceState.batchLoading}
          isConfirmDialogOpen={attendanceState.isConfirmDialogOpen}
          setIsConfirmDialogOpen={attendanceState.setIsConfirmDialogOpen}
          handleSaveAllAttendance={attendanceState.handleSaveAllAttendance}
          opportunity={opportunity}
          isInsufficientBalance={balanceCheck.isInsufficientBalanceForAttendance}
        />
      )}
    </div>
  );
}
