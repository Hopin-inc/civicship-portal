import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TransactionChainTrail } from "./TransactionChainTrail";
import { GqlGetTransactionDetailQuery, GqlTransactionReason } from "@/types/graphql";

type Chain = NonNullable<NonNullable<GqlGetTransactionDetailQuery["transaction"]>["chain"]>;
type Step = Chain["steps"][number];
type ChainParticipant = NonNullable<Step["from"] | Step["to"]>;

const makeUser = (
  n: number,
  opts: { name?: string; bio?: string | null; image?: string | null } = {},
): ChainParticipant => ({
  __typename: "TransactionChainUser",
  id: `user-${n}`,
  name: opts.name ?? `ユーザー${n}`,
  image: opts.image ?? null,
  bio: opts.bio === undefined ? `コミュニティで活動しているユーザー${n}の自己紹介。` : opts.bio,
});

const makeStep = (
  n: number,
  from: ChainParticipant | null,
  to: ChainParticipant | null,
): Step => ({
  __typename: "TransactionChainStep",
  id: `step-${n}`,
  points: 100,
  reason: GqlTransactionReason.Donation,
  createdAt: new Date(`2026-04-${String(n + 1).padStart(2, "0")}T09:00:00Z`),
  from,
  to,
});

/**
 * userCount 人が並ぶ chain を作る: u0 → u1 → ... → u(N-1)。
 * depth は steps の本数（= userCount - 1）。
 */
const buildMockChain = (
  userCount: number,
  userOpts: Array<{ name?: string; bio?: string | null; image?: string | null }> = [],
): Chain => {
  const users = Array.from({ length: userCount }, (_, i) => makeUser(i, userOpts[i] ?? {}));
  const steps: Step[] = [];
  for (let i = 0; i < users.length - 1; i++) {
    steps.push(makeStep(i, users[i], users[i + 1]));
  }
  return {
    __typename: "TransactionChain",
    depth: users.length - 1,
    steps,
  };
};

const meta: Meta<typeof TransactionChainTrail> = {
  title: "Transactions/TransactionChainTrail",
  component: TransactionChainTrail,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TransactionChainTrail>;

/** depth=4 の典型例。発行者＋間2人＋あなた = 4 ノード、default は先頭と末尾のみ。 */
export const Typical: Story = {
  args: {
    chain: buildMockChain(4, [
      { name: "山田 発行さん" },
      {},
      {},
      { name: "あなた" },
    ]),
  },
};

/** 長い chain: 間 8 人が「もっと見る (8人)」で畳まれる。 */
export const LongChain: Story = {
  args: {
    chain: buildMockChain(10, [
      { name: "発行者" },
      ...Array(8).fill({}),
      { name: "あなた" },
    ]),
  },
};

/** 間が 1 人だけ（depth=2, 3 ノード）: 3 人まるごと縦に表示、展開ボタンなし。 */
export const ThreePeopleInline: Story = {
  args: {
    chain: buildMockChain(3, [
      { name: "発行者" },
      { name: "直前の持ち主" },
      { name: "あなた" },
    ]),
  },
  parameters: {
    docs: {
      description: {
        story: "3 人のときはもっと見るボタンを出さず、間のユーザーも並べて表示する",
      },
    },
  },
};

/** bio なしのユーザー混在。 */
export const WithoutBio: Story = {
  args: {
    chain: buildMockChain(5, [
      { name: "発行者" },
      { bio: null },
      { bio: null },
      { bio: null },
      { name: "あなた" },
    ]),
  },
};

/** 非常に長い bio: line-clamp-2 で切れる。 */
export const LongBio: Story = {
  args: {
    chain: buildMockChain(4, [
      {
        name: "地域運営団体",
        bio: "地域の子供たちに教える活動を続けています。最近は週末にワークショップを開催しており、参加者とともに学び合える時間を大切にしています。今後も地域との繋がりを広げていきたいです。",
      },
      { bio: "エンジニア / デザイナー / コミュニティマネージャー。趣味は写真と登山。" },
      { bio: null },
      { name: "あなた" },
    ]),
  },
};

/** chainDepth > chain.depth の切り詰めケース: 先頭ノードの上に「最初の N 人」プレースホルダが出る。 */
export const TruncatedChain: Story = {
  args: {
    chain: buildMockChain(11, [
      { name: "古い発行者" },
      ...Array(9).fill({}),
      { name: "あなた" },
    ]),
    chainDepth: 19,
  },
  parameters: {
    docs: {
      description: {
        story:
          "chainDepth (= 19) > chain.depth (= 10) のとき、保持上限の外側にいた人数を「最初の N 人」として示す",
      },
    },
  },
};

/** chain が null: 何も描画されない。 */
export const NullChain: Story = {
  args: { chain: null },
};

/** depth=1（単発）: 何も描画されない。 */
export const ShallowChain: Story = {
  args: {
    chain: { __typename: "TransactionChain", depth: 1, steps: [] },
  },
};
