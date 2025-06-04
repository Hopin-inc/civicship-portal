"use client";

import { QuestDetail } from "@/app/activities/data/type";
import { useQuestDetails } from "../hooks/useQuestDetails";
import ActivityDetailsHeader from "@/app/activities/[id]/components/ActivityDetailsHeader";
import ActivityDetailsContent from "@/app/activities/[id]/components/ActivityDetailsContent";
import ActivityDetailsFooter from "@/app/activities/[id]/components/ActivityDetailsFooter";
import ErrorState from "@/components/shared/ErrorState";
import { useRef } from "react";
import { COMMUNITY_ID } from "@/utils";

interface QuestDetailPageClientProps {
  questDetail: QuestDetail | null;
}

export default function QuestDetailPageClient({
  questDetail: initialQuestDetail,
}: QuestDetailPageClientProps) {
  const questId = initialQuestDetail?.id || "";
  const communityId = COMMUNITY_ID;

  const { questDetail, loading, error, refetch } = useQuestDetails(
    questId,
    communityId,
    initialQuestDetail,
  );

  const refetchRef = useRef<(() => void) | null>(refetch);

  if (error) {
    return <ErrorState title="クエストの読み込みに失敗しました" refetchRef={refetchRef} />;
  }

  if (!questDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-b-2 border-foreground rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ActivityDetailsHeader opportunity={questDetail} />
      <ActivityDetailsContent
        opportunity={questDetail}
        availableDates={questDetail.slots}
        sameStateActivities={questDetail.relatedQuests}
        communityId={communityId}
      />
      <ActivityDetailsFooter opportunity={questDetail} communityId={communityId} />
    </div>
  );
}
