import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OptionsSection } from "./OptionsSection";
import { withVoteForm } from "../../__stories__/withForm";

const meta: Meta<typeof OptionsSection> = {
  title: "AdminVotes/Sections/OptionsSection",
  component: OptionsSection,
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
type Story = StoryObj<typeof OptionsSection>;

/** 最小2件。削除ボタンは disabled のはず。 */
export const MinTwo: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        options: [{ label: "候補A" }, { label: "候補B" }],
      },
    }),
  ],
};

/** 3件以上。削除ボタンが有効になる。 */
export const Many: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        options: [
          { label: "地域の夏祭り" },
          { label: "ハイキングイベント" },
          { label: "フリーマーケット" },
          { label: "料理教室" },
        ],
      },
    }),
  ],
};

/** 選択肢が足りないエラー表示（ルート側） */
export const WithMinCountError: Story = {
  decorators: [
    withVoteForm({
      defaultValues: { options: [{ label: "" }, { label: "" }] },
      errors: [
        {
          path: "options.0.label",
          message: "選択肢のラベルを入力してください",
        },
        {
          path: "options.1.label",
          message: "選択肢のラベルを入力してください",
        },
      ],
    }),
  ],
};
