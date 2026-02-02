import { GqlParticipation, GqlReservation } from "@/types/graphql";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import getReservationStatusMeta from "../hooks/useGetReservationStatusMeta";

/**
 * 予約詳細ページ用のデータを整形
 */
export function presentReservationDetail(reservation: GqlReservation) {
  const opportunity = reservation.opportunitySlot?.opportunity;

  // 有効な参加者のみフィルタリング
  const participations = (reservation.participations ?? []).filter(
    (p): p is GqlParticipation & { user: NonNullable<GqlParticipation["user"]> } => !!p.user,
  );

  // アクティビティカード用データ
  const activityCard = opportunity ? presenterActivityCard(opportunity) : null;

  // ステータス情報
  const statusMeta = getReservationStatusMeta(reservation);

  return {
    reservation,
    opportunity,
    participations,
    activityCard,
    statusMeta,
  };
}
