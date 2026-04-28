import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { withPageShell } from "../../../../../.storybook/decorators";
import { mockBreakdown } from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { aggregateVariantSummary } from "@/app/sysAdmin/features/system/templates/shared/aggregate";
import { SUPPORTED_VARIANTS } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { GqlReportVariant } from "@/types/graphql";
import { SysAdminSystemTemplatesPageClient } from "./SysAdminSystemTemplatesPageClient";

const meta: Meta<typeof SysAdminSystemTemplatesPageClient> = {
  title: "SysAdmin/Pages/SystemTemplatesList",
  component: SysAdminSystemTemplatesPageClient,
  parameters: { layout: "fullscreen" },
  decorators: [withPageShell],
};

export default meta;
type Story = StoryObj<typeof SysAdminSystemTemplatesPageClient>;

const summaries = SUPPORTED_VARIANTS.map((variant) =>
  aggregateVariantSummary(variant, mockBreakdown(variant)),
);

export const WithItems: Story = {
  args: { summaries },
};

export const Empty: Story = {
  args: {
    summaries: SUPPORTED_VARIANTS.map((variant) => ({
      variant,
      currentVersion: 0,
      activeTemplateCount: 0,
      totalFeedbackCount: 0,
      weightedAvgRating: null,
      hasWarning: false,
    })),
  },
};

export const WithWarnings: Story = {
  args: {
    summaries: SUPPORTED_VARIANTS.map((variant, i) =>
      i === 1 || i === 2
        ? {
            variant: variant as GqlReportVariant,
            currentVersion: 2,
            activeTemplateCount: 1,
            totalFeedbackCount: 84,
            weightedAvgRating: 3.6,
            hasWarning: true,
          }
        : aggregateVariantSummary(variant, mockBreakdown(variant)),
    ),
  },
};
