import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { AppPortfolio } from "@/app/users/features/shared/types";
import { PortfolioGrid } from "../ui/PortfolioGrid";
import { presentPortfolioCard } from "../../presenters/presentPortfolioCard";
import React from "react";

type Props = {
  grouped: Record<string, AppPortfolio[]>;
  lastPortfolioRef: React.RefObject<HTMLDivElement>;
};

export const PortfolioDateGroup: React.FC<Props> = ({ grouped, lastPortfolioRef }) => (
  <div className="mt-4 space-y-8">
    {Object.entries(grouped).map(([date, items]) => {
      const dateObj = parse(date, "yyyy年M月d日", new Date());
      const isValid = !isNaN(dateObj.getTime());
      const month = isValid ? format(dateObj, "M", { locale: ja }) : "";
      const day = isValid ? format(dateObj, "dd", { locale: ja }) : "";
      const weekday = isValid ? format(dateObj, "E", { locale: ja }) : "";
      const viewModels = items.map(presentPortfolioCard);

      return (
        <div key={date}>
          <div className="text-xl font-bold mb-2 flex items-end">
            <span className="text-caption self-start">{month}</span>
            <span className="self-start text-caption pl-1">/</span>
            <span className="text-3xl">{day}</span>
            <span className="text-xs ml-1 mb-1">({weekday})</span>
          </div>
          <PortfolioGrid
            viewModels={viewModels}
            isLoadingMore={false}
            hasMore={false}
            lastPortfolioRef={lastPortfolioRef}
          />
        </div>
      );
    })}
  </div>
);
