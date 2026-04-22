"use client";

import { useCallback, useReducer } from "react";
import { GqlSysAdminSortOrder, GqlSysAdminUserSortField } from "@/types/graphql";

export type MemberFilter = {
  minSendRate: number | null;
  maxSendRate: number | null;
  minDonationOutMonths: number | null;
  minMonthsIn: number | null;
};

export type MemberSort = {
  field: GqlSysAdminUserSortField;
  order: GqlSysAdminSortOrder;
};

export type DetailControlsState = {
  windowMonths: number;
  /**
   * Number of most-recent cohorts to display in the cohort retention chart.
   * 0 = show all returned by API (capped by `windowMonths` server-side).
   * UI-side slice only — does NOT affect API request.
   */
  cohortMonths: number;
  filter: MemberFilter;
  sort: MemberSort;
};

const DEFAULT_FILTER: MemberFilter = {
  minSendRate: 0.7,
  maxSendRate: null,
  minDonationOutMonths: null,
  minMonthsIn: null,
};

const DEFAULT_SORT: MemberSort = {
  field: GqlSysAdminUserSortField.SendRate,
  order: GqlSysAdminSortOrder.Desc,
};

const DEFAULTS: DetailControlsState = {
  windowMonths: 10,
  cohortMonths: 12,
  filter: DEFAULT_FILTER,
  sort: DEFAULT_SORT,
};

type Action =
  | { type: "setWindowMonths"; value: number }
  | { type: "setCohortMonths"; value: number }
  | { type: "setFilter"; value: MemberFilter }
  | { type: "setSort"; value: MemberSort }
  | { type: "setSortField"; field: GqlSysAdminUserSortField }
  | { type: "toggleSort"; field: GqlSysAdminUserSortField }
  | { type: "resetFilter" }
  | { type: "reset" };

function reducer(state: DetailControlsState, action: Action): DetailControlsState {
  switch (action.type) {
    case "setWindowMonths":
      return { ...state, windowMonths: action.value };
    case "setCohortMonths":
      return { ...state, cohortMonths: action.value };
    case "setFilter":
      return { ...state, filter: action.value };
    case "setSort":
      return { ...state, sort: action.value };
    case "setSortField":
      return {
        ...state,
        sort: { field: action.field, order: GqlSysAdminSortOrder.Desc },
      };
    case "toggleSort":
      if (state.sort.field === action.field) {
        return {
          ...state,
          sort: {
            field: state.sort.field,
            order:
              state.sort.order === GqlSysAdminSortOrder.Asc
                ? GqlSysAdminSortOrder.Desc
                : GqlSysAdminSortOrder.Asc,
          },
        };
      }
      return {
        ...state,
        sort: { field: action.field, order: GqlSysAdminSortOrder.Desc },
      };
    case "resetFilter":
      return { ...state, filter: DEFAULT_FILTER };
    case "reset":
      return DEFAULTS;
    default:
      return state;
  }
}

export function useDetailControls(initial?: Partial<DetailControlsState>) {
  const [state, dispatch] = useReducer(reducer, { ...DEFAULTS, ...initial });

  const setWindowMonths = useCallback(
    (value: number) => dispatch({ type: "setWindowMonths", value }),
    [],
  );
  const setCohortMonths = useCallback(
    (value: number) => dispatch({ type: "setCohortMonths", value }),
    [],
  );
  const setFilter = useCallback(
    (value: MemberFilter) => dispatch({ type: "setFilter", value }),
    [],
  );
  const setSort = useCallback(
    (value: MemberSort) => dispatch({ type: "setSort", value }),
    [],
  );
  const setSortField = useCallback(
    (field: GqlSysAdminUserSortField) => dispatch({ type: "setSortField", field }),
    [],
  );
  const toggleSort = useCallback(
    (field: GqlSysAdminUserSortField) => dispatch({ type: "toggleSort", field }),
    [],
  );
  const resetFilter = useCallback(() => dispatch({ type: "resetFilter" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return {
    state,
    setWindowMonths,
    setCohortMonths,
    setFilter,
    setSort,
    setSortField,
    toggleSort,
    resetFilter,
    reset,
  };
}

export const DETAIL_CONTROLS_DEFAULTS = DEFAULTS;
export const DEFAULT_MEMBER_FILTER = DEFAULT_FILTER;
export const DEFAULT_MEMBER_SORT = DEFAULT_SORT;
