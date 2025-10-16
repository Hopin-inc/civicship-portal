import { useMemo } from "react";

interface UseReservationValidationProps {
  creatingReservation: boolean;
  useTickets: boolean;
  ticketCount: number;
  maxTickets: number;
  hasInsufficientPoints: boolean;
}

interface ReservationValidation {
  isButtonDisabled: boolean;
  disabledReason: string | null;
}

export function useReservationValidation({
  creatingReservation,
  useTickets,
  ticketCount,
  maxTickets,
  hasInsufficientPoints,
}: UseReservationValidationProps): ReservationValidation {
  return useMemo(() => {
    if (creatingReservation) {
      return {
        isButtonDisabled: true,
        disabledReason: "申込処理中",
      };
    }

    if (useTickets && ticketCount > maxTickets) {
      return {
        isButtonDisabled: true,
        disabledReason: "利用可能なチケット数を超えています",
      };
    }

    if (hasInsufficientPoints) {
      return {
        isButtonDisabled: true,
        disabledReason: "ポイントが不足しているため申し込みできません",
      };
    }

    return {
      isButtonDisabled: false,
      disabledReason: null,
    };
  }, [creatingReservation, useTickets, ticketCount, maxTickets, hasInsufficientPoints]);
}
