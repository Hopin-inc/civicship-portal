import LoadingIndicator from "@/components/shared/LoadingIndicator";
import React from "react";
import { ErrorState } from "@/components/shared/ErrorState";

export type ContentGateProps = {
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
  nullChecks?: { label: string; value: unknown }[];
};

export function ReservationContentGate({
  loading,
  error,
  children,
  nullChecks = [],
}: ContentGateProps) {
  if (loading) return <LoadingIndicator fullScreen={true} />;
  if (error) return <ErrorState message={error.message} />;

  const failedCheck = nullChecks.find((check) => check.value == null || check.value === false);
  if (failedCheck) {
    return <ErrorState message={`${failedCheck.label} が見つかりませんでした`} />;
  }

  return <>{children}</>;
}
