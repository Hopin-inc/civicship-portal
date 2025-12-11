import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { OpportunityListItem } from "../types/OpportunityListItem";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { OpportunityActionsMenu } from "./OpportunityActionsMenu";

export function OpportunityItem({ opportunity }: { opportunity: OpportunityListItem }) {
  const hasImage = opportunity.images.length > 0;
  const imageUrl = hasImage ? opportunity.images[0] : null;

  return (
    <Item asChild>
      <a href={`/admin/opportunities/${opportunity.id}`} className="flex flex-1 gap-3">
        {/* --- LEFT CONTENT --- */}
        <div className="flex flex-1 flex-col min-w-0">
          <ItemContent>
            {/* タイトル（2行で ...） */}
            <ItemTitle
              className={cn(
                "font-bold text-base leading-snug",
                "line-clamp-2", // ★ 2行制限
              )}
            >
              {opportunity.title}
            </ItemTitle>
          </ItemContent>

          {/* --- FOOTER（公開中・日付） --- */}
          <ItemFooter className="mt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    opportunity.publishStatusLabel === "公開中" ? "bg-green-500" : "bg-gray-400",
                  )}
                />
                {opportunity.publishStatusLabel}・{formatDate(opportunity.updatedAt)}
              </span>
            </div>
          </ItemFooter>
        </div>

        {/* --- RIGHT IMAGE (あれば表示) --- */}
        {hasImage && (
          <div className="shrink-0 w-20 h-14 overflow-hidden rounded-md relative bg-muted">
            <Image src={imageUrl!} alt="" fill className="object-cover" />
          </div>
        )}

        {/* --- ACTIONS (右端の … ) --- */}
        <OpportunityActionsMenu
          status={opportunity.publishStatus}
          onEdit={() => handleEdit(opportunity.id)}
          onBackToDraft={() => handleBackToDraft(opportunity.id)}
          onCopyUrl={() => handleCopyUrl(opportunity.id)}
          onDeleteDraft={() => handleDeleteDraft(opportunity.id)}
        />
      </a>
    </Item>
  );
}

function formatDate(date: string) {
  return date.split("T")[0];
}

function handleEdit(id: string) {
  console.log("編集:", id);
  // 例: 遷移する場合
  // router.push(`/admin/opportunities/${id}/edit`);
}

function handleBackToDraft(id: string) {
  console.log("下書きに戻す:", id);
  // 例:
  // mutateBackToDraft({ id })
}

function handleCopyUrl(id: string) {
  const url = `${window.location.origin}/opportunities/${id}`;
  navigator.clipboard.writeText(url);
  console.log("URLコピー:", url);
}

function handleDeleteDraft(id: string) {
  console.log("下書き削除:", id);
  // 例:
  // mutateDeleteDraft({ id })
}
