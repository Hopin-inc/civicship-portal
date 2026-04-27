import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminCommunityDetailDocument } from "@/types/graphql";
import { withApollo, withPageShell } from "../../../../.storybook/decorators";
import { CommunityDetailPageClient } from "./CommunityDetailPageClient";
import { DEFAULT_SEGMENT_THRESHOLDS } from "../_shared/derive";
import { makeCommunityDetailPayload } from "../_shared/fixtures/sysAdminDashboard";

// page.tsx は async RSC で SSR fetch するため Storybook から直接 render できない。
// Client 部分 (`CommunityDetailPageClient`) と route の container を再現する。
// initialData=null にして Apollo mock 経路をテスト。
function CommunityDetailPageShell({ communityId }: { communityId: string }) {
  return (
    <div className="mx-auto max-w-mobile-l p-4 pt-8">
      <CommunityDetailPageClient communityId={communityId} initialData={null} />
    </div>
  );
}
// NOTE: storybook の decorator は layout.tsx を通らないので、max-w-mobile-l を
// shell 側で残している (production では sysAdmin/layout.tsx が同じ幅で wrap する)。

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
    segmentThresholds: DEFAULT_SEGMENT_THRESHOLDS,
    windowMonths: 3,
    userFilter: { minSendRate: 0 },
    userSort: { field: "TOTAL_POINTS_OUT", order: "DESC" },
    limit: 1000,
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
