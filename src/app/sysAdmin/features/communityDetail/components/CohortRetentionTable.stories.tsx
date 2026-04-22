import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CohortRetentionTable } from "./CohortRetentionTable";
import { makeCohortRetentionPoint } from "../../../_shared/__mocks__/sysAdminDashboard";

const meta: Meta<typeof CohortRetentionTable> = {
  title: "SysAdmin/Detail/CohortRetentionTable",
  component: CohortRetentionTable,
  decorators: [
    (Story) => (
      <div className="w-[640px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CohortRetentionTable>;

export const WithItems: Story = {
  args: {
    points: [
      makeCohortRetentionPoint({ cohortMonth: new Date("2025-09-01T00:00:00+09:00") }),
      makeCohortRetentionPoint({
        cohortMonth: new Date("2025-10-01T00:00:00+09:00"),
        cohortSize: 22,
        retentionM1: 0.73,
        retentionM3: 0.6,
        retentionM6: null,
      }),
      makeCohortRetentionPoint({
        cohortMonth: new Date("2025-11-01T00:00:00+09:00"),
        cohortSize: 15,
        retentionM1: 0.6,
        retentionM3: null,
        retentionM6: null,
      }),
    ],
  },
};

export const Empty: Story = {
  args: { points: [] },
};
