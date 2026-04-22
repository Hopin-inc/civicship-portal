import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertBadge } from "./AlertBadge";

const meta: Meta<typeof AlertBadge> = {
  title: "SysAdmin/Shared/AlertBadge",
  component: AlertBadge,
};

export default meta;
type Story = StoryObj<typeof AlertBadge>;

export const ActiveDrop: Story = { args: { variant: "activeDrop", active: true } };
export const ChurnSpike: Story = { args: { variant: "churnSpike", active: true } };
export const NoNewMembers: Story = { args: { variant: "noNewMembers", active: true } };
export const Inactive: Story = { args: { variant: "activeDrop", active: false } };
