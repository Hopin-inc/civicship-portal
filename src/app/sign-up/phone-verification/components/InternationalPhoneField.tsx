"use client";

import React from "react";
import PhoneInput, { Country } from "react-phone-number-input";

interface InternationalPhoneFieldProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  defaultCountry?: Country;
  countries?: Country[];
  labels?: Record<string, string>;
  showFlags?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Pure presentational component for international phone number input
 * - No validation logic (handled by parent)
 * - No labels (handled by parent)
 * - No business logic
 * - Fully controlled via props
 */
export function InternationalPhoneField({
  value,
  onChange,
  disabled = false,
  defaultCountry = "JP",
  countries,
  labels,
  showFlags = false,
  placeholder = "例）09012345678",
  className = "w-full h-12 px-3 border rounded-md",
  id = "phone",
}: InternationalPhoneFieldProps) {
  return (
    <PhoneInput
      id={id}
      value={value}
      onChange={onChange}
      defaultCountry={defaultCountry}
      countries={countries}
      labels={labels}
      international
      withCountryCallingCode
      countryCallingCodeEditable={false}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      flagComponent={showFlags ? undefined : () => null}
    />
  );
}
