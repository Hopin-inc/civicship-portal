import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminDashboardDocument } from "@/types/graphql";
import { withApollo, withPageShell } from "../../../.storybook/decorators";
import { SysAdminPageClient } from "./SysAdminPageClient";
import {
  makeAlerts,
  makeCommunityOverview,
  makeDashboardPayload,
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
                  communityActivityRate: 0.423,
                  growthRateActivity: 0.083,
                  totalMembers: 566,
                }),
                makeCommunityOverview({
                  communityId: "community-b",
                  communityName: "コミュニティB",
                  communityActivityRate: 0.12,
                  growthRateActivity: -0.18,
                  totalMembers: 240,
                  alerts: makeAlerts({ churnSpike: true }),
                }),
                makeCommunityOverview({
                  communityId: "community-c",
                  communityName: "コミュニティC",
                  communityActivityRate: 0.28,
                  growthRateActivity: -0.14,
                  totalMembers: 180,
                  alerts: makeAlerts({ activeDrop: true }),
                }),
                makeCommunityOverview({
                  communityId: "community-d",
                  communityName: "コミュニティD",
                  communityActivityRate: 0.55,
                  growthRateActivity: null,
                  totalMembers: 48,
                  alerts: makeAlerts({ noNewMembers: true }),
                }),
                makeCommunityOverview({
                  communityId: "community-e",
                  communityName: "未来こども塾",
                  communityActivityRate: 0.065,
                  growthRateActivity: -0.03,
                  totalMembers: 566,
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
