import {
  GqlOpportunity,
  GqlOpportunitySlotHostingStatus,
  GqlReservation,
  useOpportunitySlotSetHostingStatusMutation,
} from "@/types/graphql";
import { toast } from "react-toastify";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

type UseCancelSlotOptions = {
  onCompleted?: () => void;
  onError?: () => void;
};

export const useCancelSlot = (
  reservation: GqlReservation | null | undefined,
  opportunity: GqlOpportunity | null | undefined,
  comment: string | null,
  options: {
    onCompleted?: () => void;
    onError?: () => void;
  } = {},
) => {
  const track = useAnalytics();

  const [cancelSlotMutation, { loading }] = useOpportunitySlotSetHostingStatusMutation({
    onCompleted: () => {
      toast.success("開催を中止しました");
      options.onCompleted?.();
    },
    onError: () => {
      toast.error("中止に失敗しました");
      options.onError?.();
    },
  });

  const handleCancel = async () => {
    const slotId = reservation?.opportunitySlot?.id ?? "";
    const opportunityId = opportunity?.id ?? "";
    const communityId = opportunity?.community?.id || COMMUNITY_ID;

    await cancelSlotMutation({
      variables: {
        id: slotId,
        input: { status: GqlOpportunitySlotHostingStatus.Cancelled, comment: comment ?? undefined },
        permission: { opportunityId, communityId },
      },
    });

    track({
      name: "cancel_slot",
      params: {
        slotId,
        opportunityId,
        opportunityTitle: opportunity?.title ?? "",
        category: opportunity?.category ?? "",
      },
    });
  };

  return { handleCancel, loading };
};
