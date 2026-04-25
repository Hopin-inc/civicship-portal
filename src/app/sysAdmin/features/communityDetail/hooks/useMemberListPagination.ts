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
  const latestRef = useRef({ hasNextPage, nextCursor, fetchMore, baseVariables });
  useEffect(() => {
    latestRef.current = { hasNextPage, nextCursor, fetchMore, baseVariables };
  });

  // setLoadingMore は非同期更新のため、高頻度スクロール等で loadMore が
  // 並列に呼ばれると `loadingMore` の read-before-write で同じ cursor の
  // fetchMore が重複発火する可能性がある。Apollo merge は不変に append するので
  // 重複 user が混入する。同期的な ref フラグで先に弾いておく。
  const inflightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (inflightRef.current) return;
    const snap = latestRef.current;
    if (!snap.hasNextPage || !snap.nextCursor) return;
    inflightRef.current = true;
    setLoadingMore(true);
    try {
      await snap.fetchMore({
        variables: {
          input: { ...snap.baseVariables, cursor: snap.nextCursor },
        },
      });
    } finally {
      inflightRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  return { loadMore, loadingMore, hasNextPage: !!hasNextPage };
}
