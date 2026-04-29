/**
 * SysAdmin ダッシュボード用 server-side string query。
 * `executeServerGraphQLQuery` がパース不可の TypedDocumentNode ではなく
 * 生 string を期待するので、`graphql/account/sysAdmin/query.ts` の
 * gql tag 版とは別ファイルで保守する。
 *
 * 自前で fragment を inline 展開するのではなく、codegen から生成された
 * `Get*Document` を `addTypenameToDocument` で `__typename` を全ノードに
 * 注入したうえで `print()` する。これで:
 *   1. fragment 構成が常に最新 (codegen の唯一情報源)
 *   2. SSR レスポンスに `__typename` が必ず含まれる
 *      → Apollo の `client.writeQuery` で fragment の type condition
 *        (`...XFields on TypeName`) を `__typename` で照合できる
 *      → nested buckets (例: `stages.habitual.count`) が cache に
 *        正しく書かれる (これが無いと undefined で crash)。
 */

import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetAnalyticsCommunityDocument,
  GetAnalyticsDashboardDocument,
} from "@/types/graphql";

export const GET_ANALYTICS_DASHBOARD_SERVER_QUERY = print(
  addTypenameToDocument(GetAnalyticsDashboardDocument),
);

export const GET_ANALYTICS_COMMUNITY_SERVER_QUERY = print(
  addTypenameToDocument(GetAnalyticsCommunityDocument),
);
