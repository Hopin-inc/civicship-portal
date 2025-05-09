import { GqlPortfolioCategory, GqlPortfolioSource, GqlReservationStatus } from "@/types/graphql";
import { AppUser } from "@/types/user";

export interface Portfolio {
  id: string;
  category: GqlPortfolioCategory;
  reservationStatus?: GqlReservationStatus | null;
  image: string | null;
  title: string;
  date: string;
  location: string | null;
  source: GqlPortfolioSource;
  participants: AppUser[];
}