import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimaryAlertBadge, selectPrimaryAlert } from "../PrimaryAlertBadge";

describe("selectPrimaryAlert", () => {
  it("returns null when no alerts active", () => {
    expect(
      selectPrimaryAlert({
        churnSpike: false,
        activeDrop: false,
        noNewMembers: false,
      }),
    ).toBeNull();
  });

  it("prioritizes churnSpike over the others", () => {
    expect(
      selectPrimaryAlert({
        churnSpike: true,
        activeDrop: true,
        noNewMembers: true,
      }),
    ).toBe("churnSpike");
  });

  it("falls through to activeDrop when churnSpike is off", () => {
    expect(
      selectPrimaryAlert({
        churnSpike: false,
        activeDrop: true,
        noNewMembers: true,
      }),
    ).toBe("activeDrop");
  });

  it("falls through to noNewMembers when others are off", () => {
    expect(
      selectPrimaryAlert({
        churnSpike: false,
        activeDrop: false,
        noNewMembers: true,
      }),
    ).toBe("noNewMembers");
  });
});

describe("PrimaryAlertBadge", () => {
  it("renders the highest-priority label", () => {
    render(
      <PrimaryAlertBadge
        alerts={{
          churnSpike: true,
          activeDrop: true,
          noNewMembers: false,
        }}
      />,
    );
    expect(screen.getByText("離脱加速")).toBeInTheDocument();
  });

  it("renders nothing when all alerts are false", () => {
    const { container } = render(
      <PrimaryAlertBadge
        alerts={{
          churnSpike: false,
          activeDrop: false,
          noNewMembers: false,
        }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
