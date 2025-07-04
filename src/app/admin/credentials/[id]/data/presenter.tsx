import { GqlVcIssuanceStatus } from "@/types/graphql";
import { ErrorCard, PendingCard } from "../components/StatusCard";

export enum CredentialRole {
    manager = "manager",
    member = "member"
};

export const renderStatusCard = (status: string,role: CredentialRole) => {
    switch (status) {
      case GqlVcIssuanceStatus.Pending:
        return <PendingCard description={getStatusDescription(status,role)} />;
      case GqlVcIssuanceStatus.Processing:
        return <PendingCard description={getStatusDescription(status,role)} />;
      case GqlVcIssuanceStatus.Failed:
        return <ErrorCard description={getStatusDescription(status,role)} />;
      default:
        return <div></div>;
    }
  }
const getStatusDescription = (status: string, role: CredentialRole) => {
  if (role === CredentialRole.manager) {
    switch (status) {
      case GqlVcIssuanceStatus.Pending:
      case GqlVcIssuanceStatus.Processing:
        return "ただいま、証明書を発行中です。準備が整うまで、少しお時間をあけてからもう一度アクセスしてみてください。";
      case GqlVcIssuanceStatus.Failed:
        return "指定されたユーザーに証明書を発行できませんでした。お手数ですが再度ユーザーを確認のうえ、発行をお試しください。";
      case GqlVcIssuanceStatus.Completed:
        return "証明書を発行しました。";
      default:
        return "";
    }
  }else{
    switch (status) {
      case GqlVcIssuanceStatus.Pending:
      case GqlVcIssuanceStatus.Processing:
        return "ただいま、証明書を発行中です。準備が整うまで、少しお時間をあけてからもう一度アクセスしてみてください。";
      case GqlVcIssuanceStatus.Failed:
        return "証明書を発行できませんでした。管理者が再発行するまでお待ち下さい。";
      default:
        return "";
    }
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