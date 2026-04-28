import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlReportVariant } from "@/types/graphql";
import { TemplateRow } from "./TemplateRow";

const meta: Meta<typeof TemplateRow> = {
  title: "SysAdmin/System/Templates/TemplateRow",
  component: TemplateRow,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TemplateRow>;

export const Default: Story = {
  args: {
    summary: {
      variant: GqlReportVariant.MemberNewsletter,
      currentVersion: 3,
      activeTemplateCount: 2,
      totalFeedbackCount: 47,
      weightedAvgRating: 4.2,
      hasWarning: false,
    },
    onClick: () => undefined,
  },
};

export const WithWarning: Story = {
  args: {
    summary: {
      variant: GqlReportVariant.WeeklySummary,
      currentVersion: 2,
      activeTemplateCount: 1,
      totalFeedbackCount: 84,
      weightedAvgRating: 3.6,
      hasWarning: true,
    },
    onClick: () => undefined,
  },
};

export const NoFeedback: Story = {
  args: {
    summary: {
      variant: GqlReportVariant.GrantApplication,
      currentVersion: 1,
      activeTemplateCount: 1,
      totalFeedbackCount: 0,
      weightedAvgRating: null,
      hasWarning: false,
    },
    onClick: () => undefined,
  },
};

export const NoActiveTemplate: Story = {
  args: {
    summary: {
      variant: GqlReportVariant.MediaPr,
      currentVersion: 0,
      activeTemplateCount: 0,
      totalFeedbackCount: 0,
      weightedAvgRating: null,
      hasWarning: false,
    },
    onClick: () => undefined,
  },
};
