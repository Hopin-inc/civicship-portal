
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { prefectureLabels, prefectureOptions } from '@/app/users/data/presenter';
import { GqlCurrentPrefecture } from '@/types/graphql';

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
  // socialLinks,
  updating,
  setDisplayName,
  setLocation,
  setBio,
  // setSocialLinks,
  handleImageSelect,
  handleSave
}) => {
  return (
    <form onSubmit={handleSave}>
      <div className="mb-8">
        <Label className="mb-2 flex items-center gap-x-2">
          プロフィール画像
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">必須</span>
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
            variant="secondary"
            onClick={() => document.getElementById('profile-image-input')?.click()}
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

      <div className="mb-8">
        <Label className="mb-2 flex items-center gap-x-2">
          表示名
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">必須</span>
        </Label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="山田太郎"
          required
        />
      </div>

      <div className="mb-8">
        <Label className="mb-2 flex items-center gap-x-2">
          住んでいるところ
          <span className="text-primary text-label-xs font-bold bg-primary-foreground px-1 py-1 rounded-md">必須</span>
        </Label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {prefectureOptions.map((prefecture) => (
            <Button
              key={prefecture}
              type="button"
              onClick={() => setLocation(prefecture)}
              variant={location === prefecture ? "primary" : "tertiary"}
              className={`px-4 py-2 rounded-2xl border-2 ${
                location === prefecture
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-input hover:border-input/80 hover:bg-muted'
              }`}
            >
              {prefectureLabels[prefecture]}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => setLocation(GqlCurrentPrefecture.OutsideShikoku)}
          variant={location === GqlCurrentPrefecture.OutsideShikoku ? "primary" : "tertiary"}
          className={`w-full px-4 py-2 rounded-2xl border-2 ${
            location === GqlCurrentPrefecture.OutsideShikoku
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-input hover:border-input/80 hover:bg-muted'
          }`}
        >
          {prefectureLabels[GqlCurrentPrefecture.OutsideShikoku]}
        </Button>
      </div>

      <div className="mb-8">
        <Label className="block mb-2">自己紹介</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="自己紹介を入力しましょう"
          className="min-h-[120px]"
        />
      </div>

      <div className="w-[345px] mx-auto mb-8">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={updating}
        >
          {updating ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  );
};

export default UserProfileEdit;
