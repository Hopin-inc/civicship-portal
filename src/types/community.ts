import { Opportunity } from "@/types/index";

export type AppCommunity = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  location: {
    prefecture: string;
    city: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  members: {
    id: string;
    name: string;
    title: string;
    bio?: string;
    image?: string;
  }[];
  socialLinks?: {
    type: "twitter" | "instagram" | "facebook" | "website" | "youtube";
    url: string;
  }[];
  customLinks?: {
    title: string;
    url: string;
  }[];
  speakerDeckEmbed?: {
    title: string;
    embedUrl: string;
  };
  opportunities: Opportunity[];
  createdAt: Date;
  updatedAt: Date;
};