import { CurrentPrefecture } from '@/gql/graphql';

export const prefectureLabels: Record<CurrentPrefecture, string> = {
  [CurrentPrefecture.Kagawa]: '香川県',
  [CurrentPrefecture.Tokushima]: '徳島県',
  [CurrentPrefecture.Kochi]: '高知県',
  [CurrentPrefecture.Ehime]: '愛媛県',
  [CurrentPrefecture.OutsideShikoku]: '四国以外',
  [CurrentPrefecture.Unknown]: '不明',
} as const;

export const prefectureOptions = [
  CurrentPrefecture.Kagawa,
  CurrentPrefecture.Tokushima,
  CurrentPrefecture.Kochi,
  CurrentPrefecture.Ehime,
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
    socialLinks: {
      facebook: user.urlFacebook || '',
      instagram: user.urlInstagram || '',
      twitter: user.urlX || '',
    }
  };
};
