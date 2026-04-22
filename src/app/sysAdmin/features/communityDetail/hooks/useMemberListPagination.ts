"use client";

import { useCallback, useState } from "react";
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

  const loadMore = useCallback(async () => {
    if (!hasNextPage || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          input: { ...baseVariables, cursor: nextCursor },
        },
      });
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, nextCursor, loadingMore, fetchMore, baseVariables]);

  return { loadMore, loadingMore, hasNextPage: !!hasNextPage };
}
