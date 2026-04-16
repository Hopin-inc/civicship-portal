"use client";

import { useAppRouter } from "@/lib/navigation";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { VoteEditorLayout } from "../features/editor/components/VoteEditorLayout";
import { VoteTopicFormEditor } from "../features/editor/components/VoteTopicFormEditor";

export default function CreateVoteTopicPage() {
  const router = useAppRouter();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  if (!communityId) {
    return null;
  }

  return (
    <VoteEditorLayout>
      <VoteTopicFormEditor
        communityId={communityId}
        onSuccess={() => router.push("/admin")}
      />
    </VoteEditorLayout>
  );
}
