import { User } from "@/gql/graphql";
import { Required } from "utility-types";

export type AuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: Required<Partial<User>, "id" | "lastName" | "firstName"> | null;
};

export type User = {
  id: string;
  name: string;
  image?: string | null;
  bio?: string | null;
  sysRole?: string | null;
  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlWebsite?: string | null;
  urlX?: string | null;
  urlYoutube?: string | null;
};

export type SocialLinkType = 'x' | 'instagram' | 'facebook' | 'youtube' | 'website';

export type SocialLink = {
  type: SocialLinkType;
  url: string;
};
