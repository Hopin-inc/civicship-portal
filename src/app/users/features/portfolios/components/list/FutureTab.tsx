"use client";
import { groupByDate } from "./utils";
import { useRef } from "react";
import { useUserProfileContext } from "@/app/users/features/shared/contexts/UserProfileContext";
import { PortfolioDateGroup } from "./PortfolioDateGroup";
import { filterFuturePortfolios } from "../../lib";

interface FutureTabProps {
  searchQuery: string;
}

export function FutureTab({ searchQuery }: FutureTabProps) {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const { portfolios } = useUserProfileContext();

  const filteredPortfolios = filterFuturePortfolios(portfolios, searchQuery, new Date());
  const grouped = groupByDate(filteredPortfolios);

  return <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />;
}
