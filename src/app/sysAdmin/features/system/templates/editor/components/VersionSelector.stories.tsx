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

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <VersionSelector
        versions={[3, 2, 1]}
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

export const SpecificVersionSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(2);
    return (
      <VersionSelector
        versions={[3, 2, 1]}
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

export const SingleVersion: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <VersionSelector
        versions={[1]}
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <VersionSelector
        versions={[]}
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};
