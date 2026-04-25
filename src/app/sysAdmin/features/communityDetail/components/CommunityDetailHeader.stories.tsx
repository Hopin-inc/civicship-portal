import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PeriodPresetSelect } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";
import { CommunityDetailHeader } from "./CommunityDetailHeader";

const meta: Meta<typeof CommunityDetailHeader> = {
  title: "SysAdmin/Detail/CommunityDetailHeader",
  component: CommunityDetailHeader,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityDetailHeader>;

const MockGlossaryButton = () => (
  <Button variant="ghost" size="sm" className="gap-1.5">
    <BookOpen className="h-4 w-4" />
    用語
  </Button>
);

const MockPeriodControl = () => (
  <PeriodPresetSelect value="last3Months" onChange={() => {}} />
);

export const Default: Story = {
  args: {
    controls: <MockGlossaryButton />,
    periodControl: <MockPeriodControl />,
  },
};

export const Refetching: Story = {
  args: {
    controls: <MockGlossaryButton />,
    periodControl: <MockPeriodControl />,
    loading: true,
  },
};
