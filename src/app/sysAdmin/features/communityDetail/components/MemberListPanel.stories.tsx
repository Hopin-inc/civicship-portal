import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  GqlSysAdminSortOrder,
  GqlSysAdminUserSortField,
  type GqlSysAdminCommunityDetailInput,
  type GqlSysAdminMemberList,
  type GqlSysAdminMemberRow,
} from "@/types/graphql";
import { MemberListPanel } from "./MemberListPanel";
import {
  DEFAULT_MEMBER_FILTER,
  DEFAULT_MEMBER_SORT,
  type MemberFilter,
  type MemberSort,
} from "../hooks/useDetailControls";
import { makeMemberRow } from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof MemberListPanel> = {
  title: "SysAdmin/Detail/MemberListPanel",
  component: MemberListPanel,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MemberListPanel>;

const baseInput: GqlSysAdminCommunityDetailInput = {
  communityId: "community-a",
  segmentThresholds: { tier1: 0.7, tier2: 0.4 },
  windowMonths: 10,
  userFilter: {},
  userSort: { field: GqlSysAdminUserSortField.SendRate, order: GqlSysAdminSortOrder.Desc },
  limit: 50,
};

const fetchMoreStub = async () =>
  ({ data: {} }) as unknown as Awaited<
    ReturnType<NonNullable<React.ComponentProps<typeof MemberListPanel>["fetchMore"]>>
  >;

function Stateful({
  users,
  hasNextPage = false,
  initialSort = DEFAULT_MEMBER_SORT,
}: {
  users: GqlSysAdminMemberRow[];
  hasNextPage?: boolean;
  initialSort?: MemberSort;
}) {
  const [filter, setFilter] = useState<MemberFilter>(DEFAULT_MEMBER_FILTER);
  const [sort, setSort] = useState<MemberSort>(initialSort);

  const memberList: GqlSysAdminMemberList = {
    __typename: "SysAdminMemberList",
    hasNextPage,
    nextCursor: hasNextPage ? "mock-cursor" : null,
    users,
  };

  return (
    <MemberListPanel
      memberList={memberList}
      filter={filter}
      sort={sort}
      tier1={0.7}
      tier2={0.4}
      onFilterChange={setFilter}
      onResetFilter={() => setFilter(DEFAULT_MEMBER_FILTER)}
      onSortFieldChange={(field) =>
        setSort({ field, order: GqlSysAdminSortOrder.Desc })
      }
      baseInput={baseInput}
      fetchMore={fetchMoreStub}
      loading={false}
    />
  );
}

const defaultUsers = [
  makeMemberRow({ userId: "u1", name: "島村 友多", userSendRate: 1.0, monthsIn: 10, totalPointsOut: 24000, donationOutMonths: 10 }),
  makeMemberRow({ userId: "u2", name: "HIROSHINESS_58", userSendRate: 0.95, monthsIn: 10, totalPointsOut: 19800, donationOutMonths: 10 }),
  makeMemberRow({ userId: "u3", name: "山田 太郎", userSendRate: 0.83, monthsIn: 12, totalPointsOut: 12500, donationOutMonths: 10 }),
  makeMemberRow({ userId: "u4", name: "佐藤 花子", userSendRate: 0.6, monthsIn: 8, totalPointsOut: 8400, donationOutMonths: 5 }),
  makeMemberRow({ userId: "u5", name: "鈴木 一郎", userSendRate: 0.25, monthsIn: 6, totalPointsOut: 1500, donationOutMonths: 2 }),
  makeMemberRow({ userId: "u6", name: "田中 次郎", userSendRate: 0, monthsIn: 3, totalPointsOut: 0, donationOutMonths: 0 }),
];

export const Default: Story = {
  render: () => <Stateful users={defaultUsers} />,
};

export const SortByTotalPoints: Story = {
  render: () => (
    <Stateful
      users={defaultUsers}
      initialSort={{
        field: GqlSysAdminUserSortField.TotalPointsOut,
        order: GqlSysAdminSortOrder.Desc,
      }}
    />
  ),
};

export const SortByDonationOutMonths: Story = {
  render: () => (
    <Stateful
      users={defaultUsers}
      initialSort={{
        field: GqlSysAdminUserSortField.DonationOutMonths,
        order: GqlSysAdminSortOrder.Desc,
      }}
    />
  ),
};

export const HasMore: Story = {
  render: () => <Stateful users={defaultUsers} hasNextPage />,
};

export const Empty: Story = {
  render: () => <Stateful users={[]} />,
};
