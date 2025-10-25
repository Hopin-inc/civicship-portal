"use client";

import { Calendar, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EmptyStateWithSearch from "@/components/shared/EmptyStateWithSearch";
import { RefObject } from "react";
import { ParticipantsList } from "@/components/shared/ParticipantsList";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { ActivityCard, FormattedOpportunityCard } from "@/components/domains/opportunities/types";
import { AppPortfolio } from "@/app/users/features/data/type";
import { GqlEvaluationStatus, GqlPortfolioSource, GqlReservationStatus } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { getCurrentRegionName } from "@/lib/communities/metadata";
import { useRouter } from "next/navigation";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import { parsePortfolioDate } from "@/app/users/features/lib/portfolioHelpers";

type Props = {
  userId: string;
  isOwner: boolean;
  portfolios: AppPortfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
  isSysAdmin?: boolean;
  activeOpportunities?: ActivityCard[];
};

type ActiveOpportunitiesProps = {
  opportunities: FormattedOpportunityCard[];
};

const getCategoryLabel = (
  source: GqlPortfolioSource,
  reservationStatus?: GqlReservationStatus | null,
): string | undefined => {
  if (source === GqlPortfolioSource.Opportunity && reservationStatus) {
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
};

const getStatusStyles = (reservationStatus?: GqlReservationStatus | null): string => {
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
};

const getStatusStylesForPassed = (evaluationStatus?: GqlEvaluationStatus | null): string => {
  if (!evaluationStatus) return "bg-primary-foreground text-primary";

  switch (evaluationStatus) {
    case GqlEvaluationStatus.Passed:
      return "bg-primary-foreground text-green-700";
    default:
      return "bg-primary-foreground text-primary";
  }
};
const ActiveOpportunities = ({ opportunities }: ActiveOpportunitiesProps) => {
  if (!opportunities.length) return null;

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <h2 className="text-display-sm font-semibold text-foreground py-4">現在募集中の関わり</h2>
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {opportunities.length}
        </span>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4">
            {opportunities.map((opportunity) => (
              <OpportunityVerticalCard key={opportunity.id} {...opportunity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PortfolioCard = ({
  portfolio,
  isLast,
  lastRef,
}: {
  portfolio: AppPortfolio;
  isLast: boolean;
  lastRef: RefObject<HTMLDivElement>;
}) => {
  const isPast = parsePortfolioDate(portfolio.date) < new Date();
  const isPassed = portfolio.evaluationStatus === GqlEvaluationStatus.Passed;
  const linkHref =
    portfolio.source === "ARTICLE"
      ? `/articles/${portfolio.id}`
      : portfolio.source === "OPPORTUNITY" && isPassed
        ? `/credentials/${portfolio.id}`
        : portfolio.source === "OPPORTUNITY"
          ? `/participations/${portfolio.id}`
          : "#";
  return (
    <Link href={linkHref} className="block w-full">
      <div
        ref={isLast ? lastRef : undefined}
        className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
      >
        <div className="relative w-full aspect-[164/205]">
          <Image
            src={portfolio.image ?? PLACEHOLDER_IMAGE}
            alt={portfolio.title}
            fill
            className="object-cover"
            placeholder={"blur"}
            blurDataURL={PLACEHOLDER_IMAGE}
            sizes="(min-width: 640px) 50vw, 100vw"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = PLACEHOLDER_IMAGE;
            }}
          />
          {portfolio.source === "OPPORTUNITY" &&
          portfolio?.reservationStatus === GqlReservationStatus.Accepted &&
          isPast ? (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            </div>
          ) : (
            <div className="absolute top-2 left-2 z-10">
              <div
                className={`px-2 py-1 text-label-sm rounded-full font-bold 
                  ${isPassed ? getStatusStylesForPassed(portfolio.evaluationStatus) : getStatusStyles(portfolio.reservationStatus)}
                  `}
              >
                {isPassed
                  ? "証明済み"
                  : getCategoryLabel(portfolio.source, portfolio.reservationStatus)}
              </div>
            </div>
          )}
          {portfolio.participants?.length > 0 && (
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <div className="flex items-center justify-between">
                <ParticipantsList participants={portfolio.participants} size="md" />
              </div>
            </div>
          )}
        </div>
        <div className="py-3 space-y-2">
          <h3 className="text-title-sm line-clamp-2">{portfolio.title}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-body-sm text-caption">
              <Calendar className="w-4 h-4" />
              <span>
                {portfolio.date}
                {portfolio.source === "OPPORTUNITY" &&
                  !isPast &&
                  portfolio.reservationStatus !== GqlReservationStatus.Canceled &&
                  portfolio.reservationStatus !== GqlReservationStatus.Rejected &&
                  portfolio.reservationStatus !== null && (
                    <span className="bg-ring pl-1.5 pr-2 py-0.5 rounded-lg ml-1">予定</span>
                  )}
              </span>
            </div>
            {portfolio.location && (
              <div className="flex items-center gap-1 text-body-sm text-caption">
                <MapPin className="w-4 h-4" />
                <span>{portfolio.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const PortfolioGrid = ({
  portfolios,
  isLoadingMore,
  hasMore,
  lastPortfolioRef,
}: {
  portfolios: AppPortfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {portfolios.map((portfolio, index) => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={portfolio}
          isLast={index === portfolios.length - 1}
          lastRef={lastPortfolioRef}
        />
      ))}
      {isLoadingMore && (
        <div className="col-span-2 flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      )}
    </div>
  );
};

const UserPortfolioList = ({
  isSysAdmin,
  activeOpportunities = [],
  isOwner,
  portfolios,
  isLoadingMore,
  hasMore,
  lastPortfolioRef,
}: Props) => {
  const showEmptyState = portfolios.length === 0;
  const router = useRouter();
  const emptyStateProps = {
    // title: `${getCurrentRegionName()}にふれよう`,
    description: isOwner
      ? `${getCurrentRegionName()}の素敵な人との\n関わりを探してみましょう`
      : "体験に参加すると、タイムラインが作成されます",
    actionLabel: isOwner ? "関わりを探す" : undefined,
    onAction: isOwner ? () => (window.location.href = "/") : undefined,
    hideActionButton: !isOwner,
    // icon: <PhotoGallery />,
  };

  const formattedOpportunities = activeOpportunities.map(formatOpportunities);

  return (
    <section className="py-6 mt-0">
      <div className="space-y-4">
        {isSysAdmin && <ActiveOpportunities opportunities={formattedOpportunities} />}
        <div className="flex items-center justify-between">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
            これまでの関わり
          </h2>
          <button
            type="button"
            className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent p-0"
            onClick={() => router.push("/users/me/portfolios?tab=future")}
          >
            すべて見る
          </button>
        </div>
        {showEmptyState ? (
          <EmptyStateWithSearch {...emptyStateProps} />
        ) : (
          <PortfolioGrid
            portfolios={portfolios}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            lastPortfolioRef={lastPortfolioRef}
          />
        )}
      </div>
    </section>
  );
};

export default UserPortfolioList;
