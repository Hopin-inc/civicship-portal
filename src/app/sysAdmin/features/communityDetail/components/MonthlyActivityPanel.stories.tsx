import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonthlyActivityPanel } from "./MonthlyActivityPanel";
import { makeMonthlyActivityPoint } from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof MonthlyActivityPanel> = {
  title: "SysAdmin/Detail/MonthlyActivityPanel",
  component: MonthlyActivityPanel,
  decorators: [
    (Story) => (
      <div className="w-[960px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MonthlyActivityPanel>;

export const WithItems: Story = {
  args: {
    points: [
      makeMonthlyActivityPoint({ month: new Date("2025-11-01T00:00:00+09:00"), senderCount: 40 }),
      makeMonthlyActivityPoint({ month: new Date("2025-12-01T00:00:00+09:00"), senderCount: 45 }),
      makeMonthlyActivityPoint({ month: new Date("2026-01-01T00:00:00+09:00"), senderCount: 48 }),
      makeMonthlyActivityPoint({ month: new Date("2026-02-01T00:00:00+09:00"), senderCount: 52 }),
      makeMonthlyActivityPoint({ month: new Date("2026-03-01T00:00:00+09:00"), senderCount: 50 }),
      makeMonthlyActivityPoint({ month: new Date("2026-04-01T00:00:00+09:00"), senderCount: 55 }),
    ],
  },
};

export const Empty: Story = {
  args: { points: [] },
};
