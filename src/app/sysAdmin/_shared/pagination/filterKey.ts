/**
 * フィルタ object を `useCursorPagination` の `resetKey` に使うため、
 * key 順を安定化させた string に畳み込む。
 *
 * - undefined / null / "" は同一視 (= フィルタ無し) して dropping し、
 *   ユーザーから見て同じ状態が同じ key を返すようにする
 * - JSON.stringify はキーの insertion order に依存するので
 *   sortedKeys → 値 で組み立てる
 */
export function stableFilterKey(filter: Record<string, unknown>): string {
  const entries = Object.entries(filter)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  if (entries.length === 0) return "";
  return entries
    .map(([k, v]) => `${k}=${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("&");
}
