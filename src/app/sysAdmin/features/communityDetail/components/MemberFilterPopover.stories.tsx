import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MemberFilterPopover } from "./MemberFilterPopover";
import { DEFAULT_MEMBER_FILTER, type MemberFilter } from "../hooks/useDetailControls";

const meta: Meta<typeof MemberFilterPopover> = {
  title: "SysAdmin/Detail/MemberFilterPopover",
  component: MemberFilterPopover,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MemberFilterPopover>;

function Stateful({
  initial = DEFAULT_MEMBER_FILTER,
}: {
  initial?: MemberFilter;
}) {
  const [value, setValue] = useState<MemberFilter>(initial);
  return (
    <MemberFilterPopover
      value={value}
      onChange={setValue}
      onReset={() => setValue(DEFAULT_MEMBER_FILTER)}
    />
  );
}

export const Default: Story = { render: () => <Stateful /> };

export const WithActiveFilters: Story = {
  render: () => (
    <Stateful
      initial={{
        minSendRate: 0.5,
        maxSendRate: 0.9,
        minDonationOutMonths: 6,
        minMonthsIn: 12,
      }}
    />
  ),
};
