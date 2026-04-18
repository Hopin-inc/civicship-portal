"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppRouter } from "@/lib/navigation";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useGetVoteTopicQuery, GqlVoteTopicPhase } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { VoteEditorLayout } from "../../features/editor/components/VoteEditorLayout";
import { VoteTopicFormEditor } from "../../features/editor/components/VoteTopicFormEditor";
import { presentVoteTopicForEdit } from "../../features/editor/presenters/presentVoteTopicForEdit";

export default function EditVoteTopicPage() {
  const t = useTranslations();
  const router = useAppRouter();
  const params = useParams<{ topicId: string }>();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const { data, loading, error } = useGetVoteTopicQuery({
    variables: { id: params.topicId },
    fetchPolicy: "network-only",
  });

  const initialValues = useMemo(() => {
    if (!data?.voteTopic) return undefined;
    return presentVoteTopicForEdit(data.voteTopic);
  }, [data]);

  if (!communityId) return null;
  if (loading) return <LoadingIndicator fullScreen={false} />;
  if (error) return <ErrorState title={t("adminVotes.toast.updateError")} />;
  if (!data?.voteTopic) return notFound();

  if (data.voteTopic.phase !== GqlVoteTopicPhase.Upcoming) {
    router.push(`/admin/votes/${params.topicId}`);
    return null;
  }

  if (!initialValues) return <LoadingIndicator fullScreen={false} />;

  return (
    <VoteEditorLayout>
      <VoteTopicFormEditor
        mode="update"
        communityId={communityId}
        topicId={params.topicId}
        initialValues={initialValues}
        onSuccess={() => router.push(`/admin/votes/${params.topicId}`)}
      />
    </VoteEditorLayout>
  );
}
