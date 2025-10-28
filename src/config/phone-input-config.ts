import { Country } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

/**
 * Default country for phone input
 */
export const DEFAULT_COUNTRY: Country = "JP";

/**
 * Get allowed countries from environment variable
 * Returns undefined if not set (allows all countries)
 * Returns array of country codes if set
 * Validates country codes against known ISO country codes
 */
export const getAllowedCountries = (): Country[] | undefined => {
  const envCountries = process.env.NEXT_PUBLIC_PHONE_ALLOWED_COUNTRIES;
  if (!envCountries) {
    return undefined; // All countries allowed
  }
  
  const validCountries = Object.keys(en) as Country[];
  
  // Parse, normalize, and validate country codes from environment variable
  return envCountries
    .split(",")
    .map((code) => code.trim().toUpperCase() as Country)
    .filter((code) => validCountries.includes(code));
};

/**
 * Whether to show country flags (disabled to keep bundle size small)
 */
export const SHOW_FLAGS = false;
