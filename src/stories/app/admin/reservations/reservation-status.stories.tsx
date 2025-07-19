import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReservationStatus } from "@/app/admin/reservations/components/ReservationStatus";
import { GqlReservationStatus } from "@/types/graphql";

const meta: Meta<typeof ReservationStatus> = {
  title: "App/Admin/Reservations/ReservationStatus",
  component: ReservationStatus,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: Object.values(GqlReservationStatus),
      description: "Reservation status",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationStatus>;

export const Applied: Story = {
  args: { status: GqlReservationStatus.Applied },
};

export const Accepted: Story = {
  args: { status: GqlReservationStatus.Accepted },
};

export const Canceled: Story = {
  args: { status: GqlReservationStatus.Canceled },
};

export const Rejected: Story = {
  args: { status: GqlReservationStatus.Rejected },
};
