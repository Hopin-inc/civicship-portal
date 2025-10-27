import { redirect } from "next/navigation";

export default async function WalletsRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const queryString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  const redirectUrl = `/wallets/me${queryString ? `?${queryString}` : ""}`;
  
  redirect(redirectUrl);
}
