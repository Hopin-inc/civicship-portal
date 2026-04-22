import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DashboardControls } from "../DashboardControls";

describe("DashboardControls", () => {
  const defaults = { asOf: null, tier1: 0.7, tier2: 0.4 };

  it("renders asOf input and threshold sliders", () => {
    render(
      <DashboardControls
        state={defaults}
        onAsOfChange={vi.fn()}
        onThresholdsChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("基準日")).toBeInTheDocument();
    expect(screen.getByText("Tier1 しきい値 (習慣層)")).toBeInTheDocument();
    expect(screen.getByText("Tier2 しきい値 (準習慣層)")).toBeInTheDocument();
  });

  it("fires onAsOfChange with ISO string when date input changes", () => {
    const onAsOfChange = vi.fn();
    render(
      <DashboardControls
        state={defaults}
        onAsOfChange={onAsOfChange}
        onThresholdsChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText("基準日"), {
      target: { value: "2026-04-22" },
    });
    expect(onAsOfChange).toHaveBeenCalledWith(expect.stringMatching(/^2026-04-22T/));
  });

  it("calls onReset when reset is clicked", () => {
    const onReset = vi.fn();
    render(
      <DashboardControls
        state={defaults}
        onAsOfChange={vi.fn()}
        onThresholdsChange={vi.fn()}
        onReset={onReset}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "リセット" }));
    expect(onReset).toHaveBeenCalled();
  });
});
