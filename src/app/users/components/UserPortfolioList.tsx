"use client";

import { Calendar, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EmptyStateWithSearch from "@/components/shared/EmptyStateWithSearch";
import { RefObject } from "react";
import { ParticipantsList } from "@/components/shared/ParticipantsList";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";
import { AppPortfolio } from "@/app/users/data/type";
import { GqlOpportunityCategory, GqlPortfolioSource, GqlReservationStatus } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { getCurrentRegionName } from "@/lib/communities/metadata";

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
  opportunities: ActivityCard[];
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
              <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} isCarousel />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioCard = ({
  portfolio,
  isLast,
  lastRef,
}: {
  portfolio: AppPortfolio;
  isLast: boolean;
  lastRef: RefObject<HTMLDivElement>;
}) => {
  const isPast = new Date(portfolio.date) < new Date();

  const linkHref =
    portfolio.source === "ARTICLE"
      ? `/articles/${portfolio.id}`
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
                className={`px-2 py-1 text-label-sm rounded-full font-bold ${getStatusStyles(portfolio.reservationStatus)}`}
              >
                {getCategoryLabel(portfolio.source, portfolio.reservationStatus)}
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
                  portfolio.reservationStatus !== GqlReservationStatus.Rejected && (
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

const PortfolioGrid = ({
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

const PhotoGallery = () => {
  const images = [
    "/images/activities/activity-placeholder-1.jpg",
    "/images/activities/activity-placeholder-2.jpg",
    "/images/activities/activity-placeholder-3.jpg",
  ];

  return (
    <div className="flex flex-row gap-2 mt-4 w-72 h-64">
      <div className="w-3/5 h-full relative">
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img src={images[0]} alt={"体験のイメージ画像1"} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="w-2/5 h-full flex flex-col gap-2">
        <div className="h-1/2 rounded-lg overflow-hidden">
          <img src={images[1]} alt="体験のイメージ画像2" className="w-full h-full object-cover" />
        </div>
        <div className="h-1/2 rounded-lg overflow-hidden">
          <img src={images[2]} alt="体験のイメージ画像3" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

// TODO: dummy 関連のコード削除する
const enableDummyPortfolios = false;
const enableDummyActiveOpportunities = false;

const UserPortfolioList = ({
  isSysAdmin,
  activeOpportunities = [],
  isOwner,
  portfolios,
  isLoadingMore,
  hasMore,
  lastPortfolioRef,
}: Props) => {
  const showEmptyState = enableDummyPortfolios ? false : portfolios.length === 0;

  const emptyStateProps = {
    title: `${getCurrentRegionName()}にふれよう`,
    description: isOwner
      ? `${getCurrentRegionName()}の素敵な人との\n関わりを探してみましょう`
      : "体験に参加すると、タイムラインが作成されます",
    actionLabel: isOwner ? "関わりを探す" : undefined,
    onAction: isOwner ? () => (window.location.href = "/") : undefined,
    hideActionButton: !isOwner,
    icon: <PhotoGallery />,
  };

  return (
    <section className="py-6 mt-0">
      <div className="space-y-4">
        {isSysAdmin && (
          <ActiveOpportunities
            opportunities={
              enableDummyActiveOpportunities ? dummyActivityCards : activeOpportunities
            }
          />
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
            これまでの関わり
          </h2>
          {/*{isOwner && (*/}
          {/*  <DropdownMenu>*/}
          {/*    <DropdownMenuTrigger asChild>*/}
          {/*      <Button variant="icon-only" size="sm" className="w-8 h-8 p-0">*/}
          {/*        <Ellipsis className="w-5 h-5" />*/}
          {/*      </Button>*/}
          {/*    </DropdownMenuTrigger>*/}
          {/*    /!* #TODO: 導線接続 *!/*/}
          {/*    <DropdownMenuContent align="end" className="w-44">*/}
          {/*      <DropdownMenuItem>*/}
          {/*        <Plus className="mr-2 h-5 w-5 text-primary" />*/}
          {/*        <span className="text-primary text-label-md">関わりを追加</span>*/}
          {/*      </DropdownMenuItem>*/}
          {/*      <DropdownMenuItem>*/}
          {/*        <Clock className="mr-2 h-5 w-5" />*/}
          {/*        <span className="text-label-md">過去の予約</span>*/}
          {/*      </DropdownMenuItem>*/}
          {/*      <DropdownMenuItem>*/}
          {/*        <FileText className="mr-2 h-5 w-5" />*/}
          {/*        <span className="text-label-md">参加証明を発行</span>*/}
          {/*      </DropdownMenuItem>*/}
          {/*    </DropdownMenuContent>*/}
          {/*  </DropdownMenu>*/}
          {/*)}*/}
        </div>
        {showEmptyState ? (
          <EmptyStateWithSearch {...emptyStateProps} />
        ) : (
          <PortfolioGrid
            portfolios={enableDummyPortfolios ? dummyPortfolios : portfolios}
            isLoadingMore={enableDummyPortfolios ? false : isLoadingMore}
            hasMore={enableDummyPortfolios ? false : hasMore}
            lastPortfolioRef={lastPortfolioRef}
          />
        )}
      </div>
    </section>
  );
};

export default UserPortfolioList;

// #NOTE: スタイル確認用に作成、後ほど削除する
const dummyPortfolios: AppPortfolio[] = [
  {
    id: "1",
    source: "OPPORTUNITY",
    category: "EVENT",
    reservationStatus: "ACCEPTED",
    title: "体験のタイトル",
    image: "/images/activities/activity-placeholder-1.jpg",
    date: "2025-05-15",
    location: "四国",
    participants: [
      { id: "1", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "2", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "3", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "4", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "5", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
    ],
  },
  {
    id: "2",
    source: "OPPORTUNITY",
    category: "QUEST",
    reservationStatus: "APPLIED",
    title: "体験のタイトル",
    image: "/images/activities/activity-placeholder-2.jpg",
    date: "2025-05-25",
    location: "四国",
    participants: [
      { id: "1", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "2", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "3", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "4", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "5", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
    ],
  },
  {
    id: "9",
    source: "OPPORTUNITY",
    category: "QUEST",
    reservationStatus: "ACCEPTED",
    title: "体験のタイトル",
    image: "/images/activities/activity-placeholder-2.jpg",
    date: "2025-05-25",
    location: "四国",
    participants: [
      { id: "1", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "2", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "3", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "4", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "5", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
    ],
  },
  {
    id: "3",
    source: "OPPORTUNITY",
    category: "QUEST",
    reservationStatus: "CANCELED",
    title: "体験のタイトル",
    image: "/images/activities/activity-placeholder-2.jpg",
    date: "2025-05-15",
    location: "四国",
    participants: [
      { id: "1", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "2", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "3", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
    ],
  },
  {
    id: "4",
    source: "OPPORTUNITY",
    category: "EVENT",
    reservationStatus: "REJECTED",
    title: "体験のタイトル",
    image: "/images/activities/activity-placeholder-2.jpg",
    date: "2025-05-25",
    location: "四国",
    participants: [
      { id: "1", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
      { id: "2", name: "ユーザー名", image: PLACEHOLDER_IMAGE },
    ],
  },
];

const dummyActivityCards: ActivityCard[] = dummyPortfolios.map((portfolio) => ({
  id: portfolio.id,
  category:
    portfolio.category === "EVENT" ? GqlOpportunityCategory.Event : GqlOpportunityCategory.Quest,
  title: portfolio.title,
  images: [portfolio.image || PLACEHOLDER_IMAGE],
  location: portfolio.location || "",
  hasReservableTicket: true,
  feeRequired: 200,
  communityId: "neo-88",
}));
