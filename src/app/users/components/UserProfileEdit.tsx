import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { GqlCurrentPrefecture } from '@/types/graphql';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface UserProfileEditProps {
  profileImage: string | null;
  displayName: string;
  location: GqlCurrentPrefecture | undefined;
  bio: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  phone: string | undefined;
  updating: boolean;
  setDisplayName: (name: string) => void;
  setLocation: (location: GqlCurrentPrefecture) => void;
  setBio: (bio: string) => void;
  setSocialLinks: (links: { facebook: string; instagram: string; twitter: string }) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

export const UserProfileEdit: React.FC<UserProfileEditProps> = ({
  profileImage,
  displayName,
  location,
  bio,
  socialLinks,
  phone,
  updating,
  setDisplayName,
  setLocation,
  setBio,
  setSocialLinks,
  handleImageSelect,
  handleSave
}) => {
  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          プロフィール画像
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">
            必須
          </span>
        </Label>
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
            {profileImage ? (
              <Image
                src={`data:image/jpeg;base64,${profileImage}`}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => document.getElementById("profile-image-input")?.click()}
            className="h-10"
          >
            画像を選択
          </Button>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          表示名
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">
            必須
          </span>
        </Label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="山田太郎"
          required
        />
      </div>

          <div>
            <Label className="mb-2 flex items-center gap-x-2">
              住んでいるところ
              <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">
                必須
              </span>
            </Label>
            <ToggleGroup onValueChange={ (val) => setLocation(val as GqlCurrentPrefecture) } type="single"
                         variant="outline" className="gap-2">
              <ToggleGroupItem value={ GqlCurrentPrefecture.Kagawa }
                               className="flex-1">香川県</ToggleGroupItem>
              <ToggleGroupItem value={ GqlCurrentPrefecture.Tokushima }
                               className="flex-1">徳島県</ToggleGroupItem>
              <ToggleGroupItem value={ GqlCurrentPrefecture.Ehime }
                               className="flex-1">愛媛県</ToggleGroupItem>
              <ToggleGroupItem value={ GqlCurrentPrefecture.Kochi }
                               className="flex-1">高知県</ToggleGroupItem>
              <ToggleGroupItem value={ GqlCurrentPrefecture.OutsideShikoku }
                               className="basis-full">四国以外</ToggleGroupItem>
            </ToggleGroup>
          </div>

      <div>
        <Label className="block mb-2">自己紹介</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹介を入力しましょう"
          className="min-h-[120px]"
        />
      </div>

      <div>
        <Label className="mb-2 block">SNSリンク</Label>
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Facebook className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="pl-9"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Instagram className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="pl-9"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Twitter className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              placeholder="https://x.com/..."
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {phone && (
        <div>
          <Label className="mb-2 block">電話番号</Label>
          <span className="text-body-lg mb-2 block">{phone}</span>
          <p className="text-body-sm text-caption">
            電話番号は、予約時の緊急連絡先として案内人に共有されます。一般には公開されません。
          </p>
        </div>
      )}

      <div className="w-[345px] mx-auto">
        <Button type="submit" variant="primary" className="w-full h-[56px]" disabled={updating}>
          {updating ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
};

export default UserProfileEdit;
