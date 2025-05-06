
import React from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { prefectureLabels, prefectureOptions } from '@/utils/userUtils';
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
  socialLinks,
  updating,
  setDisplayName,
  setLocation,
  setBio,
  setSocialLinks,
  handleImageSelect,
  handleSave
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between border-b bg-white z-10">
        <div className="flex items-center">
          <Button onClick={() => router.back()} variant="link" className="mr-4 p-0 h-auto">
            <ChevronLeft />
          </Button>
          <h1 className="text-lg font-semibold">プロフィール編集</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24 max-w-md mx-auto">
        <form onSubmit={handleSave}>
          <div className="mb-8">
            <Label className="block mb-2">
              プロフィール画像
              <span className="text-blue-600 text-sm ml-1">必須</span>
            </Label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {profileImage ? (
                  <Image
                    src={`data:image/jpeg;base64,${profileImage}`}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
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
            <Label className="block mb-2">
              表示名
              <span className="text-blue-600 text-sm ml-1">必須</span>
            </Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="山田太郎"
              required
            />
          </div>

          <div className="mb-8">
            <Label className="block mb-2">
              住んでいるところ
              <span className="text-blue-600 text-sm ml-1">必須</span>
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
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
      </main>
    </div>
  );
};

export default UserProfileEdit;
