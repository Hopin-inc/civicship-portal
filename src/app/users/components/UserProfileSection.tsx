"use client";

import React from "react";
import UserProfileHeader from "./UserProfileHeader";
import UserTicketsAndPoints from "./UserTicketsAndPoints";
import { GeneralUserProfile } from "@/app/users/data/type";
import { UserAsset } from "@/app/wallets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { GqlTicketStatus } from "@/types/graphql";

interface UserProfileSectionProps {
  userId: string;
  profile: GeneralUserProfile;
  userAsset: UserAsset;
  isOwner: boolean;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userId,
  profile,
  userAsset,
  isOwner,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <UserProfileHeader
        id={userId}
        name={profile.name}
        image={profile.imagePreviewUrl || PLACEHOLDER_IMAGE}
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
          ticketCount={userAsset.tickets.filter(t => t.status === GqlTicketStatus.Available).length || 0}
          pointCount={Number(userAsset.points.currentPoint) || 0}
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
