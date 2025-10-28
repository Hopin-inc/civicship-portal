"use client";

import React from "react";
import PhoneInput, { Country } from "react-phone-number-input";
import { OriginInput } from "./OriginInput";
import { CountrySelect, FlagComponent } from "./PhoneCountrySelect";
import { cn } from "@/lib/utils";

interface InternationalPhoneFieldProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  defaultCountry?: Country;
  countries?: Country[];
  showFlags?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * PhoneInputInner wrapper that applies Origin UI comp-46 styling adjustments
 * to integrate seamlessly with the CountrySelect component
 */
const PhoneInputInner = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <OriginInput
      ref={ref}
      data-slot="phone-input"
      className={cn(
        "-ms-px rounded-s-none shadow-none focus-visible:z-10 flex-1",
        className
      )}
      {...props}
    />
  );
});

PhoneInputInner.displayName = "PhoneInputInner";

/**
 * Pure presentational component for international phone number input
 * - No validation logic (handled by parent)
 * - No labels (handled by parent)
 * - No business logic
 * - Fully controlled via props
 * - Uses Origin UI-styled components (CountrySelect, Input) for consistent styling
 * - Integrates Origin UI comp-46 component styling via shadcn CLI
 */
export function InternationalPhoneField({
  value,
  onChange,
  disabled = false,
  defaultCountry = "JP",
  countries,
  showFlags = false,
  placeholder = "例）09012345678",
  className = "flex flex-row items-stretch rounded-md shadow-xs",
  id = "phone",
}: InternationalPhoneFieldProps) {
  return (
    <PhoneInput
      id={id}
      value={value}
      onChange={onChange}
      defaultCountry={defaultCountry}
      countries={countries}
      international
      withCountryCallingCode
      countryCallingCodeEditable={false}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      inputComponent={PhoneInputInner}
      countrySelectComponent={CountrySelect}
      flagComponent={showFlags ? FlagComponent : () => null}
    />
  );
}
