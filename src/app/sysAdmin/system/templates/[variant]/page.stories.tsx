import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { withApollo, withPageShell } from "../../../../../../.storybook/decorators";
import {
  mockActiveTemplate,
  mockBreakdown,
} from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { makeMockFeedbacksConnection } from "@/app/sysAdmin/features/system/templates/feedback/fixtures";
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

export const WithItems: Story = {
  args: {
    variant: GqlReportVariant.MemberNewsletter,
    generationBreakdownRows: generationRows,
    generationTemplate,
    generationFeedbacks,
    judgeBreakdownRows: judgeRows,
    judgeTemplate,
    judgeFeedbacks,
  },
};

export const TemplateMissing: Story = {
  args: {
    variant: GqlReportVariant.MemberNewsletter,
    generationBreakdownRows: [],
    generationTemplate: null,
    generationFeedbacks: null,
    judgeBreakdownRows: [],
    judgeTemplate: null,
    judgeFeedbacks: null,
  },
};
