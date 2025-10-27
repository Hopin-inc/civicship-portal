import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function WalletsRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  const queryString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  const redirectUrl = `/wallets/me${queryString ? `?${queryString}` : ""}`;
  
  redirect(redirectUrl);
}
