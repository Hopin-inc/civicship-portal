import EmptyStateWithSearch from "@/components/shared/EmptyStateWithSearch";
import { getCurrentRegionName } from "@/lib/communities/metadata";

type PortfolioEmptyStateProps = {
  isOwner: boolean;
};

export const PortfolioEmptyState = ({ isOwner }: PortfolioEmptyStateProps) => {
  const emptyStateProps = {
    description: isOwner
      ? `${getCurrentRegionName()}の素敵な人との\n関わりを探してみましょう`
      : "体験に参加すると、タイムラインが作成されます",
    actionLabel: isOwner ? "関わりを探す" : undefined,
    onAction: isOwner ? () => (window.location.href = "/") : undefined,
    hideActionButton: !isOwner,
  };

  return <EmptyStateWithSearch {...emptyStateProps} />;
};
