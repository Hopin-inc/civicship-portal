import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BasicInfoSection } from "./BasicInfoSection";
import { withVoteForm } from "../../__stories__/withForm";

const meta: Meta<typeof BasicInfoSection> = {
  title: "AdminVotes/Sections/BasicInfoSection",
  component: BasicInfoSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto px-6 py-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BasicInfoSection>;

export const Empty: Story = {
  decorators: [withVoteForm()],
};

export const Filled: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "春の地域イベントを何にするか投票",
        description: "5月の連休に開催する地域イベントの内容を投票で決めます。",
      },
    }),
  ],
};

export const WithTitleError: Story = {
  decorators: [
    withVoteForm({
      defaultValues: { description: "説明だけ入力済み、タイトル未入力のエラー状態" },
      errors: [{ path: "title", message: "タイトルを入力してください" }],
    }),
  ],
};
