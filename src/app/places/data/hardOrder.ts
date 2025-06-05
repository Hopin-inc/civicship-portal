import { GqlOpportunity, GqlPlace } from "@/types/graphql";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import clientLogger from "@/lib/logging/client";

// #NOTE 意図しない順序で体験やその画像が表示されている場合に順序を指定して並べるようにする（拠点 ID をキーに、並べたい体験の ID の配列を値に持つ）

const OPPORTUNITY_ORDER_BY_PLACE: Record<string, string[]> = {
  // 坂東商店guest room〜藍染めと宿〜 https://www.neo88.app/places/cmahru0gg001vs60nnkqrgugc
  cmahru0gg001vs60nnkqrgugc: ["cmavanchu00a0s60nku50uvrz", "cmaibrt4k000ps60nzbrtikv1"],
  // たねのや https://www.neo88.app/places/cmahrua5f001xs60n3vp4csom
  cmahrua5f001xs60n3vp4csom: ["cmap78zrg0029s60nww1mrl37", "cmaiwjrq7000rs60ne9oespcs"],
  // 那賀川BLUEBERRY みき農園 https://www.neo88.app/places/cmahpv9ip000hs60n0mpxswx8
  cmahpv9ip000hs60n0mpxswx8: ["cmajqr2uu002ws60nvkfsfl65", "cmajqgnqa002vs60n255j27sp"],
  // LOCAL mock data
  // cmbar2ver00468ze0bpmsqexi: [
  //   "cmbar2vi300a88ze05mjpi5cn",
  //   "cmbar2vjd00cv8ze0b52illve",
  //   "cmbar2vj400cc8ze0po9o44l8",
  // ],
};

const PRIMARY_ARTICLE_BY_PLACE: Record<string, string> = {
  // 鴨島駅 https://www.neo88.app/places/cmavecll700dps60nd5wjpciy
  cmavecll700dps60nd5wjpciy: "cmankc5fq001ks60nh6g1jpvq",
  // 未生流笹岡いけばな教室 https://www.neo88.app/places/cmahuyc2m0046s60ne4o9oyyk
  cmahuyc2m0046s60ne4o9oyyk: "cmarp3k8m0011s60nvx01t3uo",
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

  const sorted = [...opportunities].sort((a, b) => {
    const indexA = order.indexOf(a.id);
    const indexB = order.indexOf(b.id);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

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

  return found ?? opportunities[0];
};
