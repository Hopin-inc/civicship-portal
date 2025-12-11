import { GqlOpportunitiesConnection } from "@/types/graphql";
import { PUBLISH_STATUS_LABELS, OPPORTUNITY_CATEGORY_LABELS } from "../constants/opportunity";

/**
 * GraphQLのOpportunitiesConnectionをUI表示用に変換
 * @param connection GraphQLから取得したOpportunitiesConnection
 * @returns UI表示用に整形されたデータ
 */
export function presentOpportunityList(connection: GqlOpportunitiesConnection) {
  return {
    list: connection.edges
      .filter((edge) => edge.node != null)
      .map(({ node }) => {
        // updatedAt が null の場合は createdAt にフォールバック
        const updatedAt = node!.updatedAt ?? node!.createdAt ?? "";

        return {
          id: node!.id,
          title: node!.title,
          images: node!.images ?? [],
          category: node!.category,
          categoryLabel: OPPORTUNITY_CATEGORY_LABELS[node!.category],
          description: node!.description,
          publishStatus: node!.publishStatus,
          publishStatusLabel: PUBLISH_STATUS_LABELS[node!.publishStatus] ?? "未設定",
          updatedAt: updatedAt ? String(updatedAt) : "",
          createdByUserName: node!.createdByUser?.name ?? "不明",
        };
      }),
    pageInfo: connection.pageInfo,
  };
}
