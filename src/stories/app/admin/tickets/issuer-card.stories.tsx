import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TicketIssueCard } from "@/app/admin/tickets/components/IssuerCard";
import { GqlClaimLinkStatus } from "@/types/graphql";

const meta: Meta<typeof TicketIssueCard> = {
  title: "App/Admin/Tickets/IssuerCard",
  component: TicketIssueCard,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: Object.values(GqlClaimLinkStatus),
      description: "Claim link status",
    },
    qty: { 
      control: "number",
      description: "Number of tickets issued",
    },
    title: { 
      control: "text",
      description: "Ticket title",
    },
    href: { 
      control: "text",
      description: "Link URL",
    },
    createdAt: {
      control: "text",
      description: "Creation date (ISO string)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TicketIssueCard>;

export const Issued: Story = {
  args: {
    status: GqlClaimLinkStatus.Issued,
    qty: 10,
    title: "体験チケット",
    createdAt: "2024-01-15T10:00:00Z",
    href: "/admin/tickets/123",
  },
};

export const Claimed: Story = {
  args: {
    status: GqlClaimLinkStatus.Claimed,
    qty: 5,
    title: "プレミアムチケット",
    createdAt: "2024-01-10T15:30:00Z",
    href: "/admin/tickets/456",
  },
};

export const Invalid: Story = {
  args: {
    status: GqlClaimLinkStatus.Invalid,
    qty: 3,
    title: "期限切れチケット",
    createdAt: "2024-01-01T09:00:00Z",
  },
};

export const WithoutLink: Story = {
  args: {
    status: GqlClaimLinkStatus.Issued,
    qty: 8,
    title: "リンクなしチケット",
    createdAt: "2024-01-12T14:20:00Z",
  },
};

export const MissingData: Story = {
  args: {
    title: "データ不完全チケット",
  },
};
