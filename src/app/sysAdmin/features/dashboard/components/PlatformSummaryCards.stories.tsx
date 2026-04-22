import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlatformSummaryCards } from "./PlatformSummaryCards";
import { makePlatformSummary } from "../../../_shared/__mocks__/sysAdminDashboard";

const meta: Meta<typeof PlatformSummaryCards> = {
  title: "SysAdmin/Dashboard/PlatformSummaryCards",
  component: PlatformSummaryCards,
  decorators: [
    (Story) => (
      <div className="w-[960px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlatformSummaryCards>;

export const WithItems: Story = {
  args: { platform: makePlatformSummary() },
};

export const Empty: Story = {
  args: { platform: null },
};
