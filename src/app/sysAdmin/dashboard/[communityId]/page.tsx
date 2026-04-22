"use client";

import { use, useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CommunityDashboardDetail } from "@/app/sysAdmin/features/communityDetail/components/CommunityDashboardDetail";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  params: Promise<{ communityId: string }>;
};

export default function SysAdminCommunityDetailPage({ params }: Props) {
  const { communityId } = use(params);

  const headerConfig = useMemo(
    () => ({
      title: sysAdminDashboardJa.detail.title,
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <CommunityDashboardDetail communityId={communityId} />
    </div>
  );
}
