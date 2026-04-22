import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RetentionTrendPanel } from "./RetentionTrendPanel";
import { makeRetentionTrendPoint } from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof RetentionTrendPanel> = {
  title: "SysAdmin/Detail/RetentionTrendPanel",
  component: RetentionTrendPanel,
  decorators: [
    (Story) => (
      <div className="w-[960px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RetentionTrendPanel>;

export const WithItems: Story = {
  args: {
    points: [
      makeRetentionTrendPoint({ week: new Date("2026-03-16T00:00:00+09:00") }),
      makeRetentionTrendPoint({ week: new Date("2026-03-23T00:00:00+09:00") }),
      makeRetentionTrendPoint({ week: new Date("2026-03-30T00:00:00+09:00") }),
      makeRetentionTrendPoint({ week: new Date("2026-04-06T00:00:00+09:00") }),
      makeRetentionTrendPoint({ week: new Date("2026-04-13T00:00:00+09:00") }),
    ],
  },
};

export const Empty: Story = {
  args: { points: [] },
};
