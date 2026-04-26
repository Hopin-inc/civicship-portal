import { fetchSysAdminCommunityDetailServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminCommunityDetail";
import { DEFAULT_SEGMENT_THRESHOLDS } from "@/app/sysAdmin/_shared/derive";
import {
  GqlSysAdminSortOrder,
  GqlSysAdminUserSortField,
} from "@/types/graphql";
import { CommunityDetailPageClient } from "./CommunityDetailPageClient";

type Props = {
  params: Promise<{ communityId: string }>;
};

// ヘッダーの title は CommunityDetailPageClient 側でデータ取得後に動的に
// community 名をセットする (useHeaderConfig をクライアント層で呼ぶため)。
export default async function SysAdminCommunityDetailPage({ params }: Props) {
  const { communityId } = await params;

  // SSR 用デフォルト input。useDashboardControls / useCommunityDetail のデフォルトと一致させる。
  const initialData = await fetchSysAdminCommunityDetailServer({
    communityId,
    asOf: undefined,
    segmentThresholds: DEFAULT_SEGMENT_THRESHOLDS,
    windowMonths: 3,
    userFilter: {},
    userSort: {
      field: GqlSysAdminUserSortField.TotalPointsOut,
      order: GqlSysAdminSortOrder.Desc,
    },
    limit: 50,
  });

  return (
    <div className="mx-auto max-w-7xl p-4">
      <CommunityDetailPageClient communityId={communityId} initialData={initialData} />
    </div>
  );
}
