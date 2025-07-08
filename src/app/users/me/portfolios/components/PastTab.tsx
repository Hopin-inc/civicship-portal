import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import { useMemo, useRef } from "react";
import { groupByDate } from "./portfoliosList";
import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { PortfolioGrid } from "@/app/users/components/UserPortfolioList";
import { AppPortfolio } from "@/app/users/data/type";
import { GqlUser, Maybe } from "@/types/graphql";

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
        <div className="mt-4 space-y-8">
            {Object.entries(grouped).map(([date, items]) => {
                const dateObj = parse(date, "yyyy年M月d日", new Date());
                const isValid = !isNaN(dateObj.getTime());

                const month = isValid ? format(dateObj, "M", { locale: ja }) : "";
                const day = isValid ? format(dateObj, "dd", { locale: ja }) : "";
                const weekday = isValid ? format(dateObj, "E", { locale: ja }) : "";

                return (
                    <div key={date}>
                        <div className="text-xl font-bold mb-2 flex items-end">
                            <span className="text-caption self-start">{month}</span>
                            <span className="self-start text-caption pl-1">/</span>
                            <span className="text-3xl">{day}</span>
                            <span className="text-xs ml-1 mb-1">({weekday})</span>
                        </div>
                        <PortfolioGrid
                            portfolios={items as AppPortfolio[]}
                            isLoadingMore={false}
                            hasMore={false}
                            lastPortfolioRef={lastPortfolioRef}
                        />
                    </div>
                );
            })}
        </div>
    );
}