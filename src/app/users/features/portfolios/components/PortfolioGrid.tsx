import { RefObject } from "react";
import { PortfolioCardViewModel } from "../presenters/types";
import { PortfolioCard } from "./PortfolioCard";

type PortfolioGridProps = {
  viewModels: PortfolioCardViewModel[];
  isLoadingMore: boolean;
  hasMore: boolean;
  lastPortfolioRef: RefObject<HTMLDivElement>;
};

export const PortfolioGrid = ({
  viewModels,
  isLoadingMore,
  hasMore,
  lastPortfolioRef,
}: PortfolioGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {viewModels.map((viewModel, index) => (
        <PortfolioCard
          key={viewModel.id}
          viewModel={viewModel}
          isLast={index === viewModels.length - 1}
          lastRef={lastPortfolioRef}
        />
      ))}
      {isLoadingMore && (
        <div className="col-span-2 flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      )}
    </div>
  );
};
