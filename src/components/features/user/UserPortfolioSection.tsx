
import React from 'react';
import { UserPortfolioItem } from './UserPortfolioItem';
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  name: string;
  image: string | null;
}

interface Portfolio {
  id: string;
  type: 'opportunity' | 'activity_report' | 'quest';
  title: string;
  date: string;
  location: string | null;
  category: string;
  reservationStatus?: string | null;
  participants: Participant[];
  image: string | null;
  source?: string;
}

interface UserPortfolioSectionProps {
  portfolios: Portfolio[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: React.RefObject<HTMLDivElement>;
  onLoadMore: () => void;
}

export const UserPortfolioSection: React.FC<UserPortfolioSectionProps> = ({
  portfolios,
  isLoading,
  isLoadingMore,
  hasMore,
  lastPortfolioRef,
  onLoadMore
}) => {
  if (isLoading && portfolios.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm text-center">
        <p className="text-gray-500">ポートフォリオがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">ポートフォリオ</h2>
      
      <div className="space-y-4">
        {portfolios.map((portfolio, index) => (
          <div
            key={portfolio.id}
            ref={index === portfolios.length - 1 ? lastPortfolioRef : undefined}
          >
            <UserPortfolioItem
              id={portfolio.id}
              type={portfolio.type}
              title={portfolio.title}
              date={portfolio.date}
              location={portfolio.location}
              category={portfolio.category}
              reservationStatus={portfolio.reservationStatus}
              participants={portfolio.participants}
              image={portfolio.image}
              source={portfolio.source}
            />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="tertiary"
            className="px-4 py-2 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoadingMore ? '読み込み中...' : 'もっと見る'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPortfolioSection;
