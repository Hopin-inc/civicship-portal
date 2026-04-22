import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlSysAdminUserSortField } from "@/types/graphql";
import { MemberSortSelect } from "./MemberSortSelect";

const meta: Meta<typeof MemberSortSelect> = {
  title: "SysAdmin/Detail/MemberSortSelect",
  component: MemberSortSelect,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MemberSortSelect>;

function Stateful({ initial }: { initial: GqlSysAdminUserSortField }) {
  const [field, setField] = useState<GqlSysAdminUserSortField>(initial);
  return <MemberSortSelect field={field} onChange={setField} />;
}

export const SendRate: Story = {
  render: () => <Stateful initial={GqlSysAdminUserSortField.SendRate} />,
};
export const MonthsIn: Story = {
  render: () => <Stateful initial={GqlSysAdminUserSortField.MonthsIn} />,
};
export const TotalPointsOut: Story = {
  render: () => <Stateful initial={GqlSysAdminUserSortField.TotalPointsOut} />,
};
