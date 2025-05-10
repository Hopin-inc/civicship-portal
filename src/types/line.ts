export type LIFFLoginResponse = {
  customToken: string;
  profile: LINEProfile;
};

type LINEProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  email?: string;
  language?: string;
};

