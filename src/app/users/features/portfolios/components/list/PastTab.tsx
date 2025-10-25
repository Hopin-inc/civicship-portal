"use client";
import { useRef } from "react";
import { groupByDate } from "./utils";
import { useUserProfileContext } from "@/app/users/features/shared/contexts/UserProfileContext";
import { PortfolioDateGroup } from "./PortfolioDateGroup";
import { filterPastPortfolios } from "../../lib";

interface PastTabProps {
  searchQuery: string;
}

export function PastTab({ searchQuery }: PastTabProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { portfolios } = useUserProfileContext();

  const filteredPortfolios = filterPastPortfolios(portfolios, searchQuery, new Date());
  const grouped = groupByDate(filteredPortfolios);

  return <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />;
}
