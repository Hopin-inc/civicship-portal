import { ParticipationStatus, ParticipationStatusReason } from "../gql/graphql";

interface ReservationStatus {
  status: "pending" | "confirmed" | "cancelled";
  statusText: string;
  statusSubText: string;
  statusClass: string;
}

export const getStatusInfo = (
  status: ParticipationStatus,
  reason: ParticipationStatusReason,
): ReservationStatus | null => {
  switch (status) {
    case ParticipationStatus.Pending:
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
    case ParticipationStatus.Participating:
      return {
        status: "confirmed",
        statusText: "予約が確定しました。",
        statusSubText: "",
        statusClass: "bg-green-50 border-green-200",
      };
    case ParticipationStatus.NotParticipating:
      const isCanceled = reason === ParticipationStatusReason.OpportunityCanceled;
      return {
        status: "cancelled",
        statusText: isCanceled ? "開催が中止されました。" : "予約がキャンセルされました。",
        statusSubText: isCanceled
          ? "案内人の都合により中止となりました。"
          : "予約のキャンセルが完了しました。",
        statusClass: "bg-red-50 border-red-200",
      };
    case ParticipationStatus.Participated:
      return null;
    default:
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
  }
};

export const calculateCancellationDeadline = (startTime: Date): Date => {
  return new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
};

export const formatImageData = (images: any[]): { url: string; alt: string }[] => {
  return images.map((img) => ({
    url: (img as any).url || img,
    alt: "参加者の写真",
  }));
};
