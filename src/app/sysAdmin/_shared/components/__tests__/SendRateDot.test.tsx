import React from "react";
import { describe, expect, it } from "vitest";
import { classifySendRate, SendRateDot } from "../SendRateDot";
import { render } from "@testing-library/react";

describe("classifySendRate", () => {
  it("returns habitual for >= 0.7 (boundary inclusive, default thresholds)", () => {
    expect(classifySendRate(0.7)).toBe("habitual");
    expect(classifySendRate(1.0)).toBe("habitual");
  });
  it("returns regular for [0.4, 0.7) (default thresholds)", () => {
    expect(classifySendRate(0.4)).toBe("regular");
    expect(classifySendRate(0.6999)).toBe("regular");
  });
  it("returns occasional for (0, 0.4) (default thresholds)", () => {
    expect(classifySendRate(0.001)).toBe("occasional");
    expect(classifySendRate(0.3999)).toBe("occasional");
  });
  it("returns latent for 0", () => {
    expect(classifySendRate(0)).toBe("latent");
  });

  it("respects caller-supplied tier1/tier2 (stricter)", () => {
    // user raises habitual threshold to 0.85
    expect(classifySendRate(0.8, 0.85, 0.5)).toBe("regular");
    expect(classifySendRate(0.85, 0.85, 0.5)).toBe("habitual");
  });

  it("respects caller-supplied tier1/tier2 (looser)", () => {
    // user lowers habitual threshold to 0.5
    expect(classifySendRate(0.55, 0.5, 0.3)).toBe("habitual");
    expect(classifySendRate(0.35, 0.5, 0.3)).toBe("regular");
  });
});

describe("SendRateDot", () => {
  it("renders a span (visual only — aria-hidden)", () => {
    const { container } = render(<SendRateDot rate={0.85} />);
    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span?.getAttribute("aria-hidden")).toBe("true");
  });
});
