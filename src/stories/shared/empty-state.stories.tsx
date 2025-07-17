import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import EmptyState from "@/components/shared/EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Shared/Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title text for the empty state",
    },
    message: {
      control: "text",
      description: "Message text explaining the empty state",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "ページ",
  },
};

export const Activities: Story = {
  args: {
    title: "アクティビティ",
    message: "現在アクティビティは準備中です。しばらくしてからご確認ください。",
  },
};

export const Tickets: Story = {
  args: {
    title: "チケット",
    message: "現在チケットは準備中です。しばらくしてからご確認ください。",
  },
};

export const CustomMessage: Story = {
  args: {
    title: "イベント",
    message: "お探しのイベントは見つかりませんでした。別の条件で検索してみてください。",
  },
};
