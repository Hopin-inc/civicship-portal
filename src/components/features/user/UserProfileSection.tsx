'use client';

import React from 'react';
import { UserProfileHeader } from './UserProfileHeader';
import { UserPortfolioSection } from './UserPortfolioSection';
import { UserActiveOpportunities } from './UserActiveOpportunities';
import { UserTicketsAndPoints } from './UserTicketsAndPoints';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';

interface UserProfileSectionProps {
  userId: string;
  isLoading: boolean;
  error: any;
  profileData: any;
  isOwner: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userId,
  isLoading,
  error,
  profileData,
  isOwner
}) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error || !profileData) {
    return <ErrorState message="ユーザー情報の取得に失敗しました" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <UserProfileHeader
        id={profileData.id}
        name={profileData.name}
        image={profileData.image}
        bio={profileData.bio}
        currentPrefecture={profileData.currentPrefecture}
        isOwner={isOwner}
      />

      {isOwner && (
        <UserTicketsAndPoints
          ticketCount={profileData.ticketCount || 0}
          pointCount={profileData.pointCount || 0}
        />
      )}

      <UserActiveOpportunities
        opportunities={profileData.activeOpportunities || []}
        isOwner={isOwner}
      />

      <UserPortfolioSection
        portfolios={profileData.portfolios || []}
        isLoading={false}
        isLoadingMore={false}
        hasMore={false}
        lastPortfolioRef={{} as React.RefObject<HTMLDivElement>}
        onLoadMore={() => {}}
      />
    </div>
  );
};

export default UserProfileSection;
