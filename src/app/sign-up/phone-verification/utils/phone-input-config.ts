import { Country } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

export const DEFAULT_COUNTRY: Country = "JP";

export const getAllowedCountries = (): Country[] | undefined => {
  const envCountries = process.env.NEXT_PUBLIC_PHONE_ALLOWED_COUNTRIES;
  if (!envCountries) {
    return undefined; // All countries allowed
  }

  const validCountries = Object.keys(en) as Country[];

  return envCountries
    .split(",")
    .map((code) => code.trim().toUpperCase() as Country)
    .filter((code) => validCountries.includes(code));
};

export const SHOW_FLAGS = false;
