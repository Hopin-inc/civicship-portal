import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TransactionChainTrail } from "./TransactionChainTrail";
import { GqlGetTransactionDetailQuery, GqlTransactionReason } from "@/types/graphql";

type Chain = NonNullable<NonNullable<GqlGetTransactionDetailQuery["transaction"]>["chain"]>;
type Step = Chain["steps"][number];
type ChainUser = NonNullable<Step["fromUser"] | Step["toUser"]>;

const makeUser = (n: number, opts: { bio?: string | null; image?: string | null } = {}): ChainUser => ({
  __typename: "TransactionChainUser",
  id: `user-${n}`,
  name: `ユーザー${n}`,
  image: opts.image ?? null,
  bio: opts.bio ?? `コミュニティで活動しているユーザー${n}の自己紹介です。`,
});

const makeStep = (n: number, from: ChainUser | null, to: ChainUser | null): Step => ({
  __typename: "TransactionChainStep",
  id: `step-${n}`,
  points: 100,
  reason: GqlTransactionReason.Donation,
  createdAt: new Date(`2026-04-${String(n + 1).padStart(2, "0")}T09:00:00Z`),
  fromUser: from,
  toUser: to,
});

/**
 * 5 ノードの chain を作る: u0 → u1 → u2 → u3 → u4（4 ステップ、depth=5）。
 * 末端 u0 と u4 を excludeUserIds に渡せば、中間 u1, u2, u3 の 3 件が表示される。
 */
const buildMockChain = (
  userCount: number,
  userOpts: Array<{ bio?: string | null; image?: string | null }> = [],
): Chain => {
  const users = Array.from({ length: userCount }, (_, i) => makeUser(i, userOpts[i] ?? {}));
  const steps: Step[] = [];
  for (let i = 0; i < users.length - 1; i++) {
    steps.push(makeStep(i, users[i], users[i + 1]));
  }
  return {
    __typename: "TransactionChain",
    depth: userCount,
    steps,
  };
};

const meta: Meta<typeof TransactionChainTrail> = {
  title: "Transactions/TransactionChainTrail",
  component: TransactionChainTrail,
  parameters: {
    layout: "padded",
  },
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

/** 一般的な depth=5 のケース: 先頭・末尾を除外して中間 3 件表示。 */
export const Typical: Story = {
  args: {
    chain: buildMockChain(5),
    excludeUserIds: ["user-0", "user-4"],
  },
};

/** depth=10 のフルケース。excludeUserIds 後 8 件になり「もっと見る (5)」が出る。 */
export const LongChainWithExpand: Story = {
  args: {
    chain: buildMockChain(10),
    excludeUserIds: ["user-0", "user-9"],
  },
  parameters: {
    docs: { description: { story: "デフォルト 3 件表示＋「もっと見る」で残り展開" } },
  },
};

/** bio を持たないユーザー混在ケース。 */
export const WithoutBio: Story = {
  args: {
    chain: buildMockChain(5, [
      {},
      { bio: null },
      { bio: null },
      { bio: null },
      {},
    ]),
    excludeUserIds: ["user-0", "user-4"],
  },
};

/** 非常に長い bio: line-clamp-2 で切れるはず。 */
export const LongBio: Story = {
  args: {
    chain: buildMockChain(4, [
      {},
      {
        bio: "地域の子供たちに教える活動を続けています。最近は週末にワークショップを開催しており、参加者とともに学び合える時間を大切にしています。今後も地域との繋がりを広げていきたいです。",
      },
      {
        bio: "エンジニア / デザイナー / コミュニティマネージャー。趣味は写真と登山。",
      },
      {},
    ]),
    excludeUserIds: ["user-0", "user-3"],
  },
};

/** 1 人だけ残るケース（depth=3, 中間 1 人）。 */
export const SingleIntermediate: Story = {
  args: {
    chain: buildMockChain(3),
    excludeUserIds: ["user-0", "user-2"],
  },
};

/** chain が null のとき: 何も描画されない。 */
export const NullChain: Story = {
  args: {
    chain: null,
  },
  parameters: {
    docs: { description: { story: "chain が null のときは何も描画しない" } },
  },
};

/** depth=1（単発）: 何も描画されない。 */
export const ShallowChain: Story = {
  args: {
    chain: {
      __typename: "TransactionChain",
      depth: 1,
      steps: [],
    },
  },
  parameters: {
    docs: { description: { story: "depth < 2 のときは何も描画しない" } },
  },
};

/** 除外後にノードが 0 になるケース（depth=2 で両端とも excludeUserIds にある）。 */
export const AllExcluded: Story = {
  args: {
    chain: buildMockChain(2),
    excludeUserIds: ["user-0", "user-1"],
  },
  parameters: {
    docs: { description: { story: "除外後にノードが残らない場合は何も描画しない" } },
  },
};
