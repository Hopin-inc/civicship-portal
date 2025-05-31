import { GqlOpportunity, GqlPlace } from "@/types/graphql";
import { TArticleWithAuthor } from "@/app/articles/data/type";

// #NOTE 拠点に複数人の案内人の体験が掲載されている場合、意図しない順序で表示されている拠点のID（順序を逆にすることで簡易的に解決する）
// 坂東商店guest room〜藍染めと宿〜 https://www.neo88.app/places/cmahru0gg001vs60nnkqrgugc
// たねのや https://www.neo88.app/places/cmahrua5f001xs60n3vp4csom
const OPPORTUNITY_ORDER_BY_PLACE: Record<string, string[]> = {
  cmahru0gg001vs60nnkqrgugc: ["cmavanchu00a0s60nku50uvrz", "cmaibrt4k000ps60nzbrtikv1"],
  cmahrua5f001xs60n3vp4csom: ["cmap78zrg0029s60nww1mrl37", "cmaiwjrq7000rs60ne9oespcs"],
  // LOCAL mock data
  // cmbar2ver00468ze0bpmsqexi: [
  //   "cmbar2vi300a88ze05mjpi5cn",
  //   "cmbar2vjd00cv8ze0b52illve",
  //   "cmbar2vj400cc8ze0po9o44l8",
  // ],
};

// 鴨島駅 https://www.neo88.app/places/cmavecll700dps60nd5wjpciy
const PRIMARY_ARTICLE_BY_PLACE: Record<string, string> = {
  cmavecll700dps60nd5wjpciy: "cmankc5fq001ks60nh6g1jpvq",
};

export const pickPrimaryArticleByPlaceId = (
  articles: TArticleWithAuthor[],
  placeId: string,
): TArticleWithAuthor => {
  const overrideId = PRIMARY_ARTICLE_BY_PLACE[placeId];

  if (overrideId) {
    const matched = articles.find((a) => a.id === overrideId);
    if (matched) return matched;
  }

  return articles[0];
};

export const orderOpportunities = (
  opportunities: GqlOpportunity[],
  placeId: string,
): GqlOpportunity[] => {
  const order = OPPORTUNITY_ORDER_BY_PLACE[placeId];

  if (!order) {
    return opportunities;
  }

  console.log(`[orderOpportunities] ${placeId}`);
  console.log(
    "  original:",
    opportunities.map((o) => o.id),
  );
  console.log("  definedOrder:", order);

  const sorted = [...opportunities].sort((a, b) => {
    const indexA = order.indexOf(a.id);
    const indexB = order.indexOf(b.id);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  console.log(
    "  sorted:",
    sorted.map((o) => o.id),
  );

  return sorted;
};

export const getPrimaryOpportunity = (place: GqlPlace): GqlOpportunity | undefined => {
  const opportunities = place.opportunities ?? [];
  const preferredOrder = OPPORTUNITY_ORDER_BY_PLACE[place.id];

  if (!preferredOrder) {
    return opportunities[0];
  }

  const found = preferredOrder
    .map((id) => opportunities.find((o) => o.id === id))
    .find((o): o is GqlOpportunity => !!o);

  console.log(`[getPrimaryOpportunity] ${place.id}`);
  console.log("  preferred order:", preferredOrder);
  console.log(
    "  available:",
    opportunities.map((o) => o.id),
  );
  console.log("  selected:", found?.id ?? opportunities[0]?.id);

  return found ?? opportunities[0];
};
