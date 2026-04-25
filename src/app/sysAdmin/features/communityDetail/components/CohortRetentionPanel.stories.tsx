import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CohortRetentionPanel } from "./CohortRetentionPanel";
import { makeCohortRetentionPoint } from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CohortRetentionPanel> = {
  title: "SysAdmin/Detail/CohortRetentionPanel",
  component: CohortRetentionPanel,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CohortRetentionPanel>;

const points = [
  makeCohortRetentionPoint({
    cohortMonth: new Date("2025-09-01T00:00:00+09:00"),
    cohortSize: 18,
    retentionM1: 0.78,
    retentionM3: 0.6,
    retentionM6: 0.42,
  }),
  makeCohortRetentionPoint({
    cohortMonth: new Date("2025-10-01T00:00:00+09:00"),
    cohortSize: 22,
    retentionM1: 0.73,
    retentionM3: 0.55,
    retentionM6: null,
  }),
  makeCohortRetentionPoint({
    cohortMonth: new Date("2025-11-01T00:00:00+09:00"),
    cohortSize: 15,
    retentionM1: 0.6,
    retentionM3: 0.45,
    retentionM6: null,
  }),
  makeCohortRetentionPoint({
    cohortMonth: new Date("2025-12-01T00:00:00+09:00"),
    cohortSize: 25,
    retentionM1: 0.7,
    retentionM3: null,
    retentionM6: null,
  }),
  makeCohortRetentionPoint({
    cohortMonth: new Date("2026-01-01T00:00:00+09:00"),
    cohortSize: 12,
    retentionM1: 0.5,
    retentionM3: null,
    retentionM6: null,
  }),
];

export const Default: Story = { args: { points } };
export const Empty: Story = { args: { points: [] } };
