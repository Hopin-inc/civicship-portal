"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { GqlCurrentPrefecture } from "@/types/graphql";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

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

const UserProfileEdit: React.FC<UserProfileEditProps> = ({
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
  handleSave,
}) => {
  const t = useTranslations();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <Label className="mb-2 flex items-center gap-x-2">
          {t("users.edit.profileImage")}
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">
            {t("users.edit.required")}
          </span>
        </Label>
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
            {profileImage ? (
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback>{displayName.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
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
            {t("users.edit.selectImage")}
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
        {/* #NOTE: 運営メンバーが本名でないと、誰かが誰かを区別できなくなる可能性があるため本名としているが、NEO88における特殊対応 */}
        <Label className="mb-2 flex items-center gap-x-2">
          {t("users.edit.fullName")}
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">
            {t("users.edit.required")}
          </span>
        </Label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t("users.edit.fullNamePlaceholder")}
          required
        />
        <span className="text-xs text-muted-foreground">
          {t("users.edit.fullNameNote")}
        </span>
      </div>

      {communityConfig?.enableFeatures?.includes("prefectures") && (
        <div>
          <Label className="mb-2 flex items-center gap-x-2">
            {t("users.edit.location")}
            <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">
              {t("users.edit.required")}
            </span>
          </Label>
          <ToggleGroup
            value={location}
            onValueChange={(val) => setLocation(val as GqlCurrentPrefecture)}
            type="single"
            variant="outline"
            className="gap-2"
          >
            <ToggleGroupItem value={GqlCurrentPrefecture.Kagawa} className="flex-1">
              {t("common.prefectures.kagawa")}
            </ToggleGroupItem>
            <ToggleGroupItem value={GqlCurrentPrefecture.Tokushima} className="flex-1">
              {t("common.prefectures.tokushima")}
            </ToggleGroupItem>
            <ToggleGroupItem value={GqlCurrentPrefecture.Ehime} className="flex-1">
              {t("common.prefectures.ehime")}
            </ToggleGroupItem>
            <ToggleGroupItem value={GqlCurrentPrefecture.Kochi} className="flex-1">
              {t("common.prefectures.kochi")}
            </ToggleGroupItem>
            <ToggleGroupItem value={GqlCurrentPrefecture.OutsideShikoku} className="basis-full">
              {t("common.prefectures.outsideShikoku")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <div>
        <Label className="block mb-2">{t("users.edit.bio")}</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("users.edit.bioPlaceholder")}
          className="min-h-[120px]"
        />
      </div>

      <div>
        <Label className="mb-2 block">{t("users.edit.snsLinks")}</Label>
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
          <Label className="mb-2 block">{t("users.edit.phoneNumber")}</Label>
          <span className="text-body-lg mb-2 block">{phone}</span>
          <p className="text-body-sm text-caption">
            {t("users.edit.phoneNumberNote")}
          </p>
        </div>
      )}

      <div className="w-[345px] mx-auto">
        <Button type="submit" variant="primary" className="w-full h-[56px]" disabled={updating}>
          {updating ? t("users.edit.saving") : t("users.edit.save")}
        </Button>
      </div>
    </form>
  );
};

export default UserProfileEdit;
