import { redirect } from "next/navigation";

export default function ActivitiesRedirect() {
  redirect("/opportunities?category=ACTIVITY");
}
