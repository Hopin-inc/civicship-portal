import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParticipationActions from "@/app/participations/[id]/components/ParticipationActions";

const meta: Meta<typeof ParticipationActions> = {
  title: "App/Participations/ParticipationActions",
  component: ParticipationActions,
  tags: ["autodocs"],
  argTypes: {
    isCancellable: { control: "boolean" },
    isAfterParticipation: { control: "boolean" },
    isCancelling: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component: "参加アクション。キャンセル機能と参加後の投稿機能を提供。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ParticipationActions>;

export const Cancellable: Story = {
  args: {
    cancellationDeadline: new Date("2024-01-15T10:00:00Z"),
    isCancellable: true,
    isAfterParticipation: false,
    onCancel: () => console.log("Cancel participation"),
    isCancelling: false,
  },
};

export const NotCancellable: Story = {
  args: {
    cancellationDeadline: new Date("2024-01-10T10:00:00Z"),
    isCancellable: false,
    isAfterParticipation: false,
    onCancel: () => console.log("Cancel participation"),
    isCancelling: false,
  },
};

export const AfterParticipation: Story = {
  args: {
    cancellationDeadline: null,
    isCancellable: false,
    isAfterParticipation: true,
    onCancel: () => console.log("Cancel participation"),
    isCancelling: false,
  },
};

export const Cancelling: Story = {
  args: {
    cancellationDeadline: new Date("2024-01-15T10:00:00Z"),
    isCancellable: true,
    isAfterParticipation: false,
    onCancel: () => console.log("Cancel participation"),
    isCancelling: true,
  },
};

export const NoCancellationDeadline: Story = {
  args: {
    cancellationDeadline: null,
    isCancellable: true,
    isAfterParticipation: false,
    onCancel: () => console.log("Cancel participation"),
    isCancelling: false,
  },
};
