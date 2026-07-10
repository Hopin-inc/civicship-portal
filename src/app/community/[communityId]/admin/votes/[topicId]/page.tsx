"use client";

import { useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useAppRouter } from "@/lib/navigation";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useGetVoteTopicQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { VoteDetail } from "../features/detail/components/VoteDetail";
import { AdminVoteDetailFooter } from "../features/detail/components/AdminVoteDetailFooter";
import { presentVoteDetail } from "../features/detail/presenters/presentVoteDetail";
import { useVoteTopicActions } from "../features/list/hooks/useVoteTopicActions";
import { ConfirmDialog } from "../features/shared/components/ConfirmDialog";

export default function VoteDetailPage() {
  const t = useTranslations();
  const router = useAppRouter();
  const params = useParams<{ topicId: string }>();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const headerConfig = useMemo(
    () => ({
      title: t("adminVotes.detail.title"),
      showLogo: false,
      showBackButton: true,
      backTo: "/admin/votes",
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const { data, loading, error } = useGetVoteTopicQuery({
    variables: { id: params.topicId },
    fetchPolicy: "network-only",
  });

  const { handleEdit, handleDelete, deleting } = useVoteTopicActions({
    refetch: () => router.push("/admin/votes"),
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (!communityId) {
    return null;
  }

  if (loading) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
    return <ErrorState title={t("adminVotes.list.loadError")} />;
  }

  if (!data?.voteTopic) {
    return notFound();
  }

  const view = presentVoteDetail(data.voteTopic);

  return (
    <>
      <VoteDetail view={view} />
      <AdminVoteDetailFooter
        phase={view.phase}
        onEdit={() => handleEdit(view.id)}
        onDelete={() => setConfirmDeleteOpen(true)}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={(open) => {
          if (!deleting) setConfirmDeleteOpen(open);
        }}
        title={t("adminVotes.list.actions.delete")}
        description={t("adminVotes.list.deleteConfirm")}
        confirmLabel={t("adminVotes.list.actions.delete")}
        cancelLabel={t("adminVotes.common.cancel")}
        onConfirm={() => handleDelete(view.id)}
        confirming={deleting}
        destructive
      />
    </>
  );
}
