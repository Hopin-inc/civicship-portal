"use client";

import { Card, CardHeader } from "@/components/ui/card";
import CredentialHeader from "./components/CredentialHeader";
import Image from "next/image";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { use } from "react";
import { useGetParticipationQuery } from "@/types/graphql";
import CredentialList from "./components/CredentialList";
import NotFound from "@/app/not-found";

export default function CredentialsPage(props: {params: Promise<{id: string}>}) {
    const { id } = use(props.params)
    const { data, loading, error, refetch } = useGetParticipationQuery({
        variables: { id: id },
        skip: !id,
        fetchPolicy: "network-only",
      });
    if(!data) return <NotFound />
  return (
    <>
      <CredentialHeader />
      <div>
        <div className="w-full h-auto mt-4">
        <Image
            src="/images/credentials/organizer-Info-logo.png"
            alt="証明書"
            width={400}
            height={400}
            className="w-full h-auto object-cover border-none shadow-none"
            />
        </div>
        <div className="mt-6 p-4">
            <CredentialList opportunity={data} />
        </div>
      </div>
    </>
  );
}
