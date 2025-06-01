import { useTicketClaimQuery } from "@/app/tickets/receive/hooks/useTicketClaimQuery";
import { useEffect, useState } from "react";
import { GqlClaimLinkStatus } from "@/types/graphql";
import { toast } from "sonner";
import { getSimpleErrorMessage } from "@/utils/getErrorMessage";

export const useTicketClaimController = (ticketClaimLinkId: string) => {
  const { view, claim, claimTicket } = useTicketClaimQuery(ticketClaimLinkId);
  const [hasIssued, setHasIssued] = useState(false);

  useEffect(() => {
    const raw = view.data?.ticketClaimLink;
    if (raw) {
      setHasIssued(raw.status !== GqlClaimLinkStatus.Issued);
    }
  }, [view.data]);

  useEffect(() => {
    if (claim.data?.ticketClaim?.tickets?.length) {
      setHasIssued(true);
      toast.success("チケットを獲得しました！");
    }
  }, [claim.data]);

  useEffect(() => {
    if (claim.error) {
      toast.error(getSimpleErrorMessage(claim.error, "チケット発行"));
    }
  }, [claim.error]);

  return {
    hasIssued,
    viewData: view.data,
    viewLoading: view.loading,
    viewError: view.error,
    claimLoading: claim.loading,
    claimTicket,
  };
};
