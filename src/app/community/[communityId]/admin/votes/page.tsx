"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useAppRouter } from "@/lib/navigation";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Button } from "@/components/ui/button";
import { VoteList } from "./features/list/components/VoteList";

export default function AdminVotesPage() {
  const t = useTranslations();
  const router = useAppRouter();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const headerConfig = useMemo(
    () => ({
      title: t("adminVotes.list.title"),
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  if (!communityId) {
    return null;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-end mb-4">
        <Button
          onClick={() => router.push("/admin/votes/new")}
          variant="primary"
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          {t("adminVotes.list.createButton")}
        </Button>
      </div>

      <VoteList communityId={communityId} />
    </div>
  );
}
