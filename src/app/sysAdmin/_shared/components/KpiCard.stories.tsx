import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KpiCard } from "./KpiCard";
import { PercentDelta } from "./PercentDelta";

const meta: Meta<typeof KpiCard> = {
  title: "SysAdmin/Shared/KpiCard",
  component: KpiCard,
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Small: Story = {
  args: { label: "コミュニティ数", value: "12", size: "sm" },
};

export const Large: Story = {
  args: { label: "活動率", value: "42.0%", size: "lg" },
};

export const WithDelta: Story = {
  args: {
    label: "前月比",
    value: <PercentDelta value={0.083} />,
    size: "lg",
  },
};

export const Empty: Story = {
  args: { label: "基準値", value: "-", size: "lg" },
};
