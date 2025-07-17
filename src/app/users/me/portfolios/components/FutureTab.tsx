"use client";
import { groupByDate } from "./portfoliosList";
import { useMemo, useRef } from "react";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import { GqlSortDirection, Maybe } from "@/types/graphql";
import { GqlUser } from "@/types/graphql";
import { PortfolioDateGroup } from "./PortfolioDateGroup";

interface FutureTabProps {
    searchQuery: string;
    currentUser: Maybe<GqlUser> | undefined;
}

export default function FutureTab({ searchQuery, currentUser }: FutureTabProps) {
    const lastPortfolioRef = useRef<HTMLDivElement>(null);
    const today = useMemo(() => {
        const d = new Date();
        return d;
    }, []);
    const { userData } = useUserProfile(
      currentUser?.id,
      {
        dateRange: {
          gte: today,
        },
        keyword: searchQuery,
      },
      {
        date: GqlSortDirection.Asc,
      },
    );
    const portfolios = userData?.portfolios;
    const grouped = groupByDate(portfolios ?? []);
    return (
        <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />
    );
}