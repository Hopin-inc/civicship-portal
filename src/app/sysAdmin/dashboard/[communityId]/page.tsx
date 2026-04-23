"use client";

import { use } from "react";
import { CommunityDashboardDetail } from "@/app/sysAdmin/features/communityDetail/components/CommunityDashboardDetail";

type Props = {
  params: Promise<{ communityId: string }>;
};

// ヘッダーの title は CommunityDashboardDetail 側でデータ取得後に動的に
// community 名をセットする (useHeaderConfig をクライアント層で呼ぶため)。
export default function SysAdminCommunityDetailPage({ params }: Props) {
  const { communityId } = use(params);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <CommunityDashboardDetail communityId={communityId} />
    </div>
  );
}
