"use client";
import { Card, CardHeader } from "@/components/ui/card";
import {
  GqlDidIssuanceRequest,
  GqlVcIssuanceStatus,
  useGetEvaluationsQuery,
} from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import { Copy } from "lucide-react";
import { use, useEffect, useMemo, useRef } from "react";
import { CredentialRole, renderStatusCard, statusStyle } from "./data/presenter";
import { toast } from "sonner";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { InfoCard } from "@/components/shared/InfoCard";
import { InfoCardProps } from "@/types";
import { truncateText } from "@/utils/stringUtils";

// userIdからDIDを取得する関数
function getDidValueByUserId(
  didIssuanceRequests: GqlDidIssuanceRequest[] | undefined,
  userId: string | undefined | null,
): string {
  if (!userId || !didIssuanceRequests) return "";
  return didIssuanceRequests.find((req) => req.status === "COMPLETED")?.didValue ?? "";
}

export default function CredentialsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    data: evaluationsData,
    loading,
    error,
    refetch,
  } = useGetEvaluationsQuery({
    variables: {
      withDidIssuanceRequests: true,
    },
  });
  const headerConfig = useMemo(
    () => ({
      title: "証明書詳細",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const matchedEvaluation = evaluationsData?.evaluations.edges.find((edge) => edge.node?.id === id);
  const opportunitySlot = matchedEvaluation?.node?.participation?.opportunitySlot;
  const opportunity = opportunitySlot?.opportunity;
  const organizer = opportunity?.createdByUser;
  const slotId = opportunitySlot?.id;

  const sameSlotEvaluations =
    evaluationsData?.evaluations.edges.filter(
      (edge) => edge.node?.participation?.opportunitySlot?.id === slotId,
    ) ?? [];

  const organizerId = organizer?.id;
  const organizerDidValue = getDidValueByUserId(organizer?.didIssuanceRequests ?? [], organizerId);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator />;

  if (error) {
    return <ErrorState title="証明書詳細ページを読み込めませんでした" refetchRef={refetchRef} />;
  }

  const infoCards: InfoCardProps[] = [
    {
      label: "主催者",
      value: organizer?.name ?? "",
      secondaryValue: organizerDidValue || "",
      secondaryLabel: "DID",
      showCopy: !!organizerDidValue,
      copyData: organizerDidValue,
      isWarning: !organizerDidValue,
      warningText: "did発行準備中",
    },
    {
      label: "概要",
      value: opportunity?.title ?? "",
      showExternalLink: true,
      externalLink: {
        url: `/activities/${opportunity?.id}?community_id=${opportunity?.community?.id}`,
        text: "詳細を見る"
      }
    },
    {
      label: "開始日時",
      value: formatDateTime(opportunitySlot?.startsAt ?? null, "yyyy年MM月dd日 HH:mm"),
      showTruncate: false,
    },
    {
      label: "終了日時",
      value: formatDateTime(opportunitySlot?.endsAt ?? null, "yyyy年MM月dd日 HH:mm"),
      showTruncate: false,
    },
  ];

  return (
    <div className="p-4 space-y-3 max-w-2xl mx-auto">
      {renderStatusCard(
        matchedEvaluation?.node?.vcIssuanceRequest?.status ?? "PENDING",
        CredentialRole.manager,
      )}

      <div className="space-y-1">
        {infoCards.map((card, index) => (
          <InfoCard key={index} {...card} />
        ))}
      </div>

      {/* 発行先 */}
      <h1 className="text-base font-bold pt-6">証明書の発行先</h1>
      {sameSlotEvaluations.map((evaluation) => {
        const node = evaluation.node;
        const user = node?.vcIssuanceRequest?.user;
        const userId = user?.id;
        const didValue = getDidValueByUserId(
          node?.participation?.user?.didIssuanceRequests ?? [],
          userId,
        );

        const rawStatus = node?.vcIssuanceRequest?.status?.trim();
        const status = Object.values(GqlVcIssuanceStatus).includes(rawStatus as GqlVcIssuanceStatus)
          ? (rawStatus as GqlVcIssuanceStatus)
          : GqlVcIssuanceStatus.Pending;
        const style = statusStyle[status];

        return (
          <Card key={node?.id} className="rounded-2xl border border-zinc-200 bg-card shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-bold">{user?.name}</span>
                  {style && (
                    <span className={`text-xs font-bold rounded-full px-3 py-1 ${style.className}`}>
                      {style.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-zinc-400 text-sm mt-2">
                  {didValue && (
                    <>
                      <Copy
                        className="w-4 h-4 mr-1 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(didValue);
                          toast.success("コピーしました");
                        }}
                      />
                      <span>{truncateText(didValue, 25)}</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
