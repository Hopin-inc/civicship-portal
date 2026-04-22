"use client";

import { useCallback, useEffect } from "react";
import type { ApolloQueryResult } from "@apollo/client";
import { List, type RowComponentProps } from "react-window";
import type {
  GqlGetSysAdminCommunityDetailQuery,
  GqlSysAdminCommunityDetailInput,
  GqlSysAdminMemberList,
  GqlSysAdminMemberRow,
  GqlSysAdminUserSortField,
} from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import type { MemberFilter, MemberSort } from "../hooks/useDetailControls";
import { useMemberListPagination } from "../hooks/useMemberListPagination";
import { MemberFilters } from "./MemberFilters";
import { MemberSortHeader } from "./MemberSortControls";

type Props = {
  memberList: GqlSysAdminMemberList | null;
  filter: MemberFilter;
  sort: MemberSort;
  onFilterChange: (next: MemberFilter) => void;
  onResetFilter: () => void;
  onToggleSort: (field: GqlSysAdminUserSortField) => void;
  baseInput: GqlSysAdminCommunityDetailInput;
  fetchMore: (opts: {
    variables: { input: GqlSysAdminCommunityDetailInput };
  }) => Promise<ApolloQueryResult<GqlGetSysAdminCommunityDetailQuery>>;
  loading: boolean;
};

const ROW_HEIGHT = 56;
const LIST_HEIGHT = 560;
const PREFETCH_THRESHOLD = 10;

function MemberRow({
  index,
  users,
}: RowComponentProps<{ users: GqlSysAdminMemberRow[] }>) {
  const row = users[index];
  if (!row) {
    return (
      <div className="flex items-center border-b px-3 py-2" style={{ height: ROW_HEIGHT }}>
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  return (
    <div
      className="flex items-center border-b px-3 py-2 text-sm"
      style={{ height: ROW_HEIGHT }}
    >
      <div className="flex-1 truncate">{row.name ?? "-"}</div>
      <div className="w-24 text-right tabular-nums">{toPct(row.userSendRate)}</div>
      <div className="w-28 text-right tabular-nums">{toIntJa(row.totalPointsOut)}</div>
      <div className="w-24 text-right tabular-nums">{toIntJa(row.donationOutMonths)}</div>
      <div className="w-24 text-right tabular-nums">{toIntJa(row.monthsIn)}</div>
    </div>
  );
}

export function MemberListPanel({
  memberList,
  filter,
  sort,
  onFilterChange,
  onResetFilter,
  onToggleSort,
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

  useEffect(() => {
    // 初期 or sort 切替後、1 画面分に満たず hasNextPage=true なら自動的にもう 1 ページ取る
    if (
      hasNextPage &&
      !loadingMore &&
      users.length > 0 &&
      users.length * ROW_HEIGHT < LIST_HEIGHT
    ) {
      void loadMore();
    }
  }, [hasNextPage, loadingMore, users.length, loadMore]);

  return (
    <ChartCard
      title={sysAdminDashboardJa.detail.member.title}
      description={`${users.length}${hasNextPage ? "+" : ""} 件`}
    >
      <div className="flex flex-col gap-3">
        <MemberFilters
          value={filter}
          onChange={onFilterChange}
          onReset={onResetFilter}
          disabled={loading}
        />
        <div className="rounded-md border">
          <MemberSortHeader sort={sort} onToggle={onToggleSort} />
          {users.length === 0 && !loading ? (
            <div className="p-6">
              <Empty>{sysAdminDashboardJa.state.empty}</Empty>
            </div>
          ) : (
            <List
              rowCount={users.length}
              rowHeight={ROW_HEIGHT}
              rowComponent={MemberRow}
              rowProps={{ users }}
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
      </div>
    </ChartCard>
  );
}
