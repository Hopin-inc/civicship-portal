"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

  // 同期的な並行制御用 ref。setLoading は非同期反映のため、
  // rapid loadMore() 呼び出し (例: スクロール / 連打) で重複 fetch が
  // 起きるのを防ぐ。endCursor / hasNextPage も同様に最新値を保持。
  const loadingRef = useRef(false);
  const endCursorRef = useRef<string | null>(initial.pageInfo.endCursor ?? null);
  const hasNextPageRef = useRef<boolean>(initial.pageInfo.hasNextPage);

  // initial 切替 (= filter 変更などで親が再 fetch) と in-flight な loadMore の
  // 競合で stale append が起きないよう、世代カウンタで in-flight 結果を破棄する。
  const generationRef = useRef(0);

  // initial が変わった (filter 切替などで親が再 fetch した) ときに同期
  useEffect(() => {
    generationRef.current += 1;
    // in-flight な loadMore の loadingRef が立ったままだと、新しい initial に
    // 対する次の loadMore が「まだ読み込み中」と誤判定されてブロックされる。
    // generation でレスポンスは捨てられるので、guard も明示的にリセットする。
    loadingRef.current = false;
    setItems(extractItems(initial));
    setEndCursor(initial.pageInfo.endCursor ?? null);
    setHasNextPage(initial.pageInfo.hasNextPage);
    setLoading(false);
    endCursorRef.current = initial.pageInfo.endCursor ?? null;
    hasNextPageRef.current = initial.pageInfo.hasNextPage;
  }, [initial]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextPageRef.current || !endCursorRef.current) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    const cursor = endCursorRef.current;
    const requestGeneration = generationRef.current;
    try {
      const next = await fetchMore(cursor, pageSize);
      // 取得中に initial が再投入された場合は結果を捨てる (stale page を append しない)
      if (requestGeneration !== generationRef.current) return;
      const nextEndCursor = next.pageInfo.endCursor ?? null;
      const nextHasNextPage = next.pageInfo.hasNextPage;
      endCursorRef.current = nextEndCursor;
      hasNextPageRef.current = nextHasNextPage;
      setItems((prev) => [...prev, ...extractItems(next)]);
      setEndCursor(nextEndCursor);
      setHasNextPage(nextHasNextPage);
    } catch (err) {
      if (requestGeneration === generationRef.current) {
        onError?.(err);
      }
    } finally {
      // generation が一致する request だけが loadingRef を解除できる。
      // stale な finally で解除すると、その間に始まった新 generation の
      // loadMore の guard を誤ってクリアしてしまう。
      if (requestGeneration === generationRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [fetchMore, pageSize, onError]);

  const reset = useCallback((next: ConnectionLike<TItem>) => {
    generationRef.current += 1;
    loadingRef.current = false;
    const nextEndCursor = next.pageInfo.endCursor ?? null;
    const nextHasNextPage = next.pageInfo.hasNextPage;
    endCursorRef.current = nextEndCursor;
    hasNextPageRef.current = nextHasNextPage;
    setItems(extractItems(next));
    setEndCursor(nextEndCursor);
    setHasNextPage(nextHasNextPage);
    setLoading(false);
  }, []);

  return { items, hasNextPage, loading, loadMore, reset };
}
