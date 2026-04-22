"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ApolloQueryResult } from "@apollo/client";
import { List, type RowComponentProps } from "react-window";
import {
  GqlSysAdminUserSortField,
  type GqlGetSysAdminCommunityDetailQuery,
  type GqlSysAdminCommunityDetailInput,
  type GqlSysAdminMemberList,
  type GqlSysAdminMemberRow,
} from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import { EmptyChart } from "@/app/sysAdmin/_shared/components/EmptyChart";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { SendRateDot } from "@/app/sysAdmin/_shared/components/SendRateDot";
import { Skeleton } from "@/components/ui/skeleton";
import { toCompactJa, toIntJa } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import type { MemberFilter, MemberSort } from "../hooks/useDetailControls";
import { useMemberListPagination } from "../hooks/useMemberListPagination";
import { MemberSortSelect } from "./MemberSortSelect";

type Props = {
  memberList: GqlSysAdminMemberList | null;
  filter: MemberFilter;
  sort: MemberSort;
  tier1: number;
  tier2: number;
  onFilterChange: (next: MemberFilter) => void;
  onResetFilter: () => void;
  onSortFieldChange: (field: GqlSysAdminUserSortField) => void;
  baseInput: GqlSysAdminCommunityDetailInput;
  fetchMore: (opts: {
    variables: { input: GqlSysAdminCommunityDetailInput };
  }) => Promise<ApolloQueryResult<GqlGetSysAdminCommunityDetailQuery>>;
  loading: boolean;
};

const ROW_HEIGHT = 60;
const LIST_HEIGHT = 540;
const PREFETCH_THRESHOLD = 10;

type RowProps = {
  users: GqlSysAdminMemberRow[];
  sortField: GqlSysAdminUserSortField;
  tier1: number;
  tier2: number;
};

/**
 * Sort key ごとに meta 行の表示を切り替え。ユーザーが何で並び替えたかの
 * 根拠を必ず行内に見せる (totalPointsOut 順なのに pt が見えない問題の解消)。
 */
function formatMetaForSort(
  row: GqlSysAdminMemberRow,
  sortField: GqlSysAdminUserSortField,
): string {
  const t = sysAdminDashboardJa.detail.member;
  const tenure = `${t.tenurePrefix}${row.monthsIn}${t.tenureSuffix}`;
  switch (sortField) {
    case "TOTAL_POINTS_OUT":
      return `${tenure} · 累計 ${toCompactJa(row.totalPointsOut)}pt`;
    case "DONATION_OUT_MONTHS":
      return `${tenure} · 送付 ${toIntJa(row.donationOutMonths)}ヶ月`;
    case "MONTHS_IN":
    case "SEND_RATE":
    default:
      return tenure;
  }
}

function MemberRow({
  index,
  users,
  sortField,
  tier1,
  tier2,
}: RowComponentProps<RowProps>) {
  const row = users[index];
  if (!row) {
    return (
      <div className="flex items-center border-b px-3 py-2" style={{ height: ROW_HEIGHT }}>
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  const meta = formatMetaForSort(row, sortField);
  const sendRatePct = `${Math.round(row.userSendRate * 100)}%`;
  return (
    <div
      className="flex items-center justify-between gap-3 border-b px-3 py-2"
      style={{ height: ROW_HEIGHT }}
    >
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{row.name ?? "-"}</span>
        <span className="truncate text-xs text-muted-foreground">{meta}</span>
      </div>
      <div className="flex items-center gap-1 tabular-nums">
        <span className="text-sm font-medium">{sendRatePct}</span>
        <SendRateDot rate={row.userSendRate} tier1={tier1} tier2={tier2} />
      </div>
    </div>
  );
}

export function MemberListPanel({
  memberList,
  filter: _filter,
  sort,
  tier1,
  tier2,
  onFilterChange: _onFilterChange,
  onResetFilter: _onResetFilter,
  onSortFieldChange,
  baseInput,
  fetchMore,
  loading,
}: Props) {
  const users = memberList?.users ?? [];
  const hasNextPage = memberList?.hasNextPage ?? false;
  const nextCursor = memberList?.nextCursor ?? null;

  const { loadMore, loadingMore } = useMemberListPagination<
    GqlGetSysAdminCommunityDetailQuery,
    GqlSysAdminCommunityDetailInput
  >({
    hasNextPage,
    nextCursor,
    fetchMore,
    baseVariables: baseInput,
  });

  const handleRowsRendered = useCallback(
    ({ stopIndex }: { startIndex: number; stopIndex: number }) => {
      if (stopIndex >= users.length - PREFETCH_THRESHOLD) void loadMore();
    },
    [users.length, loadMore],
  );

  // userFilter は keyArgs に含めているため、onFilterChange で state が変わる
  // → useCommunityDetail の input が変わる → Apollo が別エントリを引く (cache-and-network)
  // という自然なフローでデータが更新される。手動の evict/refetch は不要。

  // 初期 or sort 切替後、1 画面分に満たず hasNextPage=true なら自動的にもう 1 ページ取る。
  // バックエンドが hasNextPage=true を返し続けるのに users が増えないケースで
  // 無限リクエストに陥らないよう、直前に auto-load した時点の length を ref で記憶し、
  // 増えていない場合はそれ以上 auto-load しない。
  const lastAutoLoadLengthRef = useRef<number | null>(null);
  useEffect(() => {
    if (!hasNextPage || loadingMore) return;
    if (users.length === 0) return;
    if (users.length * ROW_HEIGHT >= LIST_HEIGHT) return;
    if (lastAutoLoadLengthRef.current === users.length) return;
    lastAutoLoadLengthRef.current = users.length;
    void loadMore();
  }, [hasNextPage, loadingMore, users.length, loadMore]);

  return (
    <ChartCard
      title={
        <span className="inline-flex items-center gap-2">
          <span>{sysAdminDashboardJa.detail.member.title}</span>
          <MetricInfoButton metricKey="userSendRate" />
        </span>
      }
      description={`${users.length}${hasNextPage ? "+" : ""} 件`}
      actions={<MemberSortSelect field={sort.field} onChange={onSortFieldChange} />}
    >
      <div className="rounded-md border">
        {users.length === 0 && !loading ? (
          <EmptyChart message={sysAdminDashboardJa.state.empty} />
        ) : (
          <List
            rowCount={users.length}
            rowHeight={ROW_HEIGHT}
            rowComponent={MemberRow}
            rowProps={{ users, sortField: sort.field, tier1, tier2 }}
            onRowsRendered={handleRowsRendered}
            style={{ height: LIST_HEIGHT }}
          />
        )}
        {loadingMore && (
          <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">
            {sysAdminDashboardJa.state.loading}
          </div>
        )}
      </div>
    </ChartCard>
  );
}
