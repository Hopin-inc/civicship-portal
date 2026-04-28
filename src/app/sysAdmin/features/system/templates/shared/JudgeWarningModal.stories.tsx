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

function StatefulModalDemo({ saving = false }: { saving?: boolean }) {
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
        saving={saving}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <StatefulModalDemo />,
};

export const Saving: Story = {
  render: () => <StatefulModalDemo saving />,
};
