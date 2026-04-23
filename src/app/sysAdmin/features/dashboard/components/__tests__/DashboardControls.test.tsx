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

  it("renders period preset and threshold sliders", () => {
    render(
      <DashboardControls
        state={defaults}
        onPeriodChange={vi.fn()}
        onThresholdsChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "集計期間" })).toBeInTheDocument();
    expect(screen.getByText("習慣化の閾値")).toBeInTheDocument();
    expect(screen.getByText("定期参加の閾値")).toBeInTheDocument();
  });

  it("fires onPeriodChange when a preset is clicked", () => {
    const onPeriodChange = vi.fn();
    render(
      <DashboardControls
        state={defaults}
        onPeriodChange={onPeriodChange}
        onThresholdsChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "半年" }));
    expect(onPeriodChange).toHaveBeenCalledWith("last6Months");
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
