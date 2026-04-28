import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockBreakdown } from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { GqlReportVariant } from "@/types/graphql";
import { StatsSection } from "./StatsSection";

const meta: Meta<typeof StatsSection> = {
  title: "SysAdmin/System/Templates/StatsSection",
  component: StatsSection,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: {
    rows: mockBreakdown(GqlReportVariant.MemberNewsletter),
  },
};

export const Empty: Story = {
  args: {
    rows: [],
  },
};

export const SingleVersion: Story = {
  args: {
    rows: mockBreakdown(GqlReportVariant.WeeklySummary).filter((r) => r.version === 3),
  },
};

export const NoCorrelation: Story = {
  args: {
    rows: mockBreakdown(GqlReportVariant.MediaPr).map((r) => ({
      ...r,
      judgeHumanCorrelation: null,
      correlationWarning: false,
    })),
  },
};
