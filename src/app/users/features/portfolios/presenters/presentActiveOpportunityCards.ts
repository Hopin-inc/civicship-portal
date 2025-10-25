import { ActiveOpportunityCardViewModel, OpportunitySummary } from "./viewModels";

export function presentActiveOpportunityCards(
  opportunities: OpportunitySummary[],
): ActiveOpportunityCardViewModel[] {
  return opportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    image: opp.images?.[0],
    href: `/opportunities/${opp.id}`,
  }));
}
