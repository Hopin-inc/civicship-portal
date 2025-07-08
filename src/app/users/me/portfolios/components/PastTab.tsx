import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import { useMemo, useRef } from "react";
import { groupByDate } from "./portfoliosList";
import { GqlUser, Maybe } from "@/types/graphql";
import { PortfolioDateGroup } from "./PortfolioDateGroup";

interface PastTabProps {
    searchQuery: string;
    currentUser: Maybe<GqlUser> | undefined;
}

export default function PastTab({ searchQuery, currentUser }: PastTabProps) {
    const lastPortfolioRef = useRef<HTMLDivElement>(null);
    const today = useMemo(() => {
        const d = new Date();
        return d;
    }, []);
    const { userData } = useUserProfile(
      currentUser?.id,
      {
        dateRange: {
          lt: today,
        },
        keyword: searchQuery,
      },
    );
    const portfolios = userData?.portfolios;
    const grouped = groupByDate(portfolios ?? []);
    return (
        <PortfolioDateGroup grouped={grouped} lastPortfolioRef={lastPortfolioRef} />
    );
}