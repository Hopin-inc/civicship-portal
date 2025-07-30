import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import AttendanceSheet from "@/app/admin/reservations/components/AttendanceSheet";
import { GqlEvaluationStatus, GqlParticipation } from "@/types/graphql";

const mockParticipations: GqlParticipation[] = [
  {
    id: "p1",
    user: { 
      id: "u1", 
      name: "田中太郎", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
    },
    evaluation: null,
  },
  {
    id: "p2", 
    user: { 
      id: "u2", 
      name: "佐藤花子", 
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" 
    },
    evaluation: null,
  },
  {
    id: "p3",
    user: {
      id: "u3",
      name: "山田次郎",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    evaluation: null,
  },
];

const meta: Meta<typeof AttendanceSheet> = {
  title: "App/Admin/Reservations/AttendanceSheet",
  component: AttendanceSheet,
  tags: ["autodocs"],
  argTypes: {
    participations: {
      control: "object",
      description: "List of participations",
    },
    attendanceData: {
      control: "object",
      description: "Attendance status data",
    },
    isSaved: {
      control: "boolean",
      description: "Whether attendance has been saved",
    },
    isSaving: {
      control: "boolean",
      description: "Whether currently saving",
    },
    allEvaluated: {
      control: "boolean",
      description: "Whether all participants have been evaluated",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AttendanceSheet>;

export const Default: Story = {
  args: {
    participations: mockParticipations,
    attendanceData: {},
    handleAttendanceChange: (id: string, status: GqlEvaluationStatus) => console.log("Attendance changed:", id, status),
    isSaved: false,
    isSaving: false,
    batchLoading: false,
    isConfirmDialogOpen: false,
    setIsConfirmDialogOpen: () => {},
    handleSaveAllAttendance: () => console.log("Save all attendance"),
    allEvaluated: false,
  },
};

export const WithAttendanceData: Story = {
  args: {
    ...Default.args,
    attendanceData: { 
      p1: GqlEvaluationStatus.Passed, 
      p2: GqlEvaluationStatus.Failed,
      p3: GqlEvaluationStatus.Passed 
    },
    allEvaluated: true,
  },
};

export const EmptyParticipations: Story = {
  args: {
    ...Default.args,
    participations: [],
  },
};

export const SavingState: Story = {
  args: {
    ...Default.args,
    attendanceData: { 
      p1: GqlEvaluationStatus.Passed, 
      p2: GqlEvaluationStatus.Failed 
    },
    isSaving: true,
    allEvaluated: true,
  },
};

export const SavedState: Story = {
  args: {
    ...Default.args,
    attendanceData: { 
      p1: GqlEvaluationStatus.Passed, 
      p2: GqlEvaluationStatus.Failed,
      p3: GqlEvaluationStatus.Passed 
    },
    isSaved: true,
    allEvaluated: true,
  },
};
