"use client";
import { useRef } from "react";
import { groupByDate } from "./date-grouping";
import { useUserProfileContext } from "@/app/users/features/shared/contexts/UserProfileContext";
import { PortfoliosByDateSection } from "./PortfoliosByDateSection";
import { filterPastPortfolios } from "../../lib";

interface PastTabProps {
  searchQuery: string;
}

export function PastTab({ searchQuery }: PastTabProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { portfolios } = useUserProfileContext();

  const filteredPortfolios = filterPastPortfolios(portfolios, searchQuery, new Date());
  const portfoliosByDate = groupByDate(filteredPortfolios);

  return <PortfoliosByDateSection grouped={portfoliosByDate} lastPortfolioRef={lastPortfolioRef} />;
}
