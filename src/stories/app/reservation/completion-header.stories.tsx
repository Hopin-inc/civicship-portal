import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import CompletionHeader from "@/app/reservation/complete/components/CompletionHeader";

const meta: Meta<typeof CompletionHeader> = {
  title: "App/Reservation/CompletionHeader",
  component: CompletionHeader,
  tags: ["autodocs"],
  argTypes: {
    requireApproval: {
      control: "select",
      options: [true, false, undefined],
      description: "Whether approval is required for the reservation",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CompletionHeader>;

export const ApprovalRequired: Story = {
  args: {
    requireApproval: true,
  },
};

export const NoApprovalRequired: Story = {
  args: {
    requireApproval: false,
  },
};

export const ApprovalUndefined: Story = {
  args: {
    requireApproval: undefined,
  },
};

export const ApprovalRequiredInteractive: Story = {
  args: {
    requireApproval: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the approval required state with interactive controls",
      },
    },
  },
};
