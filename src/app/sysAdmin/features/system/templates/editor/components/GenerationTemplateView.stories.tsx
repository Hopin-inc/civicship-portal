import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  mockActiveTemplate,
  mockBreakdown,
} from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import {
  makeMockFeedbackStats,
  makeMockFeedbacks,
} from "@/app/sysAdmin/features/system/templates/feedback/fixtures";
import { GqlReportVariant } from "@/types/graphql";
import { GenerationTemplateView } from "./GenerationTemplateView";

const meta: Meta<typeof GenerationTemplateView> = {
  title: "SysAdmin/System/Templates/GenerationTemplateView",
  component: GenerationTemplateView,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GenerationTemplateView>;

const template = mockActiveTemplate(GqlReportVariant.MemberNewsletter);
const rows = mockBreakdown(GqlReportVariant.MemberNewsletter);
const feedbacks = makeMockFeedbacks(8);
const feedbackStats = makeMockFeedbackStats(feedbacks.length);

export const WithData: Story = {
  args: {
    rows,
    breakdownLoading: false,
    breakdownError: null,
    template,
    editorLoading: false,
    editorError: null,
    saving: false,
    saveError: null,
    onSubmitPrompt: () => undefined,
    feedbacks,
    feedbackTotalCount: feedbacks.length,
    feedbackStats,
  },
};

export const Loading: Story = {
  args: {
    rows: [],
    breakdownLoading: true,
    breakdownError: null,
    template: null,
    editorLoading: true,
    editorError: null,
    saving: false,
    saveError: null,
    onSubmitPrompt: () => undefined,
    feedbacks: [],
    feedbackStats: null,
  },
};

export const NoTemplate: Story = {
  args: {
    rows: [],
    breakdownLoading: false,
    breakdownError: null,
    template: null,
    editorLoading: false,
    editorError: null,
    saving: false,
    saveError: null,
    onSubmitPrompt: () => undefined,
    feedbacks: [],
    feedbackStats: null,
  },
};

export const BreakdownError: Story = {
  args: {
    rows: [],
    breakdownLoading: false,
    breakdownError: new Error("Network error"),
    template,
    editorLoading: false,
    editorError: null,
    saving: false,
    saveError: null,
    onSubmitPrompt: () => undefined,
    feedbacks,
    feedbackTotalCount: feedbacks.length,
    feedbackStats,
  },
};
