import Image from "next/image";
import { GqlRole, GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const roleLabels: Record<GqlRole, string> = {
  OWNER: "管理者",
  MANAGER: "運用担当者",
  MEMBER: "参加者",
};

interface Props {
  user: GqlUser;
  role: GqlRole;
  currentUserRole?: GqlRole;
  onRoleChange: (newRole: GqlRole) => void;
  checked: boolean;
  onCheck: () => void;
}

export const MemberRow = ({ user, role, currentUserRole, checked, onCheck }: Props) => (
  <div className="flex justify-between items-center rounded px-4 py-2">
    <div className="flex items-center gap-3">
        <Input
            type="radio"
            checked={checked}
            onChange={onCheck}
            className="w-4 h-4"
            name="user-select" // 複数のラジオボタンをグループ化
        />
      <Image
        src={user.image ?? PLACEHOLDER_IMAGE}
        alt={user.name ?? "要確認"}
        width={40}
        height={40}
        className="rounded-full object-cover border"
        style={{ aspectRatio: "1 / 1" }}
      />
      <div className="flex flex-col max-w-[160px] overflow-hidden">
        <span className="text-body-sm font-bold truncate">{user.name}</span>
      </div>
    </div>
  </div>
);
