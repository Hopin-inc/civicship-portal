import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { User } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (socialLinks: User["socialLinks"]) => void;
};

type SocialLinkType = "twitter" | "instagram" | "facebook" | "line" | "website";

const SOCIAL_LINK_TYPES: { value: SocialLinkType; label: string }[] = [
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "line", label: "LINE" },
  { value: "website", label: "Website" },
];

export const UserSocialLinksEditModal = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}: Props) => {
  const [socialLinks, setSocialLinks] = useState<
    NonNullable<User["socialLinks"]>
  >(user.socialLinks ?? []);
  const [newLinkType, setNewLinkType] = useState<SocialLinkType | "">("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleAddLink = () => {
    if (!newLinkType || !newLinkUrl) return;

    setSocialLinks([
      ...socialLinks,
      { type: newLinkType as SocialLinkType, url: newLinkUrl },
    ]);
    setNewLinkType("");
    setNewLinkUrl("");
  };

  const handleRemoveLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdate(socialLinks.length > 0 ? socialLinks : undefined);
    onClose();
  };

  const availableLinkTypes = SOCIAL_LINK_TYPES.filter(
    (type) => !socialLinks.some((link) => link.type === type.value)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ソーシャルリンクを編集</DialogTitle>
          <DialogDescription>
            プロフィールに表示するソーシャルリンクを設定します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* 既存のリンク */}
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm font-medium w-24">
                    {
                      SOCIAL_LINK_TYPES.find((t) => t.value === link.type)
                        ?.label
                    }
                  </span>
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...socialLinks];
                      newLinks[index].url = e.target.value;
                      setSocialLinks(newLinks);
                    }}
                    placeholder="URLを入力"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLink(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* 新規リンクの追加 */}
          {availableLinkTypes.length > 0 && (
            <div className="space-y-4">
              <div className="h-px bg-border" />
              <Label>新規リンクを追加</Label>
              <div className="flex items-end gap-4">
                <div className="space-y-2">
                  <select
                    value={newLinkType}
                    onChange={(e) =>
                      setNewLinkType(e.target.value as SocialLinkType)
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">SNSを選択</option>
                    {availableLinkTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="URLを入力"
                  />
                </div>
                <Button
                  onClick={handleAddLink}
                  disabled={!newLinkType || !newLinkUrl}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
