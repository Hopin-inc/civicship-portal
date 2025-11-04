"use client";

import React from "react";
import PhoneInput, { Country } from "react-phone-number-input";
import metadata from "libphonenumber-js/metadata.max.json";
import { OriginInput } from "./OriginInput";
import { CountrySelect, FlagComponent } from "./PhoneCountrySelect";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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

export function InternationalPhoneField({
  value,
  onChange,
  disabled = false,
  defaultCountry = "JP",
  countries,
  showFlags = false,
  placeholder,
  className = "flex flex-row items-stretch rounded-md shadow-xs",
  id = "phone",
}: InternationalPhoneFieldProps) {
  const t = useTranslations();
  const defaultPlaceholder = t("phoneVerification.field.placeholder");
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
      placeholder={placeholder || defaultPlaceholder}
      className={className}
      inputComponent={PhoneInputInner}
      countrySelectComponent={CountrySelect}
      flagComponent={showFlags ? FlagComponent : undefined}
      metadata={metadata}
      limitMaxLength
    />
  );
}
