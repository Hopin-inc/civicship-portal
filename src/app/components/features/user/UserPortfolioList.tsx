import { History, Plus } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/shared/EmptyState";
import { format } from "date-fns";
import type { Portfolio as GqlPortfolio } from "@/gql/graphql";
import type { Portfolio, PortfolioParticipant } from "@/types";
import { RefObject } from "react";

type Props = {
  userId: string;
  isOwner: boolean;
  portfolios: Portfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
};

const convertPortfolioToPortfolioItem = (portfolio: GqlPortfolio): Portfolio => {
  return {
    id: portfolio.id,
    type: portfolio.category.toLowerCase() as Portfolio['type'],
    title: portfolio.title,
    date: format(new Date(portfolio.date), 'yyyy/MM/dd'),
    location: portfolio.place?.name ?? null,
    category: portfolio.category,
    participants: portfolio.participants.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image ?? null
    })),
    image: portfolio.thumbnailUrl ?? null,
    source: portfolio.source
  };
};

const PortfolioGrid = ({ portfolios, isLoadingMore, hasMore, lastPortfolioRef }: { 
  portfolios: Portfolio[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
}) => {
  const getCategoryStyle = (category: string) => {
    switch (category.toUpperCase()) {
      case 'QUEST':
        return { bg: '#FEF9C3', text: '#854D0E' };
      case 'ACTIVITY_REPORT':
        return { bg: '#DCE7DD', text: '#166534' };
      case 'INTERVIEW':
        return { bg: '#DCE7DD', text: '#166534' };
      case 'OPPORTUNITY':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category.toUpperCase()) {
      case 'QUEST':
        return 'クエスト';
      case 'ACTIVITY_REPORT':
        return '活動報告';
      case 'INTERVIEW':
        return '記事';
      case 'OPPORTUNITY':
        return 'オポテュニティ';
      default:
        return category;
    }
  };

  const renderParticipants = (participants: Portfolio['participants']) => {
    const maxDisplay = 3;
    const uniqueParticipants = Array.from(
      new Map(participants.map(p => [p.id, p])).values()
    );
    const remainingCount = uniqueParticipants.length - maxDisplay;
    const displayParticipants = uniqueParticipants.slice(0, maxDisplay);

    return (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {displayParticipants.map((participant, index) => (
            <div 
              key={`${participant.id}-${index}`}
              className={`w-6 h-6 sm:w-8 sm:h-8 relative ${index === maxDisplay - 1 && remainingCount > 0 ? 'relative' : ''}`}
            >
              <Image
                src={participant.image ?? '/placeholder-avatar.png'}
                alt={participant.name}
                fill
                className={`rounded-full border-2 border-white ${index === maxDisplay - 1 && remainingCount > 0 ? 'brightness-50' : ''}`}
              />
              {index === maxDisplay - 1 && remainingCount > 0 && (
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

  const uniquePortfolios = Array.from(
    new Map(portfolios.map(p => [p.id, p])).values()
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {uniquePortfolios.map((portfolio, index) => (
        <div 
          key={portfolio.id} 
          ref={index === uniquePortfolios.length - 1 ? lastPortfolioRef : undefined}
          className="border rounded-lg overflow-hidden bg-card"
        >
          <div className="relative h-32 sm:h-48">
            <Image
              src={portfolio.image ?? '/placeholder-image.png'}
              alt={portfolio.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 left-2">
              {portfolio.participants && renderParticipants(portfolio.participants)}
            </div>
          </div>
          <div className="p-2 sm:p-4">
            <div 
              className="inline-block px-2 py-1 text-xs sm:text-sm rounded-full mb-1 sm:mb-2"
              style={{
                backgroundColor: getCategoryStyle(portfolio.category).bg,
                color: getCategoryStyle(portfolio.category).text,
              }}
            >
              {getCategoryLabel(portfolio.category)}
            </div>
            <h3 className="font-bold text-sm sm:text-base mb-1">{portfolio.title}</h3>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {portfolio.date}
              {portfolio.location && ` • ${portfolio.location}`}
            </div>
          </div>
        </div>
      ))}
      {isLoadingMore && (
        <div className="col-span-2 flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const FloatingActionButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 flex items-center gap-1 px-6 py-3 bg-[#4361EE] text-white rounded-full shadow-lg hover:bg-[#3651DE] transition-colors"
      onClick={() => {
        // TODO: Implement portfolio creation
        console.log("Create new portfolio");
      }}
    >
      <Plus className="w-5 h-5" />
      <span>活動を記録する</span>
    </button>
  );
};

export const UserPortfolioList = ({ userId, isOwner, portfolios, isLoadingMore, hasMore, lastPortfolioRef }: Props) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold text-foreground">
          地域との関わり
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
      {isOwner && <FloatingActionButton />}
    </section>
  );
};
