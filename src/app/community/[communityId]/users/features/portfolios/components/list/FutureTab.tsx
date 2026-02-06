"use client";
import { groupByDate } from "./date-grouping";
import { useRef } from "react";
import { useUserProfileContext } from "@/app/community/[communityId]/users/features/shared/contexts/UserProfileContext";
import { PortfoliosByDateSection } from "./PortfoliosByDateSection";
import { filterFuturePortfolios } from "../../lib";

interface FutureTabProps {
  searchQuery: string;
}

export function FutureTab({ searchQuery }: FutureTabProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { portfolios } = useUserProfileContext();

  const filteredPortfolios = filterFuturePortfolios(portfolios, searchQuery, new Date());
  const portfoliosByDate = groupByDate(filteredPortfolios);

  return <PortfoliosByDateSection grouped={portfoliosByDate} lastPortfolioRef={lastPortfolioRef} />;
}
