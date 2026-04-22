import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { MemberFilters } from "./MemberFilters";
import {
  DEFAULT_MEMBER_FILTER,
  type MemberFilter,
} from "../hooks/useDetailControls";

const meta: Meta<typeof MemberFilters> = {
  title: "SysAdmin/Detail/MemberFilters",
  component: MemberFilters,
  decorators: [
    (Story) => (
      <div className="w-[900px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MemberFilters>;

function Stateful({ initial }: { initial: MemberFilter }) {
  const [value, setValue] = useState<MemberFilter>(initial);
  return (
    <MemberFilters
      value={value}
      onChange={setValue}
      onReset={() => setValue(DEFAULT_MEMBER_FILTER)}
    />
  );
}

export const Default: Story = { render: () => <Stateful initial={DEFAULT_MEMBER_FILTER} /> };

export const WithSelectedFilters: Story = {
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

export const Disabled: Story = {
  render: () => (
    <MemberFilters
      value={DEFAULT_MEMBER_FILTER}
      onChange={() => {}}
      onReset={() => {}}
      disabled
    />
  ),
};
