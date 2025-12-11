import {
  GqlOpportunitiesConnection,
  GqlOpportunityCategory,
  GqlPublishStatus,
} from "@/types/graphql";

export function presentOpportunityList(connection: GqlOpportunitiesConnection) {
  return {
    list: connection.edges
      .filter((edge) => edge.node != null)
      .map(({ node }) => {
        // ★ updatedAt が null → createdAt fallback
        const rawDate = node!.updatedAt ?? node!.createdAt ?? "";

        return {
          id: node!.id,
          title: node!.title,
          images: node!.images ?? [],
          category: node!.category,
          categoryLabel: CATEGORY_LABELS[node!.category],
          description: node!.description,
          publishStatus: node!.publishStatus,
          publishStatusLabel: publishStatusLabelMap[node!.publishStatus] ?? "未設定",
          updatedAt: rawDate ? String(rawDate) : "",
          createdByUserName: node!.createdByUser?.name ?? "不明",
        };
      }),
    pageInfo: connection.pageInfo,
  };
}

const publishStatusLabelMap = {
  [GqlPublishStatus.Public]: "公開中",
  [GqlPublishStatus.CommunityInternal]: "限定公開",
  [GqlPublishStatus.Private]: "非公開",
};

const CATEGORY_LABELS: Record<GqlOpportunityCategory, string> = {
  ACTIVITY: "体験",
  QUEST: "お手伝い",
  EVENT: "イベント",
};
