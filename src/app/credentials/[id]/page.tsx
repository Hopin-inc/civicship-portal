"use client";

import CredentialHeader from "./components/CredentialHeader";
import { use } from "react";
import { useGetParticipationQuery } from "@/types/graphql";
import CredentialList from "./components/CredentialList";
import NotFound from "@/app/not-found";
import Loading from "@/components/layout/Loading";

export default function CredentialsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const { data, loading } = useGetParticipationQuery({
    variables: { id: id, withDidIssuanceRequests: true },
    skip: !id,
    fetchPolicy: "network-only",
  });
  if (loading) return <Loading />;
  if (!data && !loading) return <NotFound />;
  return (
    <>
      <div>
        <CredentialHeader />
        <CredentialList data={data} />
      </div>
    </>
  );
}
