import { ActivityDetail } from "@/app/activities/data/type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Result = { success: true; reservationId: string } | { success: false; error: string };

export const createReservationHandler = (
  opportunity: ActivityDetail | null,
  handleReservation: () => Promise<Result>,
  router: ReturnType<typeof useRouter>,
) => {
  return async () => {
    const result = await handleReservation();

    if (result.success) {
      toast.success("予約が完了しました");
      router.push(
        `/reservation/complete?opportunity_id=${opportunity?.id}&reservation_id=${result.reservationId}`,
      );
    } else {
      const messages: Record<string, string> = {
        NOT_AUTHENTICATED: "ログインが必要です",
        MISSING_DATA: "必要な情報が不足しています",
        NOT_ENOUGH_TICKETS: "必要なチケットが不足しています",
        UNKNOWN_ERROR: "予約に失敗しました。もう一度お試しください。",
      };
      toast.error(messages[result.error] ?? "不明なエラーが発生しました");
    }
  };
};
