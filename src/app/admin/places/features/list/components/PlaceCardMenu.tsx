"use client";

import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { usePlaceDeleteMutation } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface PlaceCardMenuProps {
  placeId: string;
  placeName: string;
  onDelete?: () => void;
}

export function PlaceCardMenu({ placeId, placeName, onDelete }: PlaceCardMenuProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePlace] = usePlaceDeleteMutation();

  const handleEdit = () => {
    router.push(`/admin/places/${placeId}`);
  };

  const handleDelete = async () => {
    if (!confirm(`「${placeName}」を削除してもよろしいですか？\n\nこの操作は取り消せません。`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePlace({
        variables: {
          id: placeId,
          permission: { communityId: COMMUNITY_ID },
        },
      });
      toast.success("場所を削除しました");
      onDelete?.();
    } catch (error) {
      console.error("Place delete failed:", error);
      toast.error("場所の削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          編集
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-error">
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "削除中..." : "削除"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
