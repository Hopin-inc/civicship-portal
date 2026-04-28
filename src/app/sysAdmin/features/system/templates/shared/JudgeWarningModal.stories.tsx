import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { JudgeWarningModal } from "./JudgeWarningModal";

const meta: Meta<typeof JudgeWarningModal> = {
  title: "SysAdmin/System/Templates/JudgeWarningModal",
  component: JudgeWarningModal,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof JudgeWarningModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-8">
        <Button variant="tertiary" size="sm" onClick={() => setOpen(true)}>
          modal を開く
        </Button>
        <JudgeWarningModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const Saving: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-8">
        <Button variant="tertiary" size="sm" onClick={() => setOpen(true)}>
          modal を開く
        </Button>
        <JudgeWarningModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => undefined}
          saving
        />
      </div>
    );
  },
};
