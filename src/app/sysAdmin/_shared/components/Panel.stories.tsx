import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { Panel } from "./Panel";

const meta: Meta<typeof Panel> = {
  title: "SysAdmin/Shared/Panel",
  component: Panel,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[640px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  args: {
    title: "月次アクティビティ推移",
    description: "直近 10 ヶ月の推移 (月初 JST)",
    children: (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
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

export const TitleOnly: Story = {
  args: {
    title: "メンバー一覧",
    children: (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        Content
      </div>
    ),
  },
};
