import { GqlRole, GqlUser } from "@/types/graphql";
import { PresentedMember } from "./types";

const ROLE_LABEL_MAP: Record<GqlRole, string> = {
  OWNER: "管理者",
  MANAGER: "運用担当者",
  MEMBER: "参加者",
};

function formatPoints(points?: bigint | null): string {
  // null/undefined = データ未取得
  if (points == null) return "—";

  // 0 = 明確にゼロポイント
  if (points === 0n) return "0pt";

  return `${points.toLocaleString()}pt`;
}

export function presentMember(user: any): PresentedMember {
  return {
    id: user.id,
    name: user.name ?? "未設定",
    image: user.image ?? null,
    roleLabel: ROLE_LABEL_MAP[user.role as GqlRole] ?? "—",
    roleValue: user.role,
    pointsLabel: formatPoints(user.wallet?.currentPointView?.currentPoint),
  };
}
