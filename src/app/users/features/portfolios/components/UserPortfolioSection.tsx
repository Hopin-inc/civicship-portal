"use client";

import { useRef } from "react";
import { AppPortfolio } from "@/app/users/features/shared/types";
import UserPortfolioList from "@/app/users/features/portfolios/components/UserPortfolioList";

interface UserPortfolioSectionProps {
  userId: string;
  portfolios: AppPortfolio[];
  isOwner: boolean;
  activeOpportunities: Array<{
    id: string;
    title: string;
    images?: string[];
  }>;
}

export function UserPortfolioSection({
  userId,
  portfolios,
  isOwner,
  activeOpportunities,
}: UserPortfolioSectionProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  return (
    <UserPortfolioList
      userId={userId}
      isOwner={isOwner}
      portfolios={portfolios}
      isLoadingMore={false}
      hasMore={false}
      lastPortfolioRef={lastPortfolioRef}
      isSysAdmin={false}
      activeOpportunities={activeOpportunities}
    />
  );
}
