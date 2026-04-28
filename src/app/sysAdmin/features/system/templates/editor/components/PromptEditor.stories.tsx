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

export const Pristine: Story = {
  render: () => {
    const [systemPrompt, setSystemPrompt] = useState(template.systemPrompt);
    const [userPromptTemplate, setUserPromptTemplate] = useState(
      template.userPromptTemplate,
    );
    return (
      <PromptEditor
        template={template}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        userPromptTemplate={userPromptTemplate}
        setUserPromptTemplate={setUserPromptTemplate}
        onSave={() => undefined}
        saving={false}
        isDirty={false}
        saveError={null}
      />
    );
  },
};

export const Dirty: Story = {
  render: () => {
    const [systemPrompt, setSystemPrompt] = useState(
      template.systemPrompt + "\n\n# 編集中",
    );
    const [userPromptTemplate, setUserPromptTemplate] = useState(
      template.userPromptTemplate,
    );
    return (
      <PromptEditor
        template={template}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        userPromptTemplate={userPromptTemplate}
        setUserPromptTemplate={setUserPromptTemplate}
        onSave={() => undefined}
        saving={false}
        isDirty={true}
        saveError={null}
      />
    );
  },
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
