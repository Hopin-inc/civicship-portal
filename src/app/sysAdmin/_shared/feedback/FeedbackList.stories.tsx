import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { makeMockFeedbacks } from "@/app/sysAdmin/features/system/templates/feedback/fixtures";
import { FeedbackList } from "./FeedbackList";
import { RatingSummary } from "./RatingSummary";

const meta: Meta<typeof FeedbackList> = {
  title: "SysAdmin/Shared/Feedback/FeedbackList",
  component: FeedbackList,
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
type Story = StoryObj<typeof FeedbackList>;

const feedbacks = makeMockFeedbacks(8);

export const ReportDetailContext: Story = {
  args: {
    feedbacks,
    totalCount: feedbacks.length,
  },
};

/**
 * テンプレ詳細での使い方。`reportLinkFor` callback で `feedback.report` から
 * link を組み立てる必要があるため、generic component を直接 render して
 * T を `with-report` 型に bind する。
 */
export const TemplateDetailContext: Story = {
  render: () => (
    <FeedbackList
      feedbacks={feedbacks}
      totalCount={feedbacks.length}
      reportLinkFor={(fb) => ({
        href: `/sysAdmin/${fb.report.community.id}/reports/${fb.report.id}`,
        label: fb.report.community.name ?? fb.report.community.id,
      })}
      summary={
        <RatingSummary
          avgRating={4.3}
          totalCount={feedbacks.length}
          distribution={[
            { rating: 1, count: 0 },
            { rating: 2, count: 0 },
            { rating: 3, count: 1 },
            { rating: 4, count: 3 },
            { rating: 5, count: 4 },
          ]}
        />
      }
    />
  ),
};

export const HasMore: Story = {
  args: {
    feedbacks,
    totalCount: 47,
    pagination: {
      hasNextPage: true,
      loadingMore: false,
      onLoadMore: () => undefined,
    },
  },
};

export const LoadingMore: Story = {
  args: {
    feedbacks,
    totalCount: 47,
    pagination: {
      hasNextPage: true,
      loadingMore: true,
      onLoadMore: () => undefined,
    },
  },
};

export const Empty: Story = {
  args: {
    feedbacks: [],
  },
};
