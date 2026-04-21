import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityItem } from "./CommunityItem";

const meta: Meta<typeof CommunityItem> = {
  title: "SysAdmin/List/CommunityItem",
  component: CommunityItem,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityItem>;

export const Default: Story = {
  args: {
    community: {
      id: "neo88",
      name: "NEO四国88祭",
    },
  },
};

export const LongName: Story = {
  args: {
    community: {
      id: "long-community-id-example",
      name: "とても長いコミュニティ名のサンプル — 表示が折り返されるかを確認するための長文タイトル",
    },
  },
};

export const NoName: Story = {
  args: {
    community: {
      id: "nameless-community",
      name: "",
    },
  },
};
