import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetSysAdminDashboardDocument } from "@/types/graphql";
import { withApollo } from "../../../../../../.storybook/decorators";
import { DashboardOverview } from "./DashboardOverview";
import { makeDashboardPayload } from "../../../_shared/__mocks__/sysAdminDashboard";

const meta: Meta<typeof DashboardOverview> = {
  title: "SysAdmin/Dashboard/DashboardOverview",
  component: DashboardOverview,
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
type Story = StoryObj<typeof DashboardOverview>;

const baseVariables = {
  input: {
    asOf: null,
    segmentThresholds: { tier1: 0.7, tier2: 0.4 },
  },
};

export const WithItems: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetSysAdminDashboardDocument, variables: baseVariables },
          result: { data: makeDashboardPayload() },
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
          request: { query: GetSysAdminDashboardDocument, variables: baseVariables },
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
          request: { query: GetSysAdminDashboardDocument, variables: baseVariables },
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
          request: { query: GetSysAdminDashboardDocument, variables: baseVariables },
          error: new Error("GraphQL error"),
        },
      ],
    },
  },
};
