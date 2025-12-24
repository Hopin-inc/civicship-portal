"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { GqlPublishStatus } from "@/types/graphql";

interface OperationSectionProps {
  requireHostApproval: boolean;
  onRequireHostApprovalChange: (value: boolean) => void;
  publishStatus: GqlPublishStatus;
  onPublishStatusChange: (value: GqlPublishStatus) => void;
}

export function OperationSection({
  requireHostApproval,
  onRequireHostApprovalChange,
  publishStatus,
  onPublishStatusChange,
}: OperationSectionProps) {
  return (
    <ItemGroup className="border rounded-lg">
      <Item size="sm">
        <ItemContent>
          <ItemTitle className="flex items-center font-bold gap-2">運用・公開設定</ItemTitle>
        </ItemContent>
      </Item>

      {/* 承認設定 */}
      <Item size="sm">
        <ItemContent>
          <ItemTitle>承認が必要</ItemTitle>
          <ItemDescription>
            オンにすると、参加者の申込みを主催者が承認するまで確定しません
          </ItemDescription>
        </ItemContent>

        <ItemActions>
          <Switch checked={requireHostApproval} onCheckedChange={onRequireHostApprovalChange} />
        </ItemActions>
      </Item>

      <ItemSeparator />

      {/* 公開設定 */}
      <Item size="sm">
        <ItemContent>
          <ItemTitle>公開設定</ItemTitle>
          <ItemDescription>下書きは主催者と運用担当者のみ閲覧できます</ItemDescription>
        </ItemContent>

        <ItemActions className="min-w-[140px]">
          <Select value={publishStatus} onValueChange={onPublishStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={GqlPublishStatus.Public}>公開</SelectItem>
              <SelectItem value={GqlPublishStatus.Private}>下書き</SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
