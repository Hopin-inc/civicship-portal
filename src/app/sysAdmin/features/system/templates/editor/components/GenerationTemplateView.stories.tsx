import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  mockActiveTemplate,
  mockBreakdown,
} from "@/app/sysAdmin/features/system/templates/shared/fixtures";
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

export const WithData: Story = {
  render: () => {
    const [systemPrompt, setSystemPrompt] = useState(template.systemPrompt);
    const [userPromptTemplate, setUserPromptTemplate] = useState(
      template.userPromptTemplate,
    );
    return (
      <GenerationTemplateView
        rows={rows}
        breakdownLoading={false}
        breakdownError={null}
        template={template}
        editorLoading={false}
        editorError={null}
        systemPrompt={systemPrompt}
        userPromptTemplate={userPromptTemplate}
        isDirty={
          systemPrompt !== template.systemPrompt ||
          userPromptTemplate !== template.userPromptTemplate
        }
        saving={false}
        saveError={null}
        setSystemPrompt={setSystemPrompt}
        setUserPromptTemplate={setUserPromptTemplate}
        onSave={() => undefined}
      />
    );
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
    systemPrompt: "",
    userPromptTemplate: "",
    isDirty: false,
    saving: false,
    saveError: null,
    setSystemPrompt: () => undefined,
    setUserPromptTemplate: () => undefined,
    onSave: () => undefined,
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
    systemPrompt: "",
    userPromptTemplate: "",
    isDirty: false,
    saving: false,
    saveError: null,
    setSystemPrompt: () => undefined,
    setUserPromptTemplate: () => undefined,
    onSave: () => undefined,
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
    systemPrompt: template.systemPrompt,
    userPromptTemplate: template.userPromptTemplate,
    isDirty: false,
    saving: false,
    saveError: null,
    setSystemPrompt: () => undefined,
    setUserPromptTemplate: () => undefined,
    onSave: () => undefined,
  },
};
