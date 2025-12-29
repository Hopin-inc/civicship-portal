"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { cn } from "@/lib/utils";
import { Edit, MoreVertical } from "lucide-react";
import { GqlPublishStatus } from "@/types/graphql";
import { useOpportunityActions } from "@/app/admin/opportunities/features/list/hooks/useOpportunityActions";

interface AdminOpportunityDetailsFooterProps {
  opportunityId: string;
  price: number | null;
  point: number | null;
  pointsRequired?: number | null;
  publishStatus: GqlPublishStatus;
  refetch?: () => void;
}

export const AdminOpportunityDetailsFooter: React.FC<AdminOpportunityDetailsFooterProps> = ({
  opportunityId,
  price,
  point,
  pointsRequired,
  publishStatus,
  refetch,
}) => {
  const router = useRouter();
  const { isLiffClient } = useAuthEnvironment();
  const { handleEdit, handleBackToDraft, handleCopyUrl, handleDeleteDraft } =
    useOpportunityActions(refetch);

  const isPublicOrInternal =
    publishStatus === GqlPublishStatus.Public || publishStatus === GqlPublishStatus.CommunityInternal;
  const isDraft = publishStatus === GqlPublishStatus.Private;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div
        className={cn(
          "max-w-mobile-l mx-auto px-4 flex items-center justify-between w-full",
          isLiffClient ? "h-28" : "h-20",
        )}
      >
        <div>
          <div>
            <p className="text-body-sm text-muted-foreground">1人あたり</p>
            {price === 0 && pointsRequired != null && pointsRequired > 0 ? (
              <p>
                <span className="font-bold text-body-lg">{pointsRequired.toLocaleString()}pt</span>
                <span className="text-sm font-normal">必要</span>
              </p>
            ) : price !== null ? (
              <p className="text-body-lg font-bold">{`${price.toLocaleString()}円〜`}</p>
            ) : point === null ? (
              <p className="text-body-lg font-bold text-muted-foreground/50">料金未定</p>
            ) : null}
            {point != null && (
              <p>
                <span className="font-bold text-body-lg">{point.toLocaleString()}pt</span>
                <span className="text-sm font-normal">もらえる</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            className="px-6"
            onClick={() => handleEdit(opportunityId)}
          >
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="px-3">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">その他のアクション</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              {isPublicOrInternal && (
                <>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleBackToDraft(opportunityId);
                    }}
                  >
                    下書きに戻す
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleCopyUrl(opportunityId);
                    }}
                  >
                    URLをコピー
                  </DropdownMenuItem>
                </>
              )}

              {isDraft && (
                <>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleCopyUrl(opportunityId);
                    }}
                  >
                    URLをコピー
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDeleteDraft(opportunityId);
                    }}
                  >
                    下書きを削除
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  );
};
