"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { UserVoteList } from "./features/list/components/UserVoteList";

export default function UserVotesPage() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const headerConfig = useMemo(
    () => ({
      title: t("votes.list.title"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  if (!communityId) return null;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <UserVoteList communityId={communityId} />
    </div>
  );
}
