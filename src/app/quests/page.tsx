import { redirect } from "next/navigation";

export default function QuestsRedirect() {
  redirect("/opportunities?category=QUEST");
}
