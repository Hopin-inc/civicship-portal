"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApolloQueryResult } from "@apollo/client";

type Args<Q, Input extends { cursor?: string | null }> = {
  hasNextPage: boolean;
  nextCursor: string | null | undefined;
  fetchMore: (opts: { variables: { input: Input } }) => Promise<ApolloQueryResult<Q>>;
  baseVariables: Input;
};

export function useMemberListPagination<
  Q,
  Input extends { cursor?: string | null },
>({ hasNextPage, nextCursor, fetchMore, baseVariables }: Args<Q, Input>) {
  const [loadingMore, setLoadingMore] = useState(false);

  // 呼び出し時点の最新値を ref 経由で参照することで loadMore の identity を安定化させる。
  // これにより MemberListPanel 側の useCallback / useEffect が各依存の参照変化で
  // 不要に再生成されるのを防ぎ、react-window の onRowsRendered に渡すハンドラが
  // 安定する。
  const latestRef = useRef({ hasNextPage, nextCursor, fetchMore, baseVariables, loadingMore });
  useEffect(() => {
    latestRef.current = { hasNextPage, nextCursor, fetchMore, baseVariables, loadingMore };
  });

  const loadMore = useCallback(async () => {
    const snap = latestRef.current;
    if (!snap.hasNextPage || !snap.nextCursor || snap.loadingMore) return;
    setLoadingMore(true);
    try {
      await snap.fetchMore({
        variables: {
          input: { ...snap.baseVariables, cursor: snap.nextCursor },
        },
      });
    } finally {
      setLoadingMore(false);
    }
  }, []);

  return { loadMore, loadingMore, hasNextPage: !!hasNextPage };
}
