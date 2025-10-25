import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { DateGroupViewModel } from "./types";

export function presentDateGroup(dateISO: string): DateGroupViewModel {
  const dateObj = parseISO(dateISO);
  const isValid = !isNaN(dateObj.getTime());

  return {
    month: isValid ? format(dateObj, "M", { locale: ja }) : "",
    day: isValid ? format(dateObj, "dd", { locale: ja }) : "",
    weekday: isValid ? format(dateObj, "E", { locale: ja }) : "",
  };
}
