export type PortfolioCardViewModel = {
  id: string;
  title: string;
  image: string;
  linkHref: string;
  isPast: boolean;
  isPassed: boolean;
  dateDisplay: string;
  showScheduleBadge: boolean;
  location?: string;
  participants?: Array<{
    id: string;
    name: string;
    image?: string | null;
  }>;
  badge: {
    label: string;
    variantClasses: string;
  } | null;
  showShield: boolean;
};

export type ActiveOpportunityCardViewModel = {
  id: string;
  title: string;
  image?: string;
  href: string;
};
