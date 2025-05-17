"use client";

import React from "react";
import UserProfileHeader from "./UserProfileHeader";
import UserTicketsAndPoints from "./UserTicketsAndPoints";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { GeneralUserProfile } from "@/app/users/data/type";
import { UserAsset } from "@/app/wallets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface UserProfileSectionProps {
  userId: string;
  isLoading: boolean;
  error: any;
  profile: GeneralUserProfile;
  userAsset: UserAsset;
  isOwner: boolean;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userId,
  isLoading,
  error,
  profile,
  userAsset,
  isOwner,
}) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error || !profile) {
    return <ErrorState title="ユーザー情報の取得に失敗しました" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <UserProfileHeader
        id={userId}
        name={profile.name}
        image={profile.image || PLACEHOLDER_IMAGE}
        bio={profile.bio ?? ""}
        currentPrefecture={profile.currentPrefecture}
        isOwner={isOwner}
        socialUrl={{
          x: profile.urlX || null,
          instagram: profile.urlInstagram || null,
          facebook: profile.urlFacebook || null,
        }}
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
