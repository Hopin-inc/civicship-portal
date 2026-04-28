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
  /**
   * 論理的な「データセットの identity」を表すキー (例: filter のハッシュ、
   * variant + version など)。これが変わったとき *だけ* 内部 state を
   * `initial` で再同期する。
   *
   * 省略すると `initial` の参照 (object identity) を dep に使うので、
   * 呼び出し側で `initial` を `useMemo` などでメモ化しないと、毎レンダー
   * state が wipe されて pagination が破綻する。安全のため `resetKey` の
   * 利用を推奨。
   */
  resetKey?: string | number;
};

type Result<TItem> = {
  items: TItem[];
  hasNextPage: boolean;
  loading: boolean;
  /** 母集団件数。SSR initial と各 fetchMore レスポンスから常に最新を保つ。 */
  totalCount: number;
  /** 直近の loadMore で発生した例外。次回成功時に null に戻る。 */
  error: unknown;
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
 *   3. hasNextPage / endCursor / totalCount / error を内部 state で管理
 *
 * Apollo の useQuery + fetchMore パターンに被せる場合は、
 * fetchMore コールバック内で client.query などを使って次ページを取得する
 * function を渡す。
 *
 * ⚠ `initial` は object なので、毎レンダーで違う参照を渡すと内部 state が
 * 毎回リセットされる。安全策として:
 *   - `resetKey` を指定する (= filter / variant / version など、論理的な
 *     identity を表す primitive 値)。これが変わった時だけ state を再同期する。
 *   - `resetKey` を指定しない場合は呼び出し側で `initial` を useMemo して
 *     参照安定化させること。
 */
export function useCursorPagination<TItem>({
  initial,
  fetchMore,
  pageSize = 20,
  onError,
  resetKey,
}: Options<TItem>): Result<TItem> {
  const [items, setItems] = useState<TItem[]>(() => extractItems(initial));
  const [endCursor, setEndCursor] = useState<string | null>(
    initial.pageInfo.endCursor ?? null,
  );
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initial.pageInfo.hasNextPage,
  );
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(
    initial.totalCount ?? extractItems(initial).length,
  );
  const [error, setError] = useState<unknown>(null);

  // 同期的な並行制御用 ref。setLoading は非同期反映のため、
  // rapid loadMore() 呼び出し (例: スクロール / 連打) で重複 fetch が
  // 起きるのを防ぐ。endCursor / hasNextPage も同様に最新値を保持。
  const loadingRef = useRef(false);
  const endCursorRef = useRef<string | null>(initial.pageInfo.endCursor ?? null);
  const hasNextPageRef = useRef<boolean>(initial.pageInfo.hasNextPage);

  // initial 切替 (= filter 変更などで親が再 fetch) と in-flight な loadMore の
  // 競合で stale append が起きないよう、世代カウンタで in-flight 結果を破棄する。
  const generationRef = useRef(0);

  // useEffect の dep 切替時に最新の `initial` を読むための ref。
  // dep に initial を直接入れず resetKey 主軸で fire させたいので、
  // 中身は ref で覗く。
  const initialRef = useRef(initial);
  initialRef.current = initial;

  // resetKey が指定されればそれを dep にし、無ければ initial の参照を dep に
  // フォールバックする (= caller が useMemo などで stable に保つ前提)。
  const depKey = resetKey ?? initial;

  useEffect(() => {
    const latest = initialRef.current;
    generationRef.current += 1;
    // in-flight な loadMore の loadingRef が立ったままだと、新しい initial に
    // 対する次の loadMore が「まだ読み込み中」と誤判定されてブロックされる。
    // generation でレスポンスは捨てられるので、guard も明示的にリセットする。
    loadingRef.current = false;
    const latestItems = extractItems(latest);
    setItems(latestItems);
    setEndCursor(latest.pageInfo.endCursor ?? null);
    setHasNextPage(latest.pageInfo.hasNextPage);
    setLoading(false);
    setTotalCount(latest.totalCount ?? latestItems.length);
    setError(null);
    endCursorRef.current = latest.pageInfo.endCursor ?? null;
    hasNextPageRef.current = latest.pageInfo.hasNextPage;
  }, [depKey]);

  const loadMore = useCallback(async () => {
    // 空文字 cursor も「終端」ではなく有効値として扱うため、null/undefined を
    // 明示的にチェックする (`!cursor` だと "" が偽になる)。
    if (
      loadingRef.current ||
      !hasNextPageRef.current ||
      endCursorRef.current == null
    ) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    setError(null);
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
      setItems((prev) => {
        const appended = [...prev, ...extractItems(next)];
        // backend が totalCount を返さないケースは累積件数で代替。
        setTotalCount(next.totalCount ?? appended.length);
        return appended;
      });
      setEndCursor(nextEndCursor);
      setHasNextPage(nextHasNextPage);
    } catch (err) {
      if (requestGeneration === generationRef.current) {
        setError(err);
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
    const nextItems = extractItems(next);
    setItems(nextItems);
    setEndCursor(nextEndCursor);
    setHasNextPage(nextHasNextPage);
    setLoading(false);
    setTotalCount(next.totalCount ?? nextItems.length);
    setError(null);
  }, []);

  return {
    items,
    hasNextPage,
    loading,
    totalCount,
    error,
    loadMore,
    reset,
  };
}
