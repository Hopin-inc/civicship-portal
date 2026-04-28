import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  GqlReportStatus,
  GqlReportVariant,
} from "@/types/graphql";
import { CommunityReportsTab, type ReportRow } from "./CommunityReportsTab";

const meta: Meta<typeof CommunityReportsTab> = {
  title: "SysAdmin/CommunityDetail/CommunityReportsTab",
  component: CommunityReportsTab,
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
type Story = StoryObj<typeof CommunityReportsTab>;

const sampleReports: ReportRow[] = [
  {
    id: "r1",
    variant: GqlReportVariant.MemberNewsletter,
    status: GqlReportStatus.Published,
    publishedAt: new Date("2026-04-25"),
  },
  {
    id: "r2",
    variant: GqlReportVariant.WeeklySummary,
    status: GqlReportStatus.Published,
    publishedAt: new Date("2026-04-18"),
  },
  {
    id: "r3",
    variant: GqlReportVariant.MediaPr,
    status: GqlReportStatus.Approved,
    publishedAt: null,
  },
];

export const WithReports: Story = {
  args: {
    reports: sampleReports,
    totalCount: 3,
    hasNextPage: false,
    loading: false,
    error: null,
    loadingMore: false,
    onLoadMore: () => undefined,
  },
};

export const HasMorePages: Story = {
  args: {
    reports: sampleReports,
    totalCount: 47,
    hasNextPage: true,
    loading: false,
    error: null,
    loadingMore: false,
    onLoadMore: () => undefined,
  },
};

export const LoadingMore: Story = {
  args: {
    reports: sampleReports,
    totalCount: 47,
    hasNextPage: true,
    loading: false,
    error: null,
    loadingMore: true,
    onLoadMore: () => undefined,
  },
};

export const PaginationError: Story = {
  args: {
    reports: sampleReports,
    totalCount: 47,
    hasNextPage: true,
    loading: false,
    error: new Error("network error"),
    loadingMore: false,
    onLoadMore: () => undefined,
  },
};

export const InitialLoading: Story = {
  args: {
    reports: [],
    totalCount: 0,
    hasNextPage: false,
    loading: true,
    error: null,
    loadingMore: false,
    onLoadMore: () => undefined,
  },
};

export const InitialError: Story = {
  args: {
    reports: [],
    totalCount: 0,
    hasNextPage: false,
    loading: false,
    error: new Error("backend unreachable"),
    loadingMore: false,
    onLoadMore: () => undefined,
  },
};

export const EmptyState: Story = {
  args: {
    reports: [],
    totalCount: 0,
    hasNextPage: false,
    loading: false,
    error: null,
    loadingMore: false,
    onLoadMore: () => undefined,
  },
};
