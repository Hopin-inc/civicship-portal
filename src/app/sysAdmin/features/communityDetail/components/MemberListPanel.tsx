"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ApolloQueryResult } from "@apollo/client";
import { List, type RowComponentProps } from "react-window";
import {
  type GqlGetSysAdminCommunityDetailQuery,
  type GqlSysAdminCommunityDetailInput,
  type GqlSysAdminMemberList,
  type GqlSysAdminMemberRow,
} from "@/types/graphql";
import { EmptyChart } from "@/app/sysAdmin/_shared/components/EmptyChart";
import { SendRateDot } from "@/app/sysAdmin/_shared/components/SendRateDot";
import { toCompactJa } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { useMemberListPagination } from "../hooks/useMemberListPagination";

type Props = {
  memberList: GqlSysAdminMemberList | null;
  tier1: number;
  tier2: number;
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
  tier1: number;
  tier2: number;
};

function MemberRow({ index, users, tier1, tier2 }: RowComponentProps<RowProps>) {
  // rowCount === users.length で運用しているので users[index] は必ず定義済み。
  const row = users[index]!;
  const t = sysAdminDashboardJa.detail.member;
  const tenure = `${t.tenurePrefix}${row.monthsIn}${t.tenureSuffix}`;
  const meta = `${tenure} · 累計 ${toCompactJa(row.totalPointsOut)}pt`;
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
  tier1,
  tier2,
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

  // 初期取得後、1 画面分に満たず hasNextPage=true なら自動的にもう 1 ページ取る。
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
    <div className="rounded-md border">
      {users.length === 0 && !loading ? (
        <EmptyChart message={sysAdminDashboardJa.state.empty} />
      ) : (
        <List
          rowCount={users.length}
          rowHeight={ROW_HEIGHT}
          rowComponent={MemberRow}
          rowProps={{ users, tier1, tier2 }}
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
  );
}
