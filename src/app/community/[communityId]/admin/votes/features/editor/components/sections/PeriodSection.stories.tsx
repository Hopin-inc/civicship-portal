import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PeriodSection } from "./PeriodSection";
import { withVoteForm } from "../../__stories__/withForm";
import { STORYBOOK_BASE_DATE } from "../../__stories__/fixtures";
import dayjs from "dayjs";

const meta: Meta<typeof PeriodSection> = {
  title: "AdminVotes/Sections/PeriodSection",
  component: PeriodSection,
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
type Story = StoryObj<typeof PeriodSection>;

const base = dayjs(STORYBOOK_BASE_DATE);

/** デフォルト（開始=朝9時、終了=7日後18時） */
export const Default: Story = {
  decorators: [withVoteForm()],
};

/** 短期間（1日投票） */
export const SingleDay: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        startsAt: base.hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
        endsAt: base.hour(18).minute(0).format("YYYY-MM-DDTHH:mm"),
      },
    }),
  ],
};

/** 終了が開始より前のバリデーションエラー */
export const EndsBeforeStartsError: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        startsAt: base.add(5, "day").hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
        endsAt: base.add(2, "day").hour(18).minute(0).format("YYYY-MM-DDTHH:mm"),
      },
      errors: [
        {
          path: "endsAt",
          message: "終了日時は開始日時より後に設定してください",
        },
      ],
    }),
  ],
};
