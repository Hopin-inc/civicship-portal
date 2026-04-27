"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * GraphQL Connection 型 (Relay 互換) の最小形。
 * 各 query の Connection 型はこれに structurally compatible なので、
 * `as` cast せずにそのまま渡せる。
 */
export type ConnectionLike<TItem> = {
  edges?:
    | Array<{
        cursor: string;
        node?: TItem | null;
      } | null>
    | null;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | null;
  };
  totalCount?: number;
};

type FetchMore<TItem> = (
  cursor: string,
  first: number,
) => Promise<ConnectionLike<TItem>>;

type Options<TItem> = {
  initial: ConnectionLike<TItem>;
  fetchMore: FetchMore<TItem>;
  pageSize?: number;
  onError?: (err: unknown) => void;
};

type Result<TItem> = {
  items: TItem[];
  hasNextPage: boolean;
  loading: boolean;
  loadMore: () => Promise<void>;
  reset: (next: ConnectionLike<TItem>) => void;
};

function extractItems<TItem>(conn: ConnectionLike<TItem>): TItem[] {
  return (
    conn.edges
      ?.map((e) => e?.node)
      .filter((n): n is TItem => n != null) ?? []
  );
}

/**
 * GraphQL Connection を cursor pagination で消費する generic hook。
 *
 * 以下の流れを抽象化:
 *   1. 初期 Connection を items にバラす
 *   2. loadMore 呼び出しで fetchMore(cursor) → 結果を items に append
 *   3. hasNextPage / endCursor を内部 state で管理
 *
 * Apollo の useQuery + fetchMore パターンに被せる場合は、
 * fetchMore コールバック内で client.query などを使って次ページを取得する
 * function を渡す。
 */
export function useCursorPagination<TItem>({
  initial,
  fetchMore,
  pageSize = 20,
  onError,
}: Options<TItem>): Result<TItem> {
  const [items, setItems] = useState<TItem[]>(() => extractItems(initial));
  const [endCursor, setEndCursor] = useState<string | null>(
    initial.pageInfo.endCursor ?? null,
  );
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initial.pageInfo.hasNextPage,
  );
  const [loading, setLoading] = useState(false);

  // initial が変わった (filter 切替などで親が再 fetch した) ときに同期
  useEffect(() => {
    setItems(extractItems(initial));
    setEndCursor(initial.pageInfo.endCursor ?? null);
    setHasNextPage(initial.pageInfo.hasNextPage);
  }, [initial]);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage || !endCursor) return;
    setLoading(true);
    try {
      const next = await fetchMore(endCursor, pageSize);
      setItems((prev) => [...prev, ...extractItems(next)]);
      setEndCursor(next.pageInfo.endCursor ?? null);
      setHasNextPage(next.pageInfo.hasNextPage);
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, endCursor, fetchMore, pageSize, onError]);

  const reset = useCallback((next: ConnectionLike<TItem>) => {
    setItems(extractItems(next));
    setEndCursor(next.pageInfo.endCursor ?? null);
    setHasNextPage(next.pageInfo.hasNextPage);
  }, []);

  return { items, hasNextPage, loading, loadMore, reset };
}
