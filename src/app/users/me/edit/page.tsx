'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Facebook, Instagram, Twitter, ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { CurrentPrefecture } from '@/gql/graphql';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from '@/graphql/queries/user';
import { UPDATE_MY_PROFILE } from '@/graphql/mutations/user';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const prefectureLabels: Record<CurrentPrefecture, string> = {
  [CurrentPrefecture.Kagawa]: '香川県',
  [CurrentPrefecture.Tokushima]: '徳島県',
  [CurrentPrefecture.Kochi]: '高知県',
  [CurrentPrefecture.Ehime]: '愛媛県',
  [CurrentPrefecture.OutsideShikoku]: '四国以外',
  [CurrentPrefecture.Unknown]: '不明',
} as const;

export default function ProfileEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<{ base64: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState<CurrentPrefecture | undefined>();
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });

  const { data: userData, loading: userLoading } = useQuery(GET_USER_PROFILE, {
    variables: { 
      id: user?.id ?? '',
    },
    skip: !user?.id,
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_MY_PROFILE);

  useEffect(() => {
    if (userData?.user) {
      const { user: userDetails } = userData;
      setDisplayName(userDetails.name);
      setProfileImage(userDetails.image ? { base64: userDetails.image } : null);
      setBio(userDetails.bio || '');
      setLocation(userDetails.currentPrefecture || undefined);
      setSocialLinks({
        facebook: userDetails.urlFacebook || '',
        instagram: userDetails.urlInstagram || '',
        twitter: userDetails.urlX || '',
      });
    }
  }, [userData]);

  const prefectures = [
    CurrentPrefecture.Kagawa,
    CurrentPrefecture.Tokushima,
    CurrentPrefecture.Kochi,
    CurrentPrefecture.Ehime,
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        setProfileImage({ base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error('居住地を選択してください');
      return;
    }

    try {
      await updateProfile({
        variables: {
          input: {
            name: displayName,
            image: profileImage,
            bio,
            currentPrefecture: location,
            urlFacebook: socialLinks.facebook,
            urlInstagram: socialLinks.instagram,
            urlX: socialLinks.twitter,
            slug: displayName.toLowerCase().replace(/\s+/g, '-'),
          },
          permission: {
            userId: user?.id ?? ''
          }
        },
      });
      toast.success('プロフィールを更新しました');
      router.push(`/users/${user?.id}`);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('プロフィールの更新に失敗しました');
    }
  };

  if (userLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between border-b bg-white z-10">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ChevronLeft />
          </button>
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
                    src={`data:image/jpeg;base64,${profileImage.base64}`} 
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
              {prefectures.map((prefecture) => (
                <button
                  key={prefecture}
                  type="button"
                  onClick={() => setLocation(prefecture)}
                  className={`px-4 py-2 rounded-2xl border-2 ${
                    location === prefecture
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {prefectureLabels[prefecture]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLocation(CurrentPrefecture.OutsideShikoku)}
              className={`w-full px-4 py-2 rounded-2xl border-2 ${
                location === CurrentPrefecture.OutsideShikoku
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {prefectureLabels[CurrentPrefecture.OutsideShikoku]}
            </button>
          </div>

          <div className="mb-8">
            <Label className="block mb-2">自己紹介</Label>
            <Textarea
              value={bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
              placeholder="自己紹介を入力しましょう"
              className="min-h-[120px]"
            />
          </div>

          <div className="mb-8">
            <Label className="block mb-2">SNSリンク</Label>
            <div className="space-y-4">
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="https://"
                  type="url"
                  className="pl-11"
                />
              </div>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="https://"
                  type="url"
                  className="pl-11"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="https://"
                  type="url"
                  className="pl-11"
                />
              </div>
            </div>
          </div>

          <div className="w-[345px] mx-auto mb-8">
            <Button 
              type="submit" 
              className="w-full h-[56px] bg-blue-600 text-white hover:bg-blue-700"
              disabled={updating}
            >
              {updating ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
