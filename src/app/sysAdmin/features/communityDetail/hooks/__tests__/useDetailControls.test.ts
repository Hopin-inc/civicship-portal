import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { GqlSysAdminSortOrder, GqlSysAdminUserSortField } from "@/types/graphql";
import {
  DEFAULT_MEMBER_FILTER,
  DEFAULT_MEMBER_SORT,
  useDetailControls,
} from "../useDetailControls";

describe("useDetailControls", () => {
  it("initializes with defaults", () => {
    const { result } = renderHook(() => useDetailControls());
    expect(result.current.state.filter).toEqual(DEFAULT_MEMBER_FILTER);
    expect(result.current.state.sort).toEqual(DEFAULT_MEMBER_SORT);
  });

  it("toggleSort flips order for the same field", () => {
    const { result } = renderHook(() => useDetailControls());
    act(() => result.current.toggleSort(GqlSysAdminUserSortField.SendRate));
    // same field, default DESC → ASC
    expect(result.current.state.sort).toEqual({
      field: GqlSysAdminUserSortField.SendRate,
      order: GqlSysAdminSortOrder.Asc,
    });
    act(() => result.current.toggleSort(GqlSysAdminUserSortField.SendRate));
    expect(result.current.state.sort.order).toBe(GqlSysAdminSortOrder.Desc);
  });

  it("toggleSort switches field and resets to DESC", () => {
    const { result } = renderHook(() => useDetailControls());
    act(() => result.current.toggleSort(GqlSysAdminUserSortField.TotalPointsOut));
    expect(result.current.state.sort).toEqual({
      field: GqlSysAdminUserSortField.TotalPointsOut,
      order: GqlSysAdminSortOrder.Desc,
    });
  });

  it("setFilter replaces filter", () => {
    const { result } = renderHook(() => useDetailControls());
    act(() =>
      result.current.setFilter({
        minSendRate: 0.5,
        maxSendRate: 0.9,
        minDonationOutMonths: 3,
        minMonthsIn: 6,
      }),
    );
    expect(result.current.state.filter.minSendRate).toBe(0.5);
    expect(result.current.state.filter.maxSendRate).toBe(0.9);
  });

  it("resetFilter restores defaults", () => {
    const { result } = renderHook(() => useDetailControls());
    act(() =>
      result.current.setFilter({
        minSendRate: 0.2,
        maxSendRate: null,
        minDonationOutMonths: null,
        minMonthsIn: null,
      }),
    );
    act(() => result.current.resetFilter());
    expect(result.current.state.filter).toEqual(DEFAULT_MEMBER_FILTER);
  });

});
