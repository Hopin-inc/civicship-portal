'use client';

import React from 'react';
import { UserProfileHeader } from './UserProfileHeader';
import { UserTicketsAndPoints } from './UserTicketsAndPoints';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { GeneralUserProfile } from "@/types/user";
import { UserAsset } from "@/types/wallet";

interface UserProfileSectionProps {
  userId: string;
  isLoading: boolean;
  error: any;
  profile: GeneralUserProfile;
  userAsset: UserAsset
  isOwner: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userId,
  isLoading,
  error,
  profile,
  userAsset,
  isOwner
}) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error || !profile) {
    return <ErrorState message="ユーザー情報の取得に失敗しました" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <UserProfileHeader
        id={userId}
        name={profile.name}
        image={profile.image ?? "/placeholder-profile.jpg"}
        bio={profile.bio ?? ""}
        currentPrefecture={profile.currentPrefecture}
        isOwner={isOwner}
      />

      {isOwner && (
        <UserTicketsAndPoints
          ticketCount={userAsset.tickets.length || 0}
          pointCount={userAsset.points.currentPoint || 0}
        />
      )}

      {/*<UserActiveOpportunities*/}
      {/*  opportunities={profile.activeOpportunities || []}*/}
      {/*  isOwner={isOwner}*/}
      {/*/>*/}

      {/*<UserPortfolioSection*/}
      {/*  portfolios={profile.portfolios || []}*/}
      {/*  isLoading={false}*/}
      {/*  isLoadingMore={false}*/}
      {/*  hasMore={false}*/}
      {/*  lastPortfolioRef={{} as React.RefObject<HTMLDivElement>}*/}
      {/*  onLoadMore={() => {}}*/}
      {/*/>*/}
    </div>
  );
};

export default UserProfileSection;
