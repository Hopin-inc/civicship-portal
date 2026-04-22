import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SummaryKpiGrid } from "./SummaryKpiGrid";
import { makeSummaryCard } from "../../../_shared/__mocks__/sysAdminDashboard";

const meta: Meta<typeof SummaryKpiGrid> = {
  title: "SysAdmin/Detail/SummaryKpiGrid",
  component: SummaryKpiGrid,
  decorators: [
    (Story) => (
      <div className="w-[1200px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SummaryKpiGrid>;

export const PositiveDelta: Story = {
  args: { summary: makeSummaryCard({ growthRateActivity: 0.12 }) },
};

export const NegativeDelta: Story = {
  args: { summary: makeSummaryCard({ growthRateActivity: -0.18 }) },
};

export const Empty: Story = {
  args: { summary: null },
};
