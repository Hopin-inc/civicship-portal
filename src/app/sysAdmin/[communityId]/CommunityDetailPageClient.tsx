"use client";

import type { GqlGetSysAdminCommunityDetailQuery } from "@/types/graphql";
import { CommunityDashboardDetail } from "@/app/sysAdmin/features/communityDetail/components/CommunityDashboardDetail";

type Props = {
  communityId: string;
  initialData: GqlGetSysAdminCommunityDetailQuery["sysAdminCommunityDetail"] | null;
};

export function CommunityDetailPageClient({ communityId, initialData }: Props) {
  return (
    <CommunityDashboardDetail communityId={communityId} initialData={initialData} />
  );
}
