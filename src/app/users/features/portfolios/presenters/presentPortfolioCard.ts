import { AppPortfolio } from "@/app/users/features/shared/types";
import { GqlEvaluationStatus, GqlReservationStatus } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { parsePortfolioDate, formatPortfolioDate } from "@/app/users/features/portfolios/lib";
import { PortfolioCardViewModel } from "./types";

function getCategoryLabel(
  source: "OPPORTUNITY" | "ARTICLE",
  reservationStatus?: GqlReservationStatus | null,
): string | undefined {
  if (source === "OPPORTUNITY" && reservationStatus) {
    switch (reservationStatus) {
      case GqlReservationStatus.Applied:
        return "予約承認待ち";
      case GqlReservationStatus.Accepted:
        return "予約確定";
      case GqlReservationStatus.Rejected:
        return "要確認";
      case GqlReservationStatus.Canceled:
        return "キャンセル済み";
      default:
        return "要確認";
    }
  }
  return undefined;
}

function getStatusStyles(reservationStatus?: GqlReservationStatus | null): string {
  if (!reservationStatus) return "bg-primary-foreground text-primary";

  switch (reservationStatus) {
    case GqlReservationStatus.Applied:
      return "bg-yellow-100 text-yellow-700";
    case GqlReservationStatus.Accepted:
      return "bg-primary-foreground text-primary";
    case GqlReservationStatus.Rejected:
      return "bg-destructive text-destructive-foreground";
    case GqlReservationStatus.Canceled:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusStylesForPassed(evaluationStatus?: GqlEvaluationStatus | null): string {
  if (!evaluationStatus) return "bg-primary-foreground text-primary";

  switch (evaluationStatus) {
    case GqlEvaluationStatus.Passed:
      return "bg-primary-foreground text-green-700";
    default:
      return "bg-primary-foreground text-primary";
  }
}

export function presentPortfolioCard(
  portfolio: AppPortfolio,
  now: Date = new Date(),
): PortfolioCardViewModel {
  const isPast = parsePortfolioDate(portfolio.dateISO) < now;
  const isPassed = portfolio.evaluationStatus === GqlEvaluationStatus.Passed;

  const linkHref =
    portfolio.source === "ARTICLE"
      ? `/articles/${portfolio.id}`
      : portfolio.source === "OPPORTUNITY" && isPassed
        ? `/credentials/${portfolio.id}`
        : portfolio.source === "OPPORTUNITY"
          ? `/participations/${portfolio.id}`
          : "#";

  const showShield =
    portfolio.source === "OPPORTUNITY" &&
    portfolio?.reservationStatus === GqlReservationStatus.Accepted &&
    isPast;

  let badge: { label: string; variantClasses: string } | null = null;
  if (!showShield) {
    if (isPassed) {
      badge = {
        label: "証明済み",
        variantClasses: getStatusStylesForPassed(portfolio.evaluationStatus),
      };
    } else {
      const label = getCategoryLabel(portfolio.source, portfolio.reservationStatus);
      if (label) {
        badge = {
          label,
          variantClasses: getStatusStyles(portfolio.reservationStatus),
        };
      }
    }
  }

  const showScheduleBadge =
    portfolio.source === "OPPORTUNITY" &&
    !isPast &&
    portfolio.reservationStatus !== GqlReservationStatus.Canceled &&
    portfolio.reservationStatus !== GqlReservationStatus.Rejected &&
    portfolio.reservationStatus !== null;

  return {
    id: portfolio.id,
    title: portfolio.title,
    image: portfolio.image ?? PLACEHOLDER_IMAGE,
    linkHref,
    isPast,
    isPassed,
    dateDisplay: formatPortfolioDate(portfolio.dateISO),
    showScheduleBadge,
    location: portfolio.location,
    participants: portfolio.participants,
    badge,
    showShield,
  };
}
