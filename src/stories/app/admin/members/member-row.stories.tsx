import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { MemberRow } from "@/app/admin/members/components/MemberRow";
import { GqlRole, GqlUser } from "@/types/graphql";

const mockUsers: GqlUser[] = [
  {
    id: "user1",
    name: "田中太郎",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "user2",
    name: "佐藤花子",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "user3",
    name: "山田次郎",
    image: null,
  },
];

const meta: Meta<typeof MemberRow> = {
  title: "App/Admin/Members/MemberRow",
  component: MemberRow,
  tags: ["autodocs"],
  argTypes: {
    role: {
      control: "select",
      options: Object.values(GqlRole),
      description: "Current user role",
    },
    currentUserRole: {
      control: "select", 
      options: Object.values(GqlRole),
      description: "Role of the current user (affects permissions)",
    },
    user: {
      control: "object",
      description: "User information",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-4 bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MemberRow>;

export const Owner: Story = {
  args: {
    user: mockUsers[0],
    role: GqlRole.Owner,
    currentUserRole: GqlRole.Owner,
    onRoleChange: (newRole: GqlRole) => console.log("Role changed to:", newRole),
  },
};

export const Manager: Story = {
  args: {
    user: mockUsers[1],
    role: GqlRole.Manager,
    currentUserRole: GqlRole.Owner,
    onRoleChange: (newRole: GqlRole) => console.log("Role changed to:", newRole),
  },
};

export const Member: Story = {
  args: {
    user: mockUsers[0],
    role: GqlRole.Member,
    currentUserRole: GqlRole.Owner,
    onRoleChange: (newRole: GqlRole) => console.log("Role changed to:", newRole),
  },
};

export const DisabledForNonOwner: Story = {
  args: {
    user: mockUsers[1],
    role: GqlRole.Member,
    currentUserRole: GqlRole.Manager,
    onRoleChange: (newRole: GqlRole) => console.log("Role changed to:", newRole),
  },
};

export const UserWithoutImage: Story = {
  args: {
    user: mockUsers[2],
    role: GqlRole.Member,
    currentUserRole: GqlRole.Owner,
    onRoleChange: (newRole: GqlRole) => console.log("Role changed to:", newRole),
  },
};

export const MultipleMembers: Story = {
  render: () => (
    <div className="space-y-2">
      {mockUsers.map((user, index) => (
        <MemberRow
          key={user.id}
          user={user}
          role={[GqlRole.Owner, GqlRole.Manager, GqlRole.Member][index]}
          currentUserRole={GqlRole.Owner}
          onRoleChange={(newRole: GqlRole) => console.log(`Role changed for ${user.name}:`, newRole)}
        />
      ))}
    </div>
  ),
};
