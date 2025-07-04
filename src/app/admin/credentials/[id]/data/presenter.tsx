import { GqlVcIssuanceStatus } from "@/types/graphql";
import { ErrorCard, PendingCard } from "../components/StatusCard";

export const renderStatusCard = (status: string) => {
    switch (status) {
      case GqlVcIssuanceStatus.Pending:
        return <PendingCard />;
      case GqlVcIssuanceStatus.Processing:
        return <PendingCard />;
      case GqlVcIssuanceStatus.Failed:
        return <ErrorCard />;
      default:
        return <div></div>;
    }
  }

  export const statusStyle: Record<GqlVcIssuanceStatus, { label: string; className: string }> = {
    [GqlVcIssuanceStatus.Pending]: {
      label: "発行中",
      className: "bg-[#FEF9C3] text-[#A16207]",
    },
    [GqlVcIssuanceStatus.Processing]: {
      label: "発行中",
      className: "bg-[#FEF9C3] text-[#A16207]",
    },
    [GqlVcIssuanceStatus.Failed]: {
      label: "発行失敗",
      className: "bg-[#FEE2E2] text-[#B91C1C]",
    },
    [GqlVcIssuanceStatus.Completed]: {
      label: "発行済み",
      className: "bg-[#DBEAFE] text-[#1D4ED8]",
    },
  };