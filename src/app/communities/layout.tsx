import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import { fetchPrivateUserServer } from "@/app/community/[communityId]/users/features/shared/server/fetchPrivateUserServer";
import { GqlSysRole } from "@/types/graphql";

export default async function CommunitiesLayout({ children }: { children: ReactNode }) {
  const user = await fetchPrivateUserServer();

  if (!user || user.sysRole !== GqlSysRole.SysAdmin) {
    notFound();
  }

  return (
    <ApolloProvider>
      {children}
      <Toaster />
    </ApolloProvider>
  );
}
