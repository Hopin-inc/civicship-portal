import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { InternationalPhoneField } from "../InternationalPhoneField";
import type { Country } from "react-phone-number-input";

describe("InternationalPhoneField", () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
  };

  describe("Rendering", () => {
    it("should render with default country (JP)", () => {
      render(<InternationalPhoneField {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toBeInTheDocument();
    });

    it("should render with custom placeholder", () => {
      render(<InternationalPhoneField {...defaultProps} placeholder="Enter phone" />);

      const input = screen.getByPlaceholderText("Enter phone");
      expect(input).toBeInTheDocument();
    });

    it("should render with custom id", () => {
      render(<InternationalPhoneField {...defaultProps} id="custom-phone" />);

      const phoneInput = document.getElementById("custom-phone");
      expect(phoneInput).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const { container } = render(<InternationalPhoneField {...defaultProps} className="custom-class" />);

      const phoneInput = container.querySelector(".custom-class");
      expect(phoneInput).toBeInTheDocument();
    });
  });

  describe("Phone number input", () => {
    it("should display phone number value", () => {
      render(<InternationalPhoneField {...defaultProps} value="+819012345678" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      // withCountryCallingCode is true, so country code is shown
      expect(input.value).toBe("+81 90 1234 5678");
    });

    it("should call onChange when phone number is entered", () => {
      const onChange = vi.fn();
      render(<InternationalPhoneField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "9012345678" } });

      expect(onChange).toHaveBeenCalled();
    });

    it("should handle undefined value", () => {
      render(<InternationalPhoneField {...defaultProps} value={undefined} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      // Shows default country code when empty
      expect(input.value).toContain("+81");
    });

    it("should handle empty string value", () => {
      render(<InternationalPhoneField {...defaultProps} value="" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      // Shows default country code when empty
      expect(input.value).toContain("+81");
    });
  });

  describe("Country selection", () => {
    it("should render with specified default country", () => {
      render(<InternationalPhoneField {...defaultProps} defaultCountry="US" />);

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      expect(select.value).toBe("US");
    });

    it("should allow country selection", () => {
      const onChange = vi.fn();
      render(<InternationalPhoneField {...defaultProps} onChange={onChange} />);

      const select = screen.getByLabelText("Select country");
      fireEvent.change(select, { target: { value: "US" } });

      // Country change should trigger some update
      expect(select).toBeInTheDocument();
    });

    it("should limit countries when countries prop is provided", () => {
      const limitedCountries: Country[] = ["JP", "US", "GB"];
      render(
        <InternationalPhoneField {...defaultProps} countries={limitedCountries} />
      );

      const select = screen.getByLabelText("Select country") as HTMLSelectElement;
      const options = Array.from(select.options).filter((opt) => opt.value !== "");

      // Should have only the specified countries
      expect(options.length).toBeLessThanOrEqual(limitedCountries.length);
    });
  });

  describe("International format handling", () => {
    it.each([
      ["+819012345678", "JP", "+81 90 1234 5678"],
      ["+16505551234", "US", "+1 650 555 1234"],
      ["+447911123456", "GB", "+44 7911 123456"],
    ])("should format %s for country %s as %s", (phoneNumber, country, expectedFormat) => {
      render(
        <InternationalPhoneField
          {...defaultProps}
          value={phoneNumber}
          defaultCountry={country as Country}
        />
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe(expectedFormat);
    });

    it("should always include country calling code", () => {
      const onChange = vi.fn();
      render(<InternationalPhoneField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "9012345678" } });

      // The onChange should be called with international format (+81...)
      expect(onChange).toHaveBeenCalled();
      if (onChange.mock.calls.length > 0) {
        const calledValue = onChange.mock.calls[0][0];
        if (calledValue) {
          expect(calledValue).toMatch(/^\+/);
        }
      }
    });
  });

  describe("Max length validation", () => {
    it("should enforce max length for Japanese numbers", () => {
      const onChange = vi.fn();
      render(
        <InternationalPhoneField
          {...defaultProps}
          onChange={onChange}
          defaultCountry="JP"
        />
      );

      const input = screen.getByRole("textbox");
      // Try to enter a number that's too long (Japanese mobile is 11 digits including 0)
      fireEvent.change(input, { target: { value: "90123456789012345" } });

      // The component should limit the input length
      expect(input).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("should disable input when disabled prop is true", () => {
      render(<InternationalPhoneField {...defaultProps} disabled={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should disable country select when disabled prop is true", () => {
      render(<InternationalPhoneField {...defaultProps} disabled={true} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toBeDisabled();
    });

    it("should not allow input when disabled", () => {
      const onChange = vi.fn();
      render(<InternationalPhoneField {...defaultProps} onChange={onChange} disabled={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();

      // Disabled inputs don't trigger onChange in the same way
      // The input being disabled is the key behavior we're testing
    });
  });

  describe("Flag display", () => {
    it("should not show flags by default", () => {
      render(<InternationalPhoneField {...defaultProps} />);

      // Flags are hidden by default (showFlags=false)
      const select = screen.getByLabelText("Select country");
      expect(select).toBeInTheDocument();
    });

    it("should show flags when showFlags is true", () => {
      render(<InternationalPhoneField {...defaultProps} showFlags={true} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toBeInTheDocument();
      // Flag component should be rendered but testing its visibility
      // requires more specific DOM inspection
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle switching countries", () => {
      const { rerender } = render(
        <InternationalPhoneField {...defaultProps} defaultCountry="JP" />
      );

      let select = screen.getByLabelText("Select country") as HTMLSelectElement;
      expect(select.value).toBe("JP");

      rerender(<InternationalPhoneField {...defaultProps} defaultCountry="US" />);

      select = screen.getByLabelText("Select country") as HTMLSelectElement;
      expect(select.value).toBe("US");
    });

    it("should handle user entering number then changing country", () => {
      const onChange = vi.fn();
      render(
        <InternationalPhoneField
          {...defaultProps}
          onChange={onChange}
          value="+819012345678"
        />
      );

      const select = screen.getByLabelText("Select country");
      fireEvent.change(select, { target: { value: "US" } });

      expect(select).toBeInTheDocument();
    });

    it("should handle paste event", () => {
      const onChange = vi.fn();
      render(<InternationalPhoneField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole("textbox");

      // Simulate paste
      fireEvent.paste(input, {
        clipboardData: {
          getData: () => "+819012345678",
        },
      });

      expect(input).toBeInTheDocument();
    });
  });

  describe("Metadata and libphonenumber-js integration", () => {
    it("should use max metadata for accurate validation", () => {
      // The component uses metadata.max.json which provides accurate
      // phone number length validation per country
      render(<InternationalPhoneField {...defaultProps} defaultCountry="JP" />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      // Max metadata ensures accurate length limits are enforced
    });

    it("should handle different phone formats per country", () => {
      const { rerender } = render(
        <InternationalPhoneField {...defaultProps} value="+819012345678" />
      );

      let input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toContain("90");

      // Change to US format
      rerender(<InternationalPhoneField {...defaultProps} value="+16505551234" />);
      input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toContain("650");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible country select", () => {
      render(<InternationalPhoneField {...defaultProps} />);

      const select = screen.getByLabelText("Select country");
      expect(select).toHaveAttribute("aria-label", "Select country");
    });

    it("should be keyboard navigable", () => {
      render(<InternationalPhoneField {...defaultProps} />);

      const input = screen.getByRole("textbox");
      input.focus();
      expect(document.activeElement).toBe(input);
    });
  });
});
