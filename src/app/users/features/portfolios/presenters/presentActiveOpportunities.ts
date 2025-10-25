import { ActiveOpportunityCardViewModel } from "./types";

type SlimOpportunity = {
  id: string;
  title: string;
  images?: string[];
};

export function presentActiveOpportunities(
  opportunities: SlimOpportunity[],
): ActiveOpportunityCardViewModel[] {
  return opportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    image: opp.images?.[0],
    href: `/opportunities/${opp.id}`,
  }));
}
