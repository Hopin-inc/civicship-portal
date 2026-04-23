import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DashboardControls } from "../DashboardControls";
import type { DashboardControlsState } from "../../hooks/useDashboardControls";

describe("DashboardControls", () => {
  const defaults: DashboardControlsState = {
    period: "last3Months",
    tier1: 0.7,
    tier2: 0.4,
  };

  it("renders period select and threshold sliders", () => {
    render(
      <DashboardControls
        state={defaults}
        onPeriodChange={vi.fn()}
        onThresholdsChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("期間")).toBeInTheDocument();
    expect(screen.getByText("習慣化の閾値")).toBeInTheDocument();
    expect(screen.getByText("定期参加の閾値")).toBeInTheDocument();
  });

  it("shows the currently selected period in the trigger", () => {
    render(
      <DashboardControls
        state={{ ...defaults, period: "last6Months" }}
        onPeriodChange={vi.fn()}
        onThresholdsChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    // Select trigger displays the label of the current option.
    // (Radix Portal の展開操作は happy-dom だと不安定なので表示だけ確認)
    expect(screen.getByText("直近半年")).toBeInTheDocument();
  });

  it("calls onReset when reset is clicked", () => {
    const onReset = vi.fn();
    render(
      <DashboardControls
        state={defaults}
        onPeriodChange={vi.fn()}
        onThresholdsChange={vi.fn()}
        onReset={onReset}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "リセット" }));
    expect(onReset).toHaveBeenCalled();
  });
});
