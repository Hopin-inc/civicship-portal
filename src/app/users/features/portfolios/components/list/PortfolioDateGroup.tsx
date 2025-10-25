import { AppPortfolio } from "@/app/users/features/shared/types";
import { PortfolioGrid } from "../ui/PortfolioGrid";
import { presentPortfolioCard } from "../../presenters/presentPortfolioCard";
import { presentDateGroup } from "../../presenters/presentDateGroup";
import React from "react";

type Props = {
  grouped: Record<string, AppPortfolio[]>;
  lastPortfolioRef: React.RefObject<HTMLDivElement>;
};

export const PortfolioDateGroup: React.FC<Props> = ({ grouped, lastPortfolioRef }) => (
  <div className="mt-4 space-y-8">
    {Object.entries(grouped).map(([date, items]) => {
      const dateViewModel = presentDateGroup(date);
      const viewModels = items.map(presentPortfolioCard);

      return (
        <div key={date}>
          <div className="text-xl font-bold mb-2 flex items-end">
            <span className="text-caption self-start">{dateViewModel.month}</span>
            <span className="self-start text-caption pl-1">/</span>
            <span className="text-3xl">{dateViewModel.day}</span>
            <span className="text-xs ml-1 mb-1">({dateViewModel.weekday})</span>
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
