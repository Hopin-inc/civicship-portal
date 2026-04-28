import { useState } from "react";
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

function StatefulEditor({
  initialSystemPrompt,
  initialUserPromptTemplate,
}: {
  initialSystemPrompt: string;
  initialUserPromptTemplate: string;
}) {
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [userPromptTemplate, setUserPromptTemplate] = useState(
    initialUserPromptTemplate,
  );
  const isDirty =
    systemPrompt !== template.systemPrompt ||
    userPromptTemplate !== template.userPromptTemplate;
  return (
    <PromptEditor
      template={template}
      systemPrompt={systemPrompt}
      setSystemPrompt={setSystemPrompt}
      userPromptTemplate={userPromptTemplate}
      setUserPromptTemplate={setUserPromptTemplate}
      onSave={() => undefined}
      saving={false}
      isDirty={isDirty}
      saveError={null}
    />
  );
}

export const Pristine: Story = {
  render: () => (
    <StatefulEditor
      initialSystemPrompt={template.systemPrompt}
      initialUserPromptTemplate={template.userPromptTemplate}
    />
  ),
};

export const Dirty: Story = {
  render: () => (
    <StatefulEditor
      initialSystemPrompt={template.systemPrompt + "\n\n# 編集中"}
      initialUserPromptTemplate={template.userPromptTemplate}
    />
  ),
};

export const Saving: Story = {
  args: {
    template,
    systemPrompt: template.systemPrompt + "\n\n# 編集中",
    setSystemPrompt: () => undefined,
    userPromptTemplate: template.userPromptTemplate,
    setUserPromptTemplate: () => undefined,
    onSave: () => undefined,
    saving: true,
    isDirty: true,
    saveError: null,
  },
};

export const SaveError: Story = {
  args: {
    template,
    systemPrompt: template.systemPrompt + "\n\n# 編集中",
    setSystemPrompt: () => undefined,
    userPromptTemplate: template.userPromptTemplate,
    setUserPromptTemplate: () => undefined,
    onSave: () => undefined,
    saving: false,
    isDirty: true,
    saveError: { message: "Network error: failed to reach server" },
  },
};
