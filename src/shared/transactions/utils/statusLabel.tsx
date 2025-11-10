import { GqlTransactionReason } from "@/types/graphql";

export const getStatusLabel = (
  reason: GqlTransactionReason,
  t: (key: string) => string,
): React.ReactNode => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.donation")}:</span>
      );
    case GqlTransactionReason.Grant:
      return <span className="text-label-xs  text-caption">{t("transactions.status.grant")}:</span>;
    case GqlTransactionReason.PointReward:
      return <span className="text-label-xs  text-caption">{t("transactions.status.pay")}:</span>;
    case GqlTransactionReason.TicketPurchased:
      return <span className="text-label-xs  text-caption">{t("transactions.status.pay")}:</span>;
    case GqlTransactionReason.TicketRefunded:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.return")}:</span>
      );
    case GqlTransactionReason.OpportunityReservationCreated:
      return <span className="text-label-xs  text-caption">{t("transactions.status.pay")}:</span>;
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.refund")}:</span>
      );
    default:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.default")}:</span>
      );
  }
};
