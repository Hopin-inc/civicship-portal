import { History, Plus, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import { format } from "date-fns";
import { RefObject } from "react";
import type { Portfolio, PortfolioCategory, PortfolioStyle, ReservationStatus } from "@/types";
import { PORTFOLIO_CATEGORY_STYLES } from "@/types";
import { ParticipantsList } from "@/app/components/shared/ParticipantsList";
import OpportunityCard, { OpportunityCardProps } from "@/app/components/features/opportunity/OpportunityCard";


type Props = {
  userId: string;
  isOwner: boolean;
  portfolios: Portfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
  isSysAdmin?: boolean;
  activeOpportunities?: OpportunityCardProps[];
};

const ActiveOpportunities = ({ opportunities }: { opportunities: OpportunityCardProps[] }) => {
  if (opportunities.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          現在募集中の関わり
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {opportunities.length}
          </span>
        </h2>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} {...opportunity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioGrid = ({ portfolios, isLoadingMore, hasMore, lastPortfolioRef }: { 
  portfolios: Portfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
}) => {
  const getCategoryStyle = (category: PortfolioCategory, source?: string, reservationStatus?: ReservationStatus | null): PortfolioStyle => {
    if (source === 'OPPORTUNITY' && reservationStatus) {
      switch (reservationStatus) {
        case 'APPLIED':
          return { bg: '#FEF3C7', text: '#92400E' }; // 黄色
        case 'ACCEPTED':
          return { bg: '#DBEAFE', text: '#1E40AF' }; // 青色
        case 'REJECTED':
          return { bg: '#FEE2E2', text: '#991B1B' }; // 赤色
        case 'CANCELED':
          return { bg: '#F3F4F6', text: '#6B7280' }; // グレー
        default:
          return { bg: '#E5E7EB', text: '#374151' };
      }
    }
    return PORTFOLIO_CATEGORY_STYLES[category] ?? { bg: '#E5E7EB', text: '#374151' };
  };

  const getCategoryLabel = (category: PortfolioCategory, source?: string, reservationStatus?: ReservationStatus | null): string => {
    if (source === 'OPPORTUNITY' && reservationStatus) {
      switch (reservationStatus) {
        case 'APPLIED':
          return '予約承認待ち';
        case 'ACCEPTED':
          return '予約確定';
        case 'REJECTED':
          return '非承認';
        case 'CANCELED':
          return 'キャンセル';
        default:
          return 'オポテュニティ';
      }
    }

    switch (category) {
      case 'QUEST':
        return 'クエスト';
      case 'ACTIVITY_REPORT':
        return '活動報告';
      case 'INTERVIEW':
        return '記事';
      case 'OPPORTUNITY':
        return 'オポテュニティ';
      case 'ACTIVITY':
        return '活動';
    }
  };

  const renderParticipants = (participants: Portfolio['participants']) => {
    const uniqueParticipants = Array.from(
      new Map(participants.map(p => [p.id, p])).values()
    );
    const remainingCount = uniqueParticipants.length - MAX_DISPLAY_PARTICIPANTS;
    const displayParticipants = uniqueParticipants.slice(0, MAX_DISPLAY_PARTICIPANTS);

    return (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {displayParticipants.map((participant, index) => (
            <div 
              key={`${participant.id}-${index}`}
              className={`w-6 h-6 sm:w-8 sm:h-8 relative ${index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0 ? 'relative' : ''}`}
            >
              <Image
                src={participant.image ?? '/placeholder-avatar.png'}
                alt={participant.name}
                fill
                className={`rounded-full border-2 border-white ${index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0 ? 'brightness-50' : ''}`}
              />
              {index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium text-white">
                  +{remainingCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {portfolios.map((portfolio, index) => (
        <Link
          key={portfolio.id}
          href={
            portfolio.source === 'ARTICLE'
              ? `/articles/${portfolio.id}`
              : portfolio.source === 'OPPORTUNITY'
              ? `/participations/${portfolio.id}`
              : '#'
          }
          className="block w-full"
        >
          <div 
            ref={index === portfolios.length - 1 ? lastPortfolioRef : undefined}
            className="rounded-lg overflow-hidden bg-card hover:opacity-90 transition-opacity"
          >
            <div className="relative w-full" style={{ paddingTop: 'calc(205 / 164 * 100%)' }}>
              <Image
                src={portfolio.image ?? '/placeholder-image.png'}
                alt={portfolio.title}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              {portfolio.source === 'OPPORTUNITY' && portfolio.reservationStatus && (
                <div className="absolute top-2 left-2 z-10">
                  <div 
                    className="px-2 py-1 text-xs sm:text-sm rounded-full font-bold"
                    style={{
                      backgroundColor: getCategoryStyle(portfolio.category, portfolio.source, portfolio.reservationStatus).bg,
                      color: getCategoryStyle(portfolio.category, portfolio.source, portfolio.reservationStatus).text,
                    }}
                  >
                    {getCategoryLabel(portfolio.category, portfolio.source, portfolio.reservationStatus)}
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 z-10">
                {portfolio.participants && portfolio.participants.length > 0 && (
                  <div className="flex items-center justify-between">
                    <ParticipantsList participants={portfolio.participants} size="md" />
                    {portfolio.participants.length > 3 && (
                      <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                        +{portfolio.participants.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-bold text-sm sm:text-base line-clamp-2">
                {portfolio.title}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{portfolio.date}{portfolio.source === 'OPPORTUNITY' && ' 予定'}</span>
                </div>
                {portfolio.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
      {isLoadingMore && (
        <div className="col-span-2 flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export const UserPortfolioList = ({ userId, isOwner, portfolios, isLoadingMore, hasMore, lastPortfolioRef, isSysAdmin, activeOpportunities = [] }: Props) => {
  return (
    <section className="space-y-8 pb-20">
      {isSysAdmin && <ActiveOpportunities opportunities={activeOpportunities} />}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-lg font-semibold text-foreground">
            これまでの関わり
          </h2>
        </div>
        {portfolios.length > 0 ? (
          <PortfolioGrid 
            portfolios={portfolios} 
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            lastPortfolioRef={lastPortfolioRef}
          />
        ) : (
          <EmptyState
            title="まだ活動がありません"
            description={
              isOwner
                ? "地域の活動に参加して、タイムラインを作りましょう"
                : "地域の活動に参加すると、タイムラインが作成されます"
            }
            actionLabel="関わりを探す"
            onAction={() => {
              window.location.href = "/";
            }}
            hideActionButton={!isOwner}
            icon={<History className="w-8 h-8 text-muted-foreground font-thin" />}
          />
        )}
      </div>
    </section>
  );
};

// Add scrollbar-hide utility class
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);
