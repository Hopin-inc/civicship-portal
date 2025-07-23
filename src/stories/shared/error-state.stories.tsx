import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useRef } from "react";
import ErrorState from "@/components/shared/ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Shared/Components/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Error title text",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    title: "ページを読み込めませんでした",
  },
};

export const CustomTitle: Story = {
  args: {
    title: "アクティビティを取得できませんでした",
  },
};

export const NetworkError: Story = {
  args: {
    title: "ネットワークエラーが発生しました",
  },
};

// Temporarily commented out due to React Hooks in render function ESLint error
// export const WithRefetch: Story = {
//   render: () => {
//     const refetchRef = useRef<(() => void) | null>(() => {
//       console.log("Refetch triggered");
//       alert("データを再読み込みしました");
//     });

//     return (
//       <ErrorState
//         title="データの読み込みに失敗しました"
//         refetchRef={refetchRef}
//       />
//     );
//   },
// };

// Temporarily commented out due to React Hooks in render function ESLint error
// export const ServerError: Story = {
//   render: () => {
//     const refetchRef = useRef<(() => void) | null>(() => {
//       console.log("Server retry triggered");
//       alert("サーバーに再接続しています...");
//     });

//     return (
//       <ErrorState
//         title="サーバーエラーが発生しました"
//         refetchRef={refetchRef}
//       />
//     );
//   },
// };

export const WithoutRefetch: Story = {
  args: {
    title: "このページは利用できません",
    refetchRef: undefined,
  },
};
