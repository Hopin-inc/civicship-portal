import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getCurrentRegionName, currentCommunityConfig } from "@/lib/communities/metadata";
import Link from "next/link";

type PortfolioEmptyStateProps = {
  isOwner: boolean;
};

export const PortfolioEmptyState = ({ isOwner }: PortfolioEmptyStateProps) => {
  return (
    <Empty className="mt-8">
      <EmptyHeader>
        <EmptyMedia variant="gradient">
          <Search className="h-8 w-8" />
        </EmptyMedia>
        <EmptyDescription>
          {isOwner
            ? `${getCurrentRegionName()}の素敵な人との\n関わりを探してみましょう`
            : "体験に参加すると、タイムラインが作成されます"}
        </EmptyDescription>
      </EmptyHeader>
      {isOwner && (
        <EmptyContent>
          <Button asChild variant="primary" size="lg" className="px-16">
            <Link href={currentCommunityConfig.rootPath ?? "/"}>
              関わりを探す
            </Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
