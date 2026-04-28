/**
 * GraphQL Connection の "空" な default を typename を変えて返す factory。
 * `useCursorPagination` の initial フォールバックや SSR 失敗時の埋め草に使う。
 *
 * 各 Connection 型 (`ReportFeedbacksConnection` / `ReportsConnection` 等) は
 * `__typename` だけが違って構造は同じなので、generic な typename で受け取り、
 * `as` で対象 Connection 型に整える前提。
 */
export function createEmptyConnection<TConnTypename extends string>(
  typename: TConnTypename,
) {
  return {
    __typename: typename,
    edges: [],
    pageInfo: {
      __typename: "PageInfo" as const,
      hasNextPage: false,
      endCursor: null,
    },
    totalCount: 0,
  };
}
