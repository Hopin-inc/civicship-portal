import { useTranslations } from "next-intl";
import { GqlRole } from "@/types/graphql";

export type Translator = ReturnType<typeof useTranslations>;

export function translateRole(role: string, t: Translator): string {
  switch (role) {
    case GqlRole.Owner:
      return t("adminVotes.form.gate.requiredRole.OWNER");
    case GqlRole.Manager:
      return t("adminVotes.form.gate.requiredRole.MANAGER");
    case GqlRole.Member:
    default:
      return t("adminVotes.form.gate.requiredRole.MEMBER");
  }
}
