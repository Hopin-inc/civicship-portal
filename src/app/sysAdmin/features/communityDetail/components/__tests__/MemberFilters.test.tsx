import React from "react";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { MemberFilters } from "../MemberFilters";
import { DEFAULT_MEMBER_FILTER } from "../../hooks/useDetailControls";

describe("MemberFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces number input changes", async () => {
    const onChange = vi.fn();
    render(
      <MemberFilters
        value={DEFAULT_MEMBER_FILTER}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );
    // First call happens immediately after mount (debounced from mount is fine),
    // clear that noise and verify explicit change flushes after 300ms.
    onChange.mockClear();

    const minMonthsInInput = screen.getByLabelText("最小在籍月数");
    fireEvent.change(minMonthsInInput, { target: { value: "6" } });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ minMonthsIn: 6 }),
    );
  });

  it("reset button fires onReset", () => {
    const onReset = vi.fn();
    render(
      <MemberFilters
        value={DEFAULT_MEMBER_FILTER}
        onChange={vi.fn()}
        onReset={onReset}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "フィルタをリセット" }));
    expect(onReset).toHaveBeenCalled();
  });

  it("disables inputs when disabled", () => {
    render(
      <MemberFilters
        value={DEFAULT_MEMBER_FILTER}
        onChange={vi.fn()}
        onReset={vi.fn()}
        disabled
      />,
    );
    expect(screen.getByLabelText("最小送付月数")).toBeDisabled();
    expect(screen.getByRole("button", { name: "フィルタをリセット" })).toBeDisabled();
  });
});
