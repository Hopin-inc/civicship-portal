import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { withApollo, withPageShell } from "../../../../../../.storybook/decorators";
import {
  mockActiveTemplate,
  mockBreakdown,
} from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import {
  makeMockFeedbackStats,
  makeMockFeedbacksConnection,
} from "@/app/sysAdmin/features/system/templates/feedback/fixtures";
import { GqlReportTemplateKind, GqlReportVariant } from "@/types/graphql";
import { SysAdminTemplateDetailPageClient } from "./SysAdminTemplateDetailPageClient";

const meta: Meta<typeof SysAdminTemplateDetailPageClient> = {
  title: "SysAdmin/Pages/SystemTemplateDetail",
  component: SysAdminTemplateDetailPageClient,
  parameters: { layout: "fullscreen" },
  decorators: [withPageShell, withApollo],
};

export default meta;
type Story = StoryObj<typeof SysAdminTemplateDetailPageClient>;

const generationTemplate = mockActiveTemplate(GqlReportVariant.MemberNewsletter);
const generationRows = mockBreakdown(GqlReportVariant.MemberNewsletter);

const judgeTemplate = mockActiveTemplate(
  GqlReportVariant.MemberNewsletter,
  GqlReportTemplateKind.Judge,
);
const judgeRows = mockBreakdown(GqlReportVariant.MemberNewsletter).map((r) => ({
  ...r,
  kind: GqlReportTemplateKind.Judge,
}));

const generationFeedbacks = makeMockFeedbacksConnection(8);
const judgeFeedbacks = makeMockFeedbacksConnection(6);
const generationStats = makeMockFeedbackStats(8);
const judgeStats = makeMockFeedbackStats(6, [
  { rating: 1, count: 0 },
  { rating: 2, count: 1 },
  { rating: 3, count: 2 },
  { rating: 4, count: 2 },
  { rating: 5, count: 1 },
]);

export const WithItems: Story = {
  args: {
    variant: GqlReportVariant.MemberNewsletter,
    generationBreakdownRows: generationRows,
    generationTemplate,
    generationFeedbacks,
    generationStats,
    judgeBreakdownRows: judgeRows,
    judgeTemplate,
    judgeFeedbacks,
    judgeStats,
  },
};

export const TemplateMissing: Story = {
  args: {
    variant: GqlReportVariant.MemberNewsletter,
    generationBreakdownRows: [],
    generationTemplate: null,
    generationFeedbacks: null,
    generationStats: null,
    judgeBreakdownRows: [],
    judgeTemplate: null,
    judgeFeedbacks: null,
    judgeStats: null,
  },
};
