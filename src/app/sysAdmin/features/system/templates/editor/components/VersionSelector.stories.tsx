import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VersionSelector } from "./VersionSelector";

const meta: Meta<typeof VersionSelector> = {
  title: "SysAdmin/System/Templates/VersionSelector",
  component: VersionSelector,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VersionSelector>;

function StatefulSelector({
  versions,
  initialSelected,
}: {
  versions: number[];
  initialSelected: number | null;
}) {
  const [selected, setSelected] = useState<number | null>(initialSelected);
  return (
    <VersionSelector versions={versions} selected={selected} onSelect={setSelected} />
  );
}

export const Default: Story = {
  render: () => <StatefulSelector versions={[3, 2, 1]} initialSelected={null} />,
};

export const SpecificVersionSelected: Story = {
  render: () => <StatefulSelector versions={[3, 2, 1]} initialSelected={2} />,
};

export const SingleVersion: Story = {
  render: () => <StatefulSelector versions={[1]} initialSelected={null} />,
};

export const Empty: Story = {
  render: () => <StatefulSelector versions={[]} initialSelected={null} />,
};
