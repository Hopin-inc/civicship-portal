import { useTicketClaimQuery } from "@/app/(authed)/tickets/receive/hooks/useTicketClaimQuery";
import { useEffect, useState } from "react";
import { GqlClaimLinkStatus } from "@/types/graphql";
import { toast } from "react-toastify";

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
      toast.error("チケット発行中にエラーが発生しました: " + claim.error.message);
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
