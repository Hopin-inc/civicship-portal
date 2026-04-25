import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminCommunityDetailDocument } from "@/types/graphql";
import { withApollo, withPageShell } from "../../../../.storybook/decorators";
import { CommunityDetailPageClient } from "./CommunityDetailPageClient";
import { makeCommunityDetailPayload } from "../_shared/fixtures/sysAdminDashboard";

// page.tsx は async RSC で SSR fetch するため Storybook から直接 render できない。
// Client 部分 (`CommunityDetailPageClient`) と route の container (max-w-7xl p-4)
// をラップで再現する。initialData=null にして Apollo mock 経路をテスト。
function CommunityDetailPageShell({ communityId }: { communityId: string }) {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <CommunityDetailPageClient communityId={communityId} initialData={null} />
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
    userFilter: {},
    userSort: { field: "TOTAL_POINTS_OUT", order: "DESC" },
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
