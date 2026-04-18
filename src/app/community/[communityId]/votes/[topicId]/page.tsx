"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useGetVoteTopicForUserQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { VoteCastPage } from "../features/cast/components/VoteCastPage";
import { presentVoteCastView } from "../features/cast/presenters/presentVoteCastView";

export default function UserVotePage() {
  const t = useTranslations();
  const params = useParams<{ topicId: string }>();

  const { data, loading, error } = useGetVoteTopicForUserQuery({
    variables: { id: params.topicId },
    fetchPolicy: "cache-and-network",
  });

  const view = useMemo(
    () => (data?.voteTopic ? presentVoteCastView(data.voteTopic) : null),
    [data],
  );

  const headerConfig = useMemo(
    () => ({
      title: view?.title ?? t("votes.page.title"),
      showLogo: false,
      showBackButton: true,
    }),
    [view, t],
  );
  useHeaderConfig(headerConfig);

  if (loading && !data) return <LoadingIndicator fullScreen={false} />;
  if (error) return <ErrorState title={t("votes.toast.castError")} />;
  if (!data?.voteTopic) return notFound();
  if (!view) return null;

  return <VoteCastPage view={view} />;
}
