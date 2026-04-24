import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminCommunityDetailDocument } from "@/types/graphql";
import { withApollo, withPageShell } from "../../../../.storybook/decorators";
import { CommunityDashboardDetail } from "../features/communityDetail/components/CommunityDashboardDetail";
import { makeCommunityDetailPayload } from "../_shared/fixtures/sysAdminDashboard";

// page.tsx は `use(params)` を使うため Storybook から直接 render しにくい。
// 実際の route で表示される container (max-w-7xl p-4) + CommunityDashboardDetail
// の組み合わせをラップして再現する。
function CommunityDetailPageShell({ communityId }: { communityId: string }) {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <CommunityDashboardDetail communityId={communityId} />
    </div>
  );
}

const meta: Meta<typeof CommunityDetailPageShell> = {
  title: "SysAdmin/Pages/CommunityDetail",
  component: CommunityDetailPageShell,
  parameters: { layout: "fullscreen" },
  decorators: [withPageShell, withApollo],
};

export default meta;
type Story = StoryObj<typeof CommunityDetailPageShell>;

const variables = {
  input: {
    communityId: "community-a",
    asOf: undefined,
    segmentThresholds: { tier1: 0.7, tier2: 0.4 },
    windowMonths: 3,
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
