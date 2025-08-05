import {
  GqlDidIssuanceStatus,
  GqlGetParticipationQuery,
  GqlGetVcIssuanceRequestByEvaluationQuery,
} from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import Image from "next/image";
import { CredentialRole, renderStatusCard } from "@/app/admin/credentials/[id]/data/presenter";
import { getLogoPath } from "@/lib/communities/metadata";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import React, { useEffect, useRef } from "react";
import ErrorState from "@/components/shared/ErrorState";
import { ApolloError } from "@apollo/client";
import { InfoCard } from "@/components/shared/InfoCard";
import { InfoCardProps } from "@/types";

interface OpportunityListProps {
  vcData: GqlGetVcIssuanceRequestByEvaluationQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  data: GqlGetParticipationQuery | undefined;
}

export default function CredentialList(props: OpportunityListProps) {
  const { vcData, loading, error, refetch, data } = props;

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator />;

  if (error) {
    return <ErrorState title={"証明書を読み込めませんでした"} refetchRef={refetchRef} />;
  }

  const organizerDid =
    data?.participation?.opportunitySlot?.opportunity?.createdByUser?.didIssuanceRequests?.find(
      (req) => req?.status === GqlDidIssuanceStatus.Completed,
    )?.didValue;
  const participantDid =
    data?.participation?.evaluation?.participation?.user?.didIssuanceRequests?.find(
      (req) => req?.status === GqlDidIssuanceStatus.Completed,
    )?.didValue;

  const logoPath = getLogoPath();

  const infoCards: InfoCardProps[] = [
    {
      label: "主催者",
      value: data?.participation?.opportunitySlot?.opportunity?.createdByUser?.name ?? "",
      secondaryValue: organizerDid ?? "",
      secondaryLabel: "DID",
      showCopy: !!organizerDid,
      copyData: organizerDid ?? "",
      isWarning: !organizerDid,
      warningText: "did発行準備中",
      truncatePattern: "middle",
    },
    {
      label: "概要",
      value: data?.participation?.opportunitySlot?.opportunity?.title ?? "",
      showExternalLink: true,
      externalLink: {
        url: `/activities/${data?.participation?.opportunitySlot?.opportunity?.id}?community_id=${data?.participation?.opportunitySlot?.opportunity?.community?.id}`,
        text: "詳細を見る"
      },
    },
    {
      label: "参加者",
      value: data?.participation?.user?.name ?? "",
      secondaryValue: participantDid ?? "",
      secondaryLabel: "DID",
      showCopy: !!participantDid,
      copyData: participantDid ?? "",
      isWarning: !participantDid,
      warningText: "did発行準備中",
      truncatePattern: "middle",
    },
    {
      label: "開始日時",
      value: formatDateTime(
        data?.participation?.opportunitySlot?.startsAt ?? new Date(),
        "yyyy年MM月dd日 HH:mm",
      ),
      showTruncate: false,
    },
    {
      label: "終了日時",
      value: formatDateTime(
        data?.participation?.opportunitySlot?.endsAt ?? new Date(),
        "yyyy年MM月dd日 HH:mm",
      ),
      showTruncate: false,
    },
  ];

  return (
    <>
      <div className="w-full h-auto mt-4">
        <div className="flex justify-center mt-6">
          {renderStatusCard(
            vcData?.vcIssuanceRequests.edges[0]?.node?.status ?? "PENDING",
            CredentialRole.member,
          )}
        </div>
        <div className="flex justify-center mt-6">
          <Image
            src={logoPath}
            alt="証明書"
            width={240}
            height={100}
            className="object-contain border-none shadow-none"
          />
        </div>
      </div>
      <div className="mt-6 p-4">
        <div className="grid grid-cols-1 gap-1 relative">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
          {vcData?.vcIssuanceRequests.edges[0]?.node?.completedAt && (
            <div className="text-gray-400 text-sm text-right mt-4">
              発行日{" "}
              {formatDateTime(
                vcData?.vcIssuanceRequests.edges[0]?.node?.completedAt,
                "yyyy年M月d日",
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
