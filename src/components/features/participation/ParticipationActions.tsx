

import React from 'react';
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { GqlParticipationStatus } from '@/types/graphql';
import { AddParticipationPhotosModal } from "@/components/features/participation/AddParticipationPhotosModal";
import type { Opportunity, Participation } from '../../../types';

interface ParticipationActionsProps {
  opportunity: Opportunity;
  participation: Participation;
  cancellationDeadline: Date;
  isCancellable: boolean;
  isUploading: boolean;
  onAddPhotos: (images: File[], comment: string) => void;
}

export const ParticipationActions: React.FC<ParticipationActionsProps> = ({
  opportunity,
  participation,
  cancellationDeadline,
  isCancellable,
  isUploading,
  onAddPhotos,
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Link 
          href={`/activities/${opportunity.id}`} 
          className="w-full py-4 px-8 rounded-full text-center border-2 border-[#4361EE] text-[#4361EE] transition-colors"
        >
          体験の詳細を見る
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {participation?.node.status === GqlParticipationStatus.Participated ? (
              <AddParticipationPhotosModal
                trigger={
                  <Button 
                    variant="primary"
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? "アップロード中..." : "写真を追加"}
                  </Button>
                }
                onSubmit={onAddPhotos}
              />
            ) : (
              <>
                <div className="flex flex-col text-muted-foreground min-w-fit">
                  <span className="text-sm">キャンセル期限:</span>
                  <span className="text-sm font-bold">
                    {format(cancellationDeadline, "M/d(E)", { locale: ja })}
                  </span>
                </div>
                {isCancellable ? (
                  <Button 
                    variant="destructive"
                    className="shrink-0"
                  >
                    予約をキャンセル
                  </Button>
                ) : (
                  <Button
                    variant="tertiary"
                    className="shrink-0 text-gray-400"
                    disabled
                  >
                    キャンセル不可
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipationActions;
