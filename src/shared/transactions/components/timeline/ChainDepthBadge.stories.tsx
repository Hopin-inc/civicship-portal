import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChainDepthBadge } from "./ChainDepthBadge";

const meta: Meta<typeof ChainDepthBadge> = {
  title: "Transactions/ChainDepthBadge",
  component: ChainDepthBadge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    depth: { control: { type: "number", min: 0, max: 20 } },
  },
};

export default meta;
type Story = StoryObj<typeof ChainDepthBadge>;

export const Depth2: Story = {
  args: { depth: 2 },
};

export const Depth5: Story = {
  args: { depth: 5 },
};

export const Depth10Max: Story = {
  args: { depth: 10 },
};

export const Depth1Hidden: Story = {
  args: { depth: 1 },
  parameters: {
    docs: { description: { story: "depth < 2 のときは何も描画しない" } },
  },
};

export const NullHidden: Story = {
  args: { depth: null },
  parameters: {
    docs: { description: { story: "null / undefined のときは何も描画しない" } },
  },
};
