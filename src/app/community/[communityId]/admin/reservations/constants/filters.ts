import {
  GqlOpportunitySlotHostingStatus,
  GqlParticipationStatus,
  GqlReservationFilterInput,
  GqlReservationStatus,
} from "@/types/graphql";

export const TABS = ["all", "pending", "resolved"] as const;
export type TabType = (typeof TABS)[number];

export const isTabType = (value: string): value is TabType => {
  return TABS.includes(value as TabType);
};

export const getReservationFilterFromTab = (tab: TabType): GqlReservationFilterInput => {
  // すべて
  if (tab === "all") {
    return {};
  }

  // 未対応
  if (tab === "pending") {
    return {
      or: [
        {
          and: [
            { reservationStatus: [GqlReservationStatus.Applied] }, // 未承認の申込
            { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
          ],
        },
        {
          and: [
            { reservationStatus: [GqlReservationStatus.Accepted] }, // 承認済み
            { participationStatus: [GqlParticipationStatus.Participating] }, // 出欠未対応
            { hostingStatus: [GqlOpportunitySlotHostingStatus.Completed] }, // 開催済み
          ],
        },
      ],
    };
  }

  // 完了
  return {
    or: [
      // ● 承認済み・出欠対応済み・開催済み
      {
        and: [
          { reservationStatus: [GqlReservationStatus.Accepted] },
          { participationStatus: [GqlParticipationStatus.Participated] },
          { hostingStatus: [GqlOpportunitySlotHostingStatus.Completed] },
        ],
      },
      // ● 却下済み または キャンセル済み
      {
        reservationStatus: [GqlReservationStatus.Rejected, GqlReservationStatus.Canceled],
      },
      {
        and: [
          { reservationStatus: [GqlReservationStatus.Accepted] }, // 未承認の申込
          { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
          { participationStatus: [GqlParticipationStatus.Participating] },
        ],
      },
    ],
  };
};
