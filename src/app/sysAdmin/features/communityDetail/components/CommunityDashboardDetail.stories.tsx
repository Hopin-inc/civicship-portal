import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminCommunityDetailDocument } from "@/types/graphql";
import { withApollo } from "../../../../../../.storybook/decorators";
import { CommunityDashboardDetail } from "./CommunityDashboardDetail";
import { makeCommunityDetailPayload } from "../../../_shared/__mocks__/sysAdminDashboard";

const meta: Meta<typeof CommunityDashboardDetail> = {
  title: "SysAdmin/Detail/CommunityDashboardDetail",
  component: CommunityDashboardDetail,
  parameters: { layout: "padded" },
  decorators: [
    withApollo,
    (Story) => (
      <div className="w-[1280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityDashboardDetail>;

const variables = {
  input: {
    communityId: "community-a",
    asOf: undefined,
    segmentThresholds: { tier1: 0.7, tier2: 0.4 },
    windowMonths: 10,
    userFilter: {
      minSendRate: 0.7,
      maxSendRate: undefined,
      minDonationOutMonths: undefined,
      minMonthsIn: undefined,
    },
    userSort: { field: "SEND_RATE", order: "DESC" },
    limit: 50,
  },
};

export const WithItems: Story = {
  args: { communityId: "community-a" },
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminCommunityDetailDocument, variables },
          result: { data: makeCommunityDetailPayload() },
        },
      ],
    },
  },
};

export const Loading: Story = {
  args: { communityId: "community-a" },
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminCommunityDetailDocument, variables },
          delay: Infinity,
          result: { data: makeCommunityDetailPayload() },
        },
      ],
    },
  },
};

export const ErrorCase: Story = {
  args: { communityId: "community-a" },
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminCommunityDetailDocument, variables },
          error: new Error("GraphQL error"),
        },
      ],
    },
  },
};
