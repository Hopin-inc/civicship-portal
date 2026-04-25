import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminDashboardDocument } from "@/types/graphql";
import { withApollo, withPageShell } from "../../../.storybook/decorators";
import { SysAdminPageClient } from "./SysAdminPageClient";
import {
  makeCommunityOverview,
  makeDashboardPayload,
  makeWeeklyRetention,
  makeWindowActivity,
} from "./_shared/fixtures/sysAdminDashboard";

// page.tsx は async RSC なので Storybook から直接 render できない。
// Client 部分 (`SysAdminPageClient`) に initialData=null を渡し、
// Apollo mock をクエリ経由で発火させて従来の画面を再現する。
const meta: Meta<typeof SysAdminPageClient> = {
  title: "SysAdmin/Pages/CommunityList",
  component: SysAdminPageClient,
  parameters: { layout: "fullscreen" },
  decorators: [withPageShell, withApollo],
  args: { initialData: null },
};

export default meta;
type Story = StoryObj<typeof SysAdminPageClient>;

const variables = {
  input: {
    asOf: undefined,
    segmentThresholds: { tier1: 0.7, tier2: 0.4 },
  },
};

export const WithItems: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminDashboardDocument, variables },
          result: {
            data: makeDashboardPayload({
              communities: [
                makeCommunityOverview({
                  communityId: "kibotcha",
                  communityName: "kibotcha",
                  totalMembers: 566,
                  windowActivity: makeWindowActivity({
                    senderCount: 240,
                    senderCountPrev: 222,
                  }),
                }),
                // churnSpike
                makeCommunityOverview({
                  communityId: "community-b",
                  communityName: "コミュニティB",
                  totalMembers: 240,
                  windowActivity: makeWindowActivity({
                    senderCount: 30,
                    senderCountPrev: 36,
                  }),
                  weeklyRetention: makeWeeklyRetention({
                    retainedSenders: 6,
                    churnedSenders: 14,
                  }),
                }),
                // activeDrop (~-38% growth)
                makeCommunityOverview({
                  communityId: "community-c",
                  communityName: "コミュニティC",
                  totalMembers: 180,
                  windowActivity: makeWindowActivity({
                    senderCount: 50,
                    senderCountPrev: 81,
                  }),
                }),
                // noNewMembers
                makeCommunityOverview({
                  communityId: "community-d",
                  communityName: "コミュニティD",
                  totalMembers: 48,
                  windowActivity: makeWindowActivity({
                    senderCount: 26,
                    senderCountPrev: 25,
                    newMemberCount: 0,
                    newMemberCountPrev: 4,
                  }),
                }),
                makeCommunityOverview({
                  communityId: "community-e",
                  communityName: "未来こども塾",
                  totalMembers: 566,
                  windowActivity: makeWindowActivity({
                    senderCount: 37,
                    senderCountPrev: 38,
                  }),
                }),
              ],
            }),
          },
        },
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminDashboardDocument, variables },
          result: { data: makeDashboardPayload({ communities: [] }) },
        },
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminDashboardDocument, variables },
          delay: Infinity,
          result: { data: makeDashboardPayload() },
        },
      ],
    },
  },
};

export const ErrorCase: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminDashboardDocument, variables },
          error: new Error("GraphQL error"),
        },
      ],
    },
  },
};
