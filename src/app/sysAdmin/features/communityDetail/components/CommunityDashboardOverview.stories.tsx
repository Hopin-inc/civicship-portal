import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityDashboardOverview } from "./CommunityDashboardOverview";
import {
  makeCohortRetentionPoint,
  makeCommunityDetailPayload,
  makeMemberList,
  makeMemberRow,
  makeRetentionTrendPoint,
  makeStageBucket,
  makeStageDistribution,
  makeSummaryCard,
  makeTenureDistribution,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CommunityDashboardOverview> = {
  title: "SysAdmin/Detail/CommunityDashboardOverview",
  component: CommunityDashboardOverview,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityDashboardOverview>;

/**
 * 健全な状態 — どの scope も ● で問題なし。
 */
export const Healthy: Story = {
  args: {
    communityName: "コミュニティA",
    newMemberCount: 12,
    hubMemberCount: 43,
    tenureDistribution: makeTenureDistribution({
      lt1Month: 24,
      m1to3Months: 36,
      m3to12Months: 90,
      gte12Months: 90,
    }),
    data: makeCommunityDetailPayload({
      payload: {
        summary: makeSummaryCard({
          communityActivityRate: 0.42,
          growthRateActivity: 0.083,
          totalMembers: 240,
          totalDonationPointsAllTime: 12_400_000,
          maxChainDepthAllTime: 4,
          dataFrom: new Date("2024-04-01T00:00:00+09:00"),
          dataTo: new Date("2026-04-01T00:00:00+09:00"),
        }),
        stages: makeStageDistribution({
          habitual: makeStageBucket({ count: 60, pct: 0.25, avgSendRate: 0.85 }),
          regular: makeStageBucket({ count: 50, pct: 0.21, avgSendRate: 0.55 }),
          occasional: makeStageBucket({ count: 70, pct: 0.29, avgSendRate: 0.2 }),
          latent: makeStageBucket({ count: 60, pct: 0.25, avgSendRate: 0 }),
        }),
        cohortRetention: [
          makeCohortRetentionPoint({
            cohortMonth: new Date("2025-09-01T00:00:00+09:00"),
            cohortSize: 18,
            retentionM1: 0.72,
          }),
          makeCohortRetentionPoint({
            cohortMonth: new Date("2025-10-01T00:00:00+09:00"),
            cohortSize: 22,
            retentionM1: 0.78,
          }),
          makeCohortRetentionPoint({
            cohortMonth: new Date("2025-11-01T00:00:00+09:00"),
            cohortSize: 20,
            retentionM1: 0.8,
          }),
        ],
        memberList: makeMemberList(
          Array.from({ length: 60 }, (_, i) =>
            makeMemberRow({
              userId: `u${i}`,
              userSendRate: 0.85,
              uniqueDonationRecipients: 5, // healthy breadth
            }),
          ),
        ),
      },
    }).sysAdminCommunityDetail!,
  },
};

/**
 * 各 scope に warning があり、診断 dashboard の典型的な使用シーン。
 */
export const WithIssues: Story = {
  args: {
    communityName: "コミュニティA",
    newMemberCount: 12,
    hubMemberCount: 43,
    tenureDistribution: makeTenureDistribution({
      lt1Month: 60,
      m1to3Months: 80,
      m3to12Months: 60,
      gte12Months: 40,
    }),
    data: makeCommunityDetailPayload({
      payload: {
        summary: makeSummaryCard({
          communityActivityRate: 0.42,
          growthRateActivity: 0.083,
          totalMembers: 240,
          totalDonationPointsAllTime: 12_400_000,
          maxChainDepthAllTime: 4,
          dataFrom: new Date("2024-04-01T00:00:00+09:00"),
          dataTo: new Date("2026-04-01T00:00:00+09:00"),
        }),
        stages: makeStageDistribution({
          // regular > habitual: 習慣化伸びしろ警告
          habitual: makeStageBucket({ count: 60, pct: 0.25 }),
          regular: makeStageBucket({ count: 80, pct: 0.33 }),
          occasional: makeStageBucket({ count: 50, pct: 0.21 }),
          latent: makeStageBucket({ count: 50, pct: 0.21 }),
        }),
        cohortRetention: [
          makeCohortRetentionPoint({
            cohortMonth: new Date("2025-09-01T00:00:00+09:00"),
            cohortSize: 18,
            retentionM1: 0.78,
          }),
          makeCohortRetentionPoint({
            cohortMonth: new Date("2025-10-01T00:00:00+09:00"),
            cohortSize: 22,
            retentionM1: 0.75,
          }),
          // 最新 cohort で M+1 が悪化 → cohort 警告
          makeCohortRetentionPoint({
            cohortMonth: new Date("2025-11-01T00:00:00+09:00"),
            cohortSize: 24,
            retentionM1: 0.67,
          }),
        ],
        memberList: makeMemberList(
          // tier1 60 人中、40% (24 人) が breadth ≤ 1 → 送付先孤立警告
          Array.from({ length: 60 }, (_, i) =>
            makeMemberRow({
              userId: `u${i}`,
              userSendRate: 0.85,
              uniqueDonationRecipients: i < 24 ? 1 : 5,
            }),
          ),
        ),
      },
    }).sysAdminCommunityDetail!,
  },
};

/**
 * 立ち上げ直後の小規模コミュニティ。データが薄く、charts もまだ意味を持たない状態。
 */
export const EmptyData: Story = {
  args: {
    communityName: "新規コミュニティ",
    newMemberCount: 3,
    hubMemberCount: 0,
    tenureDistribution: makeTenureDistribution({
      lt1Month: 5,
      m1to3Months: 3,
      m3to12Months: 0,
      gte12Months: 0,
    }),
    data: makeCommunityDetailPayload({
      payload: {
        summary: makeSummaryCard({
          communityName: "新規コミュニティ",
          communityActivityRate: 0.05,
          growthRateActivity: null,
          totalMembers: 8,
          totalDonationPointsAllTime: 18_000,
          maxChainDepthAllTime: 1,
          dataFrom: new Date("2026-03-01T00:00:00+09:00"),
          dataTo: new Date("2026-04-01T00:00:00+09:00"),
        }),
        stages: makeStageDistribution({
          habitual: makeStageBucket({ count: 0, pct: 0 }),
          regular: makeStageBucket({ count: 1, pct: 0.13, avgSendRate: 0.5 }),
          occasional: makeStageBucket({ count: 2, pct: 0.25, avgSendRate: 0.15 }),
          latent: makeStageBucket({ count: 5, pct: 0.62, avgSendRate: 0 }),
        }),
        cohortRetention: [
          makeCohortRetentionPoint({
            cohortMonth: new Date("2026-02-01T00:00:00+09:00"),
            cohortSize: 8,
            retentionM1: null,
            retentionM3: null,
            retentionM6: null,
          }),
        ],
        retentionTrend: [
          makeRetentionTrendPoint({
            week: new Date("2026-04-13T00:00:00+09:00"),
            retainedSenders: 1,
            churnedSenders: 0,
            returnedSenders: 0,
            newMembers: 3,
          }),
        ],
        memberList: makeMemberList([
          makeMemberRow({
            userId: "u1",
            name: "山田 太郎",
            userSendRate: 0.5,
            uniqueDonationRecipients: 1,
            monthsIn: 2,
            totalPointsOut: 5_000,
          }),
        ]),
      },
    }).sysAdminCommunityDetail!,
  },
};
