import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockActiveTemplate } from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { GqlReportVariant } from "@/types/graphql";
import { PromptEditor } from "./PromptEditor";

const meta: Meta<typeof PromptEditor> = {
  title: "SysAdmin/System/Templates/PromptEditor",
  component: PromptEditor,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PromptEditor>;

const template = mockActiveTemplate(GqlReportVariant.MemberNewsletter);

export const Pristine: Story = {
  args: {
    initialSystemPrompt: template.systemPrompt,
    initialUserPromptTemplate: template.userPromptTemplate,
    saving: false,
    saveError: null,
    onSubmit: () => undefined,
  },
};

export const Saving: Story = {
  args: {
    initialSystemPrompt: template.systemPrompt,
    initialUserPromptTemplate: template.userPromptTemplate,
    saving: true,
    saveError: null,
    onSubmit: () => undefined,
  },
};

export const SaveError: Story = {
  args: {
    initialSystemPrompt: template.systemPrompt,
    initialUserPromptTemplate: template.userPromptTemplate,
    saving: false,
    saveError: { message: "Network error: failed to reach server" },
    onSubmit: () => undefined,
  },
};
