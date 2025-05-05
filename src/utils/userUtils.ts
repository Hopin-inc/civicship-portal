import { GqlCurrentPrefecture } from '@/types/graphql';

export const prefectureLabels: Record<GqlCurrentPrefecture, string> = {
  [GqlCurrentPrefecture.Kagawa]: '香川県',
  [GqlCurrentPrefecture.Tokushima]: '徳島県',
  [GqlCurrentPrefecture.Kochi]: '高知県',
  [GqlCurrentPrefecture.Ehime]: '愛媛県',
  [GqlCurrentPrefecture.OutsideShikoku]: '四国以外',
  [GqlCurrentPrefecture.Unknown]: '不明',
} as const;

export const prefectureOptions = [
  GqlCurrentPrefecture.Kagawa,
  GqlCurrentPrefecture.Tokushima,
  GqlCurrentPrefecture.Kochi,
  GqlCurrentPrefecture.Ehime,
];

export const formatUserProfileData = (userData: any) => {
  if (!userData?.user) return null;
  
  const { user } = userData;
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    bio: user.bio || '',
    currentPrefecture: user.currentPrefecture,
    socialLinks: [
      { type: 'facebook', url: user.urlFacebook || null },
      { type: 'instagram', url: user.urlInstagram || null },
      { type: 'x', url: user.urlX || null },
      { type: 'youtube', url: user.urlYoutube || null },
      { type: 'website', url: user.urlWebsite || null }
    ]
  };
};
