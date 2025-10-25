import { ActiveOpportunityCardViewModel, SlimOpportunity } from "./types";

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
