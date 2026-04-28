import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockBreakdown } from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { GqlReportVariant } from "@/types/graphql";
import { ExperimentSection } from "./ExperimentSection";

const meta: Meta<typeof ExperimentSection> = {
  title: "SysAdmin/System/Templates/ExperimentSection",
  component: ExperimentSection,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExperimentSection>;

export const FullHistory: Story = {
  args: {
    rows: mockBreakdown(GqlReportVariant.MemberNewsletter),
  },
};

export const CurrentVersionOnly: Story = {
  args: {
    rows: mockBreakdown(GqlReportVariant.WeeklySummary).filter((r) => r.version === 3),
  },
};

export const Empty: Story = {
  args: {
    rows: [],
  },
};
