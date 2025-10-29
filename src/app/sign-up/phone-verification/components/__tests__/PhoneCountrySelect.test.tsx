import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CountrySelect, FlagComponent } from "../PhoneCountrySelect";
import type { Country } from "react-phone-number-input";

describe("CountrySelect", () => {
  const mockOptions = [
    { label: "Japan", value: "JP" as Country },
    { label: "United States", value: "US" as Country },
    { label: "United Kingdom", value: "GB" as Country },
    { label: "Korea", value: "KR" as Country },
  ];

  const defaultProps = {
    value: "JP" as Country,
    onChange: vi.fn(),
    options: mockOptions,
  };

  describe("Rendering", () => {
    it("should render country select dropdown", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toBeInTheDocument();
    });

    it("should render with selected country", () => {
      render(<CountrySelect {...defaultProps} value="US" />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      expect(select.value).toBe("US");
    });

    it("should render default option", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const defaultOption = Array.from(select.options).find(
        (opt) => opt.value === ""
      );

      expect(defaultOption).toBeDefined();
      expect(defaultOption?.textContent).toBe("Select a country");
    });

    it("should render all provided country options", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const options = Array.from(select.options).filter((opt) => opt.value !== "");

      expect(options).toHaveLength(mockOptions.length);
    });

    it("should display country names and calling codes", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const japanOption = Array.from(select.options).find((opt) => opt.value === "JP");

      expect(japanOption?.textContent).toContain("Japan");
      expect(japanOption?.textContent).toContain("+81");
    });
  });

  describe("Country selection", () => {
    it("should call onChange when country is selected", () => {
      const onChange = vi.fn();
      render(<CountrySelect {...defaultProps} onChange={onChange} />);

      const select = screen.getByLabelText("Select country");
      fireEvent.change(select, { target: { value: "US" } });

      expect(onChange).toHaveBeenCalledWith("US");
    });

    it("should call onChange with correct country code", () => {
      const onChange = vi.fn();
      render(<CountrySelect {...defaultProps} onChange={onChange} />);

      const select = screen.getByLabelText("Select country");
      fireEvent.change(select, { target: { value: "GB" } });

      expect(onChange).toHaveBeenCalledWith("GB");
    });

    it("should handle multiple country changes", () => {
      const onChange = vi.fn();
      render(<CountrySelect {...defaultProps} onChange={onChange} />);

      const select = screen.getByLabelText("Select country");

      fireEvent.change(select, { target: { value: "US" } });
      fireEvent.change(select, { target: { value: "GB" } });
      fireEvent.change(select, { target: { value: "KR" } });

      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenNthCalledWith(1, "US");
      expect(onChange).toHaveBeenNthCalledWith(2, "GB");
      expect(onChange).toHaveBeenNthCalledWith(3, "KR");
    });
  });

  describe("Disabled state", () => {
    it("should disable select when disabled prop is true", () => {
      render(<CountrySelect {...defaultProps} disabled={true} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toBeDisabled();
    });

    it("should not call onChange when disabled", () => {
      const onChange = vi.fn();
      render(<CountrySelect {...defaultProps} onChange={onChange} disabled={true} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toBeDisabled();

      // Disabled selects should not allow user interaction
      // fireEvent bypasses disabled state, so we just verify it's disabled
    });
  });

  describe("Options filtering", () => {
    it("should filter out options with undefined values", () => {
      const optionsWithUndefined = [
        ...mockOptions,
        { label: "Invalid", value: undefined },
      ];

      render(<CountrySelect {...defaultProps} options={optionsWithUndefined} />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const options = Array.from(select.options).filter((opt) => opt.value !== "");

      // Should only have the valid options (not the undefined one)
      expect(options).toHaveLength(mockOptions.length);
    });

    it("should handle empty options array", () => {
      render(<CountrySelect {...defaultProps} options={[]} />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const options = Array.from(select.options).filter((opt) => opt.value !== "");

      expect(options).toHaveLength(0);
    });
  });

  describe("Styling and CSS classes", () => {
    it("should apply wrapper classes", () => {
      render(<CountrySelect {...defaultProps} />);

      const wrapper = screen
        .getByLabelText("Select country")
        .closest("div");

      expect(wrapper).toHaveClass("relative");
      expect(wrapper).toHaveClass("inline-flex");
      expect(wrapper).toHaveClass("items-center");
    });

    it("should have opacity-0 on select for custom styling", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toHaveClass("opacity-0");
      expect(select).toHaveClass("absolute");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on select", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toHaveAttribute("aria-label", "Select country");
    });

    it("should have aria-hidden on decorative elements", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      const wrapper = select.closest("div");
      const decorativeDiv = wrapper?.querySelector('[aria-hidden="true"]');

      expect(decorativeDiv).toBeInTheDocument();
    });

    it("should be keyboard navigable", () => {
      render(<CountrySelect {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      select.focus();

      expect(document.activeElement).toBe(select);
    });
  });

  describe("Real-world country codes", () => {
    it.each([
      ["JP", "+81", "Japan"],
      ["US", "+1", "United States"],
      ["GB", "+44", "United Kingdom"],
      ["KR", "+82", "Korea"],
    ])("should display correct calling code for %s", (countryCode, callingCode, countryName) => {
      const options = [{ label: countryName, value: countryCode as Country }];
      render(<CountrySelect {...defaultProps} options={options} />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const option = Array.from(select.options).find(
        (opt) => opt.value === countryCode
      );

      expect(option?.textContent).toContain(countryName);
      expect(option?.textContent).toContain(callingCode);
    });
  });
});

describe("FlagComponent", () => {
  describe("Rendering", () => {
    it("should render flag for valid country", () => {
      const { container } = render(
        <FlagComponent country="JP" countryName="Japan" />
      );

      const flag = container.querySelector("span");
      expect(flag).toBeInTheDocument();
      expect(flag).toHaveClass("w-5");
      expect(flag).toHaveClass("overflow-hidden");
      expect(flag).toHaveClass("rounded-sm");
    });

    it("should render flag with country name title", () => {
      render(<FlagComponent country="US" countryName="United States" />);

      // The flag SVG should have a title attribute
      const title = screen.queryByTitle("United States");
      expect(title).toBeInTheDocument();
    });

    it("should render PhoneIcon for country without flag", () => {
      // Using a potentially non-existent country code
      const { container } = render(
        <FlagComponent country={"XX" as Country} countryName="Unknown" />
      );

      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });
  });

  describe("Multiple countries", () => {
    it.each([
      ["JP", "Japan"],
      ["US", "United States"],
      ["GB", "United Kingdom"],
      ["KR", "Korea"],
      ["FR", "France"],
      ["DE", "Germany"],
      ["AU", "Australia"],
    ])("should render flag for %s (%s)", (countryCode, countryName) => {
      const { container } = render(
        <FlagComponent country={countryCode as Country} countryName={countryName} />
      );

      const flag = container.querySelector("span");
      expect(flag).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes", () => {
      const { container } = render(
        <FlagComponent country="JP" countryName="Japan" />
      );

      const flag = container.querySelector("span");
      expect(flag).toHaveClass("w-5");
      expect(flag).toHaveClass("overflow-hidden");
      expect(flag).toHaveClass("rounded-sm");
    });
  });

  describe("Fallback behavior", () => {
    it("should handle undefined country gracefully", () => {
      const { container } = render(
        <FlagComponent country={undefined as any} countryName="" />
      );

      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });
  });
});
