import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { ChartCard } from "./ChartCard";

const meta: Meta<typeof ChartCard> = {
  title: "SysAdmin/Shared/ChartCard",
  component: ChartCard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[640px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChartCard>;

export const Default: Story = {
  args: {
    title: "月次アクティビティ推移",
    description: "直近 10 ヶ月の推移 (月初 JST)",
    children: (
      <div className="flex h-[240px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Chart here
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    ...Default.args,
    actions: (
      <Button variant="ghost" size="sm">
        CSV
      </Button>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    ...Default.args,
    footer: "* JST カレンダーで集計",
  },
};
