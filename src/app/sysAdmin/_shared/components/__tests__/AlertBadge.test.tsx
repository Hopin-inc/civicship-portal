import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AlertBadge } from "../AlertBadge";

describe("AlertBadge", () => {
  it("renders label when active=true", () => {
    render(<AlertBadge variant="activeDrop" active={true} />);
    expect(screen.getByText("活動率低下")).toBeInTheDocument();
  });
  it("renders nothing when active=false", () => {
    const { container } = render(<AlertBadge variant="churnSpike" active={false} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("renders distinct label per variant", () => {
    render(<AlertBadge variant="noNewMembers" active={true} />);
    expect(screen.getByText("新規加入なし")).toBeInTheDocument();
  });
});
