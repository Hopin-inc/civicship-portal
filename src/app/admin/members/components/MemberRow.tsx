import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GqlRole, GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

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
}

export const MemberRow = ({ user, role, currentUserRole, onRoleChange }: Props) => (
  <div className="flex justify-between items-center rounded px-4 py-2">
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.image ?? PLACEHOLDER_IMAGE} alt={user.name ?? "要確認"} />
        <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[160px] overflow-hidden">
        <span className="text-body-sm font-bold truncate">{user.name}</span>
        <span className="text-muted-foreground text-label-xs">
          {roleLabels[role] ?? "権限を変更"}
        </span>
      </div>
    </div>
    <div className="w-[140px]">
      <Select
        disabled={currentUserRole !== GqlRole.Owner}
        onValueChange={(value) => onRoleChange(value as GqlRole)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={roleLabels[role] ?? "権限を変更"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(roleLabels).map(([val, label]) => (
            <SelectItem key={val} value={val}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);
