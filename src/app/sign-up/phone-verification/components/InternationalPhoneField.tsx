"use client";

import React from "react";
import PhoneInput, { Country } from "react-phone-number-input";
import { OriginInput } from "./OriginInput";

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
 * Pure presentational component for international phone number input
 * - No validation logic (handled by parent)
 * - No labels (handled by parent)
 * - No business logic
 * - Fully controlled via props
 * - Uses Origin UI-styled Input component for consistent styling
 */
export function InternationalPhoneField({
  value,
  onChange,
  disabled = false,
  defaultCountry = "JP",
  countries,
  showFlags = false,
  placeholder = "例）09012345678",
  className = "PhoneInput",
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
      inputComponent={OriginInput}
      flagComponent={showFlags ? undefined : () => null}
    />
  );
}
