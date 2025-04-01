import {
  type Community,
  type Opportunity,
  Activity,
  Article,
  User,
} from "@/types";

export const CURRENT_USER = {
  id: "user1",
  name: "山田美咲",
  image:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fotor%20AI%20Image%20Creator%20Nov%2030%20(3).jpg-v7ifi1e9jgGZ756DbfeIZ8sO5wzaqA.jpeg",
};

export const CURRENT_COMMUNITY = {
  id: "shodoshima-olive",
  name: "小豆島オリーブ",
  image:
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
};

const ACTIVITY_IMAGES = {
  OLIVE:
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  BBQ: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  PROGRAMMING:
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  ART: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  FOOD: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  SAUNA:
    "https://images.unsplash.com/photo-1584184924103-e310d9dc82fc?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  RENOVATION:
    "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  COMMUNITY:
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
  DEFAULT:
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
} as const;

export const mockInvitationOpportunities: Opportunity[] = [
  {
    id: "bbq-1",
    title: "小豆島おもてなしBBQ",
    description:
      "これまで小豆島の地域活性化に関わってくださった皆様への感謝の気持ちを込めて、特別なBBQイベントを開催します！\n\n地元の新鮮な食材や、遊休資産として眠っていた食器や調理器具を活用し、みんなでわいわい楽しみながら、これからの小豆島の可能性について語り合いましょう。\n\n当日は、オリーブオイルを使った調理法のミニワークショップも予定しています。地域資源の新しい活用方法のアイデアも、食事を楽しみながら自由に出し合えればと思います。",
    type: "EVENT",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    startsAt: "2025-02-15T10:00:00.000Z",
    endsAt: "2025-02-15T15:00:00.000Z",
    location: {
      name: "小豆島オリーブ公園",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    host: {
      name: "山田太郎",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host1",
      title: "地域活性化コンサルタント",
      bio: "10年以上にわたり、全国各地の地域活性化プロジェクトに携わってきました。小豆島の魅力を最大限に引き出すため、地域の方々と一緒に様々なプロジェクトを推進しています。",
    },
    capacity: 15,
    pointsForJoin: 1000,
    pointsForComplete: 0,
    participants: [],
    image: ACTIVITY_IMAGES.BBQ,
    images: [
      {
        url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=80",
        caption: "BBQの様子",
      },
      {
        url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
        caption: "地元の新鮮な食材",
      },
      {
        url: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブオイルを使った料理",
      },
      {
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80",
        caption: "コミュニティの交流",
      },
      {
        url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&auto=format&fit=crop&q=80",
        caption: "小豆島の風景",
      },
    ],
    recommendedFor: [
      "小豆島の地域活性化に関わったことのある方",
      "地域資源の新しい活用方法に興味がある方",
      "食を通じたコミュニティづくりに関心のある方",
      "これまでの活動の振り返りと、新しいアイデアの共有に興味がある方",
    ],
  },
] as const;

export const mockOpportunities: Opportunity[] = [
  {
    id: "shodoshima-olive-quest-1",
    title: "冬のオリーブ畑メンテナンス",
    description:
      "冬季に必要なオリーブ畑の整備作業を行います。防寒対策や土壌管理など、寒い時期特有の管理方法を学べます。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 450,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    startsAt: "2025-01-25T01:00:00.000Z",
    endsAt: "2025-01-25T04:00:00.000Z",
    location: {
      name: "小豆島オリーブ農園",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [CURRENT_USER],
    images: [
      {
        url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&auto=format&fit=crop&q=80",
        caption: "冬季メンテナンス作業の様子",
      },
      {
        url: "https://images.unsplash.com/photo-1592332280537-70d3142bd01a?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブの木の剪定",
      },
      {
        url: "https://images.unsplash.com/photo-1615370183635-de8ff3c3f91b?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブオイルの品質チェック",
      },
      {
        url: "https://images.unsplash.com/photo-1632662057933-455667f03888?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブの収穫",
      },
      {
        url: "https://images.unsplash.com/photo-1600326145552-327c61f3ae35?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブオイルの瓶詰め作業",
      },
    ],
    host: {
      name: "山本農園主",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host9",
      title: "オリーブ農家",
      bio: "40年以上オリーブ栽培に携わり、若手農家の育成にも力を入れています。",
    },
    capacity: 8,
    recommendedFor: [
      "農業に興味がある方",
      "オリーブの栽培管理を学びたい方",
      "体を動かすことが好きな方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "shodoshima-olive-quest-2",
    title: "オリーブオイル品質管理講座",
    description:
      "オリーブオイルの品質を保つための管理方法を学ぶ実践的な講座です。温度管理や保存方法、品質検査の基本を習得できます。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 500,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    startsAt: "2025-01-20T02:00:00.000Z",
    endsAt: "2025-01-20T05:00:00.000Z",
    location: {
      name: "小豆島オリーブ記念館",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [CURRENT_USER],
    images: [
      {
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
        caption: "品質管理講座の様子",
      },
      {
        url: "https://images.unsplash.com/photo-1632662057933-455667f03888?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブの品質チェック",
      },
      {
        url: "https://images.unsplash.com/photo-1615370183635-de8ff3c3f91b?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブオイルのテイスティング",
      },
      {
        url: "https://images.unsplash.com/photo-1592332280537-70d3142bd01a?w=800&auto=format&fit=crop&q=80",
        caption: "オリーブの木の管理方法",
      },
    ],
    host: {
      name: "井上品質管理主任",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host12",
      title: "品質管理スペシャリスト",
      bio: "国際オリーブオイルコンテストの審査員として、品質基準の普及に努めています。",
    },
    capacity: 10,
    recommendedFor: [
      "食品品質管理に興味がある方",
      "オリーブオイルの専門知識を得たい方",
      "製品管理を学びたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "1",
    title: "地域で持続可能なビジネスをつくるには？",
    description:
      "地域で持続可能なビジネスを作るためのポイントについて、地域事業者と専門家が議論します。地域資源の活用、マーケティング戦略、資金調達など、実践的な内容を多角的に解説します。\n\n形式：パネルディスカッション（40分議論 + 20分Q&A）\n対象：プロジェクトや地域活性に興味がある人",
    type: "EVENT",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    startsAt: "2025-02-01T13:00:00+09:00",
    endsAt: "2025-02-01T14:00:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "山田太郎",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host1",
      title: "地域活性化コンサルタント",
      bio: "10年以上にわたり、全国各地の地域活性化プロジェクトに携わってきました。",
    },
    capacity: 5,
    pointsForComplete: 0,
    participants: [
      CURRENT_USER,
      {
        id: "user2",
        name: "鈴木花子",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
      },
      {
        id: "user3",
        name: "田中健一",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
      },
      {
        id: "user4",
        name: "渡辺美咲",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user4",
      },
      {
        id: "user5",
        name: "小林誠",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user5",
      },
    ],
    recommendedFor: [
      "知多、西三河エリアで観光に関する業務を実践、興味がある方",
      "発酵文化にまつわる事業を行われている方",
      "食文化を基軸にしたインバウンド観光に関係する方",
    ],
    relatedArticles: [
      {
        title: "折山尚美：地域活性化の新しい形を求めて",
        url: "/interviews/oriyama",
        type: "interview",
        image: "/placeholder.svg",
        description:
          "結婚を契機に南信州へ移住され、今や地域に欠くことのできない存在。飲食店や古民家・文化財の活用などを通じて地域活性にまつわる幅広い活動に携わる原動力について伺いました。",
        publishedAt: "2024/01/16",
      },
      {
        title: "小豆島オリーブが繋ぐ、地域の未来",
        url: "/articles/shodoshima-olive-future",
        type: "article",
        image: "/placeholder.svg",
        description:
          "小豆島のオリーブ栽培の歴史と、新しい取り組みについて紹介します。",
        publishedAt: "2024/01/15",
      },
    ],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "小豆島図書館",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "2",
    title: "観光業と地域課題解決の両立",
    description:
      "観光業を通じた地域課題解決の可能性について、実例を交えながら紹介します。持続可能な観光モデルの構築方法や、地域コミュニティとの協働についてお話しします。",
    type: "EVENT",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host2",
    startsAt: "2025-02-01T15:00:00+09:00",
    endsAt: "2025-02-01T16:00:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "鈴木美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host2",
      title: "観光まちづくりプランナー",
      bio: "地域の魅力を活かした持続可能な観光開発を提案しています。",
    },
    capacity: 30,
    pointsForComplete: 0,
    participants: [
      {
        id: "user6",
        name: "山本健一",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user6",
      },
    ],
    recommendedFor: [
      "観光業に携わる方",
      "地域活性化に興味のある方",
      "まちづくりに関心のある方",
    ],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "善通寺",
      address: "香川県善通寺市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "3",
    title: "古民家再生プロジェクトの清掃サポート",
    description:
      "古民家を活用したコミュニティスペースの清掃作業のお手伝いを募集しています。地域の方々と交流しながら、古民家の魅力を体感できます。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host3",
    startsAt: "2025-02-02T10:00:00+09:00",
    endsAt: "2025-02-02T15:00:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "田中美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host3",
      title: "古民家再生プロジェクトマネージャー",
      bio: "地域の古民家を活用した新しいコミュニティづくりを行っています。",
    },
    capacity: 10,
    pointsForComplete: 500,
    participants: [],
    recommendedFor: [
      "地域の歴史や文化に興味のある方",
      "古民家の再生に関心のある方",
      "地域コミュニティに参加したい方",
    ],
    image: ACTIVITY_IMAGES.RENOVATION,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "旧山田家住宅",
      address: "香川県高松市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "4",
    title: "若手農家が語る：小豆島オリーブの未来",
    description:
      "地域の若手農家が小豆島のオリーブ栽培の未来について語ります。新しい栽培方法や、オリーブを活用した地域活性化の取り組みについて紹介します。",
    type: "EVENT",
    status: "closed",
    communityId: "shodoshima-olive",
    hostId: "host3",
    startsAt: "2025-01-15T15:00:00+09:00",
    endsAt: "2025-01-15T16:00:00+09:00",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    host: {
      name: "木村健一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host3",
      title: "オリーブ農家",
      bio: "小豆島で3代目のオリーブ農家として活動しています。",
    },
    capacity: 30,
    pointsForComplete: 0,
    participants: [CURRENT_USER],
    recommendedFor: [
      "農業に興味がある方",
      "地域活性化に関心のある方",
      "オリーブについて学びたい方",
    ],
    relatedArticles: [
      {
        title: "小豆島オリーブが繋ぐ、地域の未来",
        url: "/articles/shodoshima-olive-future",
        type: "article",
        image: "/placeholder.svg",
        description:
          "小豆島のオリーブ栽培の歴史と、新しい取り組みについて紹介します。",
        publishedAt: "2024/01/15",
      },
    ],
    image: ACTIVITY_IMAGES.OLIVE,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "小豆島オリーブ公園",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "shikoku-pilgrimage-quest-1",
    title: "四国遍路案内アプリのベータテスター募集",
    description:
      "開発中の四国遍路案内アプリのベータ版テストにご協力いただける方を募集します。実際に札所を巡りながら、アプリの使い勝手や改善点をフィードバックしていただきます。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host4",
    startsAt: "2025-02-03T09:00:00+09:00",
    endsAt: "2025-02-03T17:00:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "中村太郎",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host4",
      title: "アプリ開発プロジェクトマネージャー",
      bio: "地域の文化をテクノロジーで支援するプロジェクトを推進しています。",
    },
    capacity: 5,
    pointsForComplete: 1000,
    participants: [],
    recommendedFor: [
      "四国遍路に興味のある方",
      "アプリ開発に関心のある方",
      "地域の文化デジタル化に興味のある方",
    ],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "善通寺周辺",
      address: "香川県善通寺市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "shodoshima-olive-event-1",
    title: "若手農家が語る：小豆島オリーブの未来",
    description:
      "小豆島で新しくオリーブ栽培を始めた若手農家たちが、その魅力と課題、そして未来への展望を語ります。",
    type: "EVENT",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host5",
    startsAt: "2025-02-04T15:00:00+09:00",
    endsAt: "2025-02-04T16:30:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "木村花子",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host5",
      title: "オリーブ農家",
      bio: "3年前から小豆島でオリーブ栽培を始めました。",
    },
    capacity: 20,
    pointsForComplete: 0,
    participants: [
      CURRENT_USER,
      {
        id: "member2",
        name: "田中健一",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member2",
      },
    ],
    recommendedFor: [
      "農業に興味がある方",
      "小豆島の地域活性に関心のある方",
      "オリーブ栽培について知りたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "小豆島オリーブ公園",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "shikoku-food-event-1",
    title: "デジタルで守る：四国の食文化と技",
    description:
      "四国の伝統的な食文化をデジタルで記録・保存する意義と手法について、食文化研究者とデジタルアーカイブの専門家が解説します。\n\n形式：パネルディスカッション（60分）",
    type: "EVENT",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host7",
    startsAt: "2025-02-06T14:00:00+09:00",
    endsAt: "2025-02-06T15:00:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "佐々木健一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host7",
      title: "食文化研究者",
      bio: "四国の伝統的な食文化の研究と記録に取り組んでいます。",
    },
    capacity: 30,
    pointsForComplete: 0,
    participants: [],
    recommendedFor: [
      "食文化に興味のある方",
      "デジタルアーカイブに関心のある方",
      "地域の伝統を守りたい方",
    ],
    image: ACTIVITY_IMAGES.FOOD,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "オンライン",
      address: "",
      isOnline: true,
      meetingUrl: "https://meet.google.com/xxx-xxxx-xxx",
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "shikoku-food-quest-1",
    title: "郷土料理のデジタルアーカイブ作成",
    description:
      "地域のお年寄りから伝統的な郷土料理のレシピを聞き取り、デジタル化するボランティアを募集します。料理の写真撮影や動画記録もお願いします。\n\n形式：2-3時間の取材活動",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host8",
    startsAt: "2025-02-07T10:00:00+09:00",
    endsAt: "2025-02-07T13:00:00+09:00",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    host: {
      name: "山口美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host8",
      title: "デジタルアーキビスト",
      bio: "文化財のデジタル保存・活用に携わっています。",
    },
    capacity: 5,
    pointsForComplete: 600,
    participants: [],
    recommendedFor: [
      "料理が好きな方",
      "地域の食文化に興味のある方",
      "写真・動画撮影ができる方",
    ],
    image: ACTIVITY_IMAGES.FOOD,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "高松市民センター",
      address: "香川県高松市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
  },
  {
    id: "naoshima-sauna-quest-1",
    title: "サウナで使う薪を取りに行こう",
    description:
      "直島の里山で薪拾いをしながら、持続可能なサウナ運営について学びます。集めた薪は実際にサウナで使用されます。\n\n形式：フィールドワーク（3時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "naoshima-sauna",
    hostId: "host9",
    startsAt: "2025-02-10T09:00:00+09:00",
    endsAt: "2025-02-10T12:00:00+09:00",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    host: {
      name: "木村隆",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host9",
      title: "サウナプロデューサー",
      bio: "サステナブルなサウナ文化の普及に取り組んでいます。",
    },
    capacity: 8,
    pointsForComplete: 400,
    participants: [],
    recommendedFor: [
      "サウナ好きな方",
      "自然の中での活動が好きな方",
      "持続可能な観光に興味のある方",
    ],
    image: ACTIVITY_IMAGES.SAUNA,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "直島サウナ",
      address: "香川県香川郡直島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    relatedArticles: [
      {
        title: "直島の里山が育むサウナ文化",
        url: "/articles/naoshima-sauna-culture",
        type: "article",
        image: "/placeholder.svg",
        description:
          "アートの島として知られる直島で、新たに注目を集めるサステナブルなサウナの取り組みについて紹介します。",
        publishedAt: "2024/01/20",
      },
      {
        title: "木村隆：サウナから考える持続可能な観光",
        url: "/interviews/kimura-takashi",
        type: "interview",
        image: "/placeholder.svg",
        description:
          "直島サウナプロジェクトを立ち上げた木村氏に、サウナを通じた新しい観光の形について語っていただきました。",
        publishedAt: "2024/01/21",
      },
    ],
  },
  {
    id: "naoshima-sauna-event-1",
    title: "サウナの薪割り・火おこし体験",
    description:
      "直島サウナで実際に薪割りと火おこしを体験。火を通じて、人とサウナの関係を考えます。\n\n形式：体験型ワークショップ（2時間）",
    type: "EVENT",
    status: "open",
    communityId: "naoshima-sauna",
    hostId: "host10",
    startsAt: "2025-02-11T14:00:00+09:00",
    endsAt: "2025-02-11T16:00:00+09:00",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    host: {
      name: "山田健一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host10",
      title: "火おこしマイスター",
      bio: "伝統的な火おこしの技術を継承しています。",
    },
    capacity: 10,
    pointsForComplete: 0,
    participants: [],
    recommendedFor: [
      "サウナ文化に興味のある方",
      "火おこしを学びたい方",
      "持続可能な暮らしに関心のある方",
    ],
    image: ACTIVITY_IMAGES.SAUNA,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "直島サウナ",
      address: "香川県香川郡直島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    relatedArticles: [
      {
        title: "火のある暮らしを見つめ直す",
        url: "/articles/life-with-fire",
        type: "article",
        image: "/placeholder.svg",
        description:
          "現代社会で失われつつある「火を使う技術」の大切さと、それを守り継ぐ人々の取り組みを紹介します。",
        publishedAt: "2024/01/22",
      },
    ],
  },
  {
    id: "uchiko-renovation-event-1",
    title: "合同会社型DAOが古民家再生の資金調達を変える",
    description:
      "ブロックチェーン技術を活用した新しい資金調達の形について、実例を交えながら解説します。\n\n形式：パネルディスカッション（60分）",
    type: "EVENT",
    status: "open",
    communityId: "uchiko-renovation",
    hostId: "host11",
    startsAt: "2025-02-12T19:00:00+09:00",
    endsAt: "2025-02-12T20:00:00+09:00",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    host: {
      name: "佐藤健一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host11",
      title: "DAO研究家",
      bio: "Web3技術の地域活性化への応用を研究しています。",
    },
    capacity: 30,
    pointsForComplete: 0,
    participants: [],
    recommendedFor: [
      "古民家再生に興味のある方",
      "DAOやWeb3に関心のある方",
      "新しい資金調達の形を探している方",
    ],
    image: ACTIVITY_IMAGES.RENOVATION,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "オンライン",
      address: "",
      isOnline: true,
      meetingUrl: "https://meet.google.com/xxx-xxxx-xxx",
      lat: 34.4784,
      lng: 134.2384,
    },
    relatedArticles: [
      {
        title: "地域活性化とDAO：新しい可能性",
        url: "/articles/dao-regional-development",
        type: "article",
        image: "/placeholder.svg",
        description:
          "DAOの仕組みを活用した地域活性化の最新事例と、その可能性について解説します。",
        publishedAt: "2024/01/10",
      },
      {
        title: "古民家×ブロックチェーン最前線",
        url: "/articles/blockchain-traditional-houses",
        type: "article",
        image: "/placeholder.svg",
        description:
          "伝統的な建造物の保存と活用に、ブロックチェーン技術がもたらす新しい可能性を探ります。",
        publishedAt: "2024/01/11",
      },
    ],
  },
  {
    id: "uchiko-renovation-quest-1",
    title: "古民家の清掃・メンテナンス",
    description:
      "内子町の古民家を清掃し、簡単な補修作業を行います。古民家の維持管理の基礎を学べます。\n\n形式：実地作業（4時間）",
    type: "QUEST",
    status: "open",
    communityId: "uchiko-renovation",
    hostId: "host12",
    startsAt: "2025-02-13T09:00:00+09:00",
    endsAt: "2025-02-13T13:00:00+09:00",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    host: {
      name: "高橋美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host12",
      title: "建築家",
      bio: "古民家の再生と活用をテーマに活動しています。",
    },
    capacity: 12,
    pointsForComplete: 500,
    participants: [],
    recommendedFor: [
      "古民家に興味のある方",
      "DIYが好きな方",
      "地域の歴史的建造物を守りたい方",
    ],
    image: ACTIVITY_IMAGES.RENOVATION,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "内子町並み保存地区",
      address: "愛媛県喜多郡内子町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    relatedArticles: [
      {
        title: "高橋美咲：建築家が語る古民家の魅力",
        url: "/interviews/takahashi-misaki",
        type: "interview",
        image: "/placeholder.svg",
        description:
          "内子町で古民家再生に取り組む建築家・高橋美咲氏に、古民家の持つ可能性について伺いました。",
        publishedAt: "2024/01/12",
      },
    ],
  },
  {
    id: "tokushima-maze-event-1",
    title: "迷路のまちナイトツアー",
    description:
      "眉山の傾斜地に広がる路地を、ライトアップとともに巡ります。地域の方々との交流も楽しめます。\n\n形式：ガイド付きツアー（2時間）",
    type: "EVENT",
    status: "open",
    communityId: "tokushima-maze",
    hostId: "host13",
    startsAt: "2025-02-14T18:00:00+09:00",
    endsAt: "2025-02-14T20:00:00+09:00",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    host: {
      name: "中村誠",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host13",
      title: "まちづくりコーディネーター",
      bio: "地域の魅力を活かした体験型観光を企画しています。",
    },
    capacity: 15,
    pointsForComplete: 0,
    participants: [],
    recommendedFor: [
      "徳島の路地裏に興味のある方",
      "ナイトツアーが好きな方",
      "地域の方々と交流したい方",
    ],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "眉山ロープウェイ駅前",
      address: "徳島県徳島市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    relatedArticles: [
      {
        title: "夜の徳島、新しい魅力",
        url: "/articles/tokushima-night",
        type: "article",
        image: "/placeholder.svg",
        description:
          "眉山の傾斜地に広がる路地裏の夜の表情と、そこで生まれる新しいコミュニティについて紹介します。",
        publishedAt: "2024/01/25",
      },
      {
        title: "中村誠：迷路のまちが繋ぐ人々の物語",
        url: "/interviews/nakamura-makoto",
        type: "interview",
        image: "/placeholder.svg",
        description:
          "徳島の路地裏を活かしたまちづくりに取り組む中村氏に、プロジェクトの背景と展望を伺いました。",
        publishedAt: "2024/01/26",
      },
    ],
  },
  {
    id: "tokushima-maze-quest-1",
    title: "観光マップの更新作業",
    description:
      "路地裏の新しい観光スポットや、おすすめの撮影ポイントを調査し、マップを更新します。\n\n形式：フィールドワーク（3時間）",
    type: "QUEST",
    status: "open",
    communityId: "tokushima-maze",
    hostId: "host14",
    startsAt: "2025-02-15T13:00:00+09:00",
    endsAt: "2025-02-15T16:00:00+09:00",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    host: {
      name: "田中美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host14",
      title: "地域ガイド",
      bio: "徳島の路地裏の魅力を発信しています。",
    },
    capacity: 6,
    pointsForComplete: 300,
    participants: [],
    recommendedFor: [
      "街歩きが好きな方",
      "写真撮影が得意な方",
      "地域の魅力発信に興味がある方",
    ],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/placeholder.svg",
        caption: "オリーブの収穫作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "収穫したオリーブの選別",
      },
      {
        url: "/placeholder.svg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/placeholder.svg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/placeholder.svg",
        caption: "地域の方々との交流会",
      },
    ],
    location: {
      name: "徳島市観光案内所",
      address: "徳島県徳島市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    relatedArticles: [
      {
        title: "進化する観光マップの作り方",
        url: "/articles/evolving-tourist-map",
        type: "article",
        image: "/placeholder.svg",
        description:
          "地域の魅力を伝える観光マップの作り方と、デジタル時代における新しい可能性について解説します。",
        publishedAt: "2024/01/27",
      },
    ],
  },
  {
    id: "yoshinogawa-creators-market-1",
    title: "クリエイターズマーケット2025春",
    description:
      "吉野川市クリエイターズマーケットの定期マーケットに出店していただけるクリエイターを募集します。\n\n地域の魅力を形にする作品、オリジナリティあふれる商品をお持ちの方、ぜひご参加ください。\n\n形式：マーケット出店（月1回開催）",
    type: "EVENT",
    status: "open",
    communityId: "yoshinogawa-creators-market",
    hostId: "yoshinogawa-member1",
    startsAt: "2025-03-01T10:00:00+09:00",
    endsAt: "2025-03-01T17:00:00+09:00",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    location: {
      name: "〇〇商店街",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    host: {
      name: "河野真理",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa1",
      title: "クリエイティブディレクター",
      bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
    },
    capacity: 20,
    pointsForComplete: 0,
    participants: [],
    image: ACTIVITY_IMAGES.ART,
    images: [
      {
        url: "/event-photos/yoshinogawa-1.jpg",
        caption: "マーケット出店の準備風景",
      },
      {
        url: "/event-photos/yoshinogawa-2.jpg",
        caption: "地域の方々との交流",
      },
      {
        url: "/event-photos/yoshinogawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yoshinogawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yoshinogawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "手作り作品やオリジナル商品を制作している方",
      "地域の魅力を発信したい方",
      "クリエイティブな活動を通じて地域に貢献したい方",
    ],
  },
  {
    id: "yamakawa-station-1",
    title: "山川町駅前の未来会議",
    description:
      "山川町駅前の新しい姿を、地域の皆さんと一緒に考えるワークショップを開催します。\n\n駅前空間の活用アイデアや、必要な機能について、実際の図面を見ながら議論します。\n\n形式：ワークショップ（2時間）",
    type: "EVENT",
    status: "open",
    communityId: "yamakawa-station",
    hostId: "yoshinogawa-member2",
    startsAt: "2025-03-15T14:00:00+09:00",
    endsAt: "2025-03-15T16:00:00+09:00",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    location: {
      name: "JR山川駅前広場",
      address: "徳島県吉野川市山川町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    host: {
      name: "田村健一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa2",
      title: "都市計画コンサルタント",
      bio: "20年以上にわたり、地方都市の駅前開発に携わってきました。人々の暮らしに寄り添った空間づくりを得意としています。",
    },
    capacity: 30,
    pointsForComplete: 0,
    participants: [],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/event-photos/yamakawa-1.jpg",
        caption: "駅前での清掃活動",
      },
      {
        url: "/event-photos/yamakawa-2.jpg",
        caption: "コミュニティスペースでのワークショップ",
      },
      {
        url: "/event-photos/yamakawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yamakawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yamakawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "山川町在住・在勤の方",
      "まちづくりに関心のある方",
      "駅前の活性化に興味がある方",
    ],
  },
  {
    id: "yoshinogawa-lab-1",
    title: "プログラミングで地域の課題を解決しよう",
    description:
      "地域課題をテクノロジーで解決する可能性について、実際の事例を交えながら学ぶワークショップです。参加者同士でアイデアを出し合い、簡単なプロトタイプ作成も行います。",
    type: "EVENT",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "yoshinogawa-member3",
    startsAt: "2025-04-05T13:00:00+09:00",
    endsAt: "2025-04-05T16:00:00+09:00",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    location: {
      name: "よしのがわラボ",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    host: {
      name: "木村さやか",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa3",
      title: "教育コーディネーター",
      bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
    },
    capacity: 15,
    pointsForComplete: 0,
    participants: [],
    image: ACTIVITY_IMAGES.PROGRAMMING,
    images: [
      {
        url: "/event-photos/yoshinogawa-1.jpg",
        caption: "マーケット出店の準備風景",
      },
      {
        url: "/event-photos/yoshinogawa-2.jpg",
        caption: "地域の方々との交流",
      },
      {
        url: "/event-photos/yoshinogawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yoshinogawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yoshinogawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "プログラミングに興味がある方（初心者歓迎）",
      "地域の課題解決に関心のある方",
      "新しい技術を学びたい方",
      "異世代との交流に興味がある方",
    ],
  },
  { ...mockInvitationOpportunities[0] },
  {
    id: "yoshinogawa-creators-market-quest-1",
    title: "マーケット出店者サポート",
    description:
      "初めて出店される方のブース設営や商品ディスプレイのお手伝いをしていただきます。\n\n形式：実践型クエスト（2時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "yoshinogawa-creators-market",
    hostId: "yoshinogawa-member1",
    startsAt: "2025-02-05T14:00:00.000Z",
    endsAt: "2025-02-05T16:00:00.000Z",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    host: {
      name: "河野真理",
      title: "クリエイティブディレクター",
      bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
      image: "/placeholder.svg",
    },
    location: {
      name: "〇〇商店街",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    capacity: 5,
    pointsForComplete: 500,
    participants: [],
    image: ACTIVITY_IMAGES.ART,
    images: [
      {
        url: "/event-photos/yoshinogawa-1.jpg",
        caption: "マーケット出店の準備風景",
      },
      {
        url: "/event-photos/yoshinogawa-2.jpg",
        caption: "地域の方々との交流",
      },
      {
        url: "/event-photos/yoshinogawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yoshinogawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yoshinogawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "接客が好きな方",
      "ディスプレイに興味がある方",
      "クリエイターをサポートしたい方",
    ],
  },
  {
    id: "yoshinogawa-creators-market-quest-2",
    title: "マーケットの記録係",
    description:
      "マーケットの様子を写真や動画で記録し、SNSでの発信用コンテンツを作成します。\n\n形式：実践型クエスト（4時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "yoshinogawa-creators-market",
    hostId: "yoshinogawa-member1",
    startsAt: "2025-02-08T10:00:00.000Z",
    endsAt: "2025-02-08T14:00:00.000Z",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    host: {
      name: "河野真理",
      title: "クリエイティブディレクター",
      bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
      image: "/placeholder.svg",
    },
    location: {
      name: "〇〇商店街",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    capacity: 3,
    pointsForComplete: 800,
    participants: [],
    image: ACTIVITY_IMAGES.ART,
    images: [
      {
        url: "/event-photos/yoshinogawa-1.jpg",
        caption: "マーケット出店の準備風景",
      },
      {
        url: "/event-photos/yoshinogawa-2.jpg",
        caption: "地域の方々との交流",
      },
      {
        url: "/event-photos/yoshinogawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yoshinogawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yoshinogawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "写真撮影が得意な方",
      "SNSの運用経験がある方",
      "コンテンツ制作に興味がある方",
    ],
  },
  {
    id: "yamakawa-station-quest-1",
    title: "駅前空間の利用調査",
    description:
      "駅前の人の流れや滞在場所を観察・記録し、より良い空間づくりのためのデータを収集します。\n\n形式：フィールドワーク（3時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "yamakawa-station",
    hostId: "yoshinogawa-member2",
    startsAt: "2025-02-03T13:00:00.000Z",
    endsAt: "2025-02-03T16:00:00.000Z",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    host: {
      name: "田中健一",
      title: "都市計画コンサルタント",
      bio: "20年以上にわたり、地方都市の駅前開発に携わってきました。人々の暮らしに寄り添った空間づくりを得意としています。",
      image: "/placeholder.svg",
    },
    location: {
      name: "JR山川駅前広場",
      address: "徳島県吉野川市山川町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    capacity: 10,
    pointsForComplete: 600,
    participants: [],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/event-photos/yamakawa-1.jpg",
        caption: "駅前での清掃活動",
      },
      {
        url: "/event-photos/yamakawa-2.jpg",
        caption: "コミュニティスペースでのワークショップ",
      },
      {
        url: "/event-photos/yamakawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yamakawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yamakawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "まちづくりに興味がある方",
      "データ収集・分析が好きな方",
      "地域の未来を考えたい方",
    ],
  },
  {
    id: "yamakawa-station-quest-3",
    title: "駅前の思い出インタビュー",
    description:
      "地域の方々から駅前の思い出や将来への期待をインタビューし、開発に活かすストーリーを集めます。\n\n形式：インタビュー（2時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "yamakawa-station",
    hostId: "yoshinogawa-member2",
    startsAt: "2025-02-10T08:00:00.000Z",
    endsAt: "2025-02-10T10:00:00.000Z",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    host: {
      name: "田中健一",
      title: "都市計画コンサルタント",
      bio: "20年以上にわたり、地方都市の駅前開発に携わってきました。人々の暮らしに寄り添った空間づくりを得意としています。",
      image: "/placeholder.svg",
    },
    location: {
      name: "JR山川駅前広場",
      address: "徳島県吉野川市山川町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    capacity: 5,
    pointsForComplete: 500,
    participants: [],
    image: ACTIVITY_IMAGES.COMMUNITY,
    images: [
      {
        url: "/event-photos/yamakawa-1.jpg",
        caption: "駅前での清掃活動",
      },
      {
        url: "/event-photos/yamakawa-2.jpg",
        caption: "コミュニティスペースでのワークショップ",
      },
      {
        url: "/event-photos/yamakawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yamakawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yamakawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "コミュニケーションが得意な方",
      "地域の歴史に興味がある方",
      "インタビューの経験を積みたい方",
    ],
  },
  {
    id: "yoshinogawa-lab-quest-1",
    title: "プログラミング教室アシスタント",
    description:
      "子ども向けプログラミング教室のサポートスタッフとして、基本的な操作の補助や質問対応をお願いします。\n\n形式：実践型クエスト（2時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "yoshinogawa-member3",
    startsAt: "2025-02-07T13:00:00.000Z",
    endsAt: "2025-02-07T15:00:00.000Z",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    host: {
      name: "鈴木美咲",
      title: "教育コーディネーター",
      bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
      image: "/placeholder.svg",
    },
    location: {
      name: "よしのがわラボ",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    capacity: 5,
    pointsForComplete: 500,
    participants: [],
    image: ACTIVITY_IMAGES.PROGRAMMING,
    images: [
      {
        url: "/event-photos/yoshinogawa-1.jpg",
        caption: "マーケット出店の準備風景",
      },
      {
        url: "/event-photos/yoshinogawa-2.jpg",
        caption: "地域の方々との交流",
      },
      {
        url: "/event-photos/yoshinogawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yoshinogawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yoshinogawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "プログラミングの基礎知識がある方",
      "子どもの教育に興味がある方",
      "IT技術の普及に貢献したい方",
    ],
  },
  {
    id: "yoshinogawa-lab-quest-2",
    title: "伝統文化講座の記録係",
    description:
      "地域の職人による伝統工芸の実演や講話を、写真・動画・文章で記録し、アーカイブ作成に協力していただきます。\n\n形式：実践型クエスト（3時間程度）",
    type: "QUEST",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "yoshinogawa-member3",
    startsAt: "2025-02-20T13:00:00.000Z",
    endsAt: "2025-02-20T16:00:00.000Z",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01"),
    host: {
      name: "鈴木美咲",
      title: "教育コーディネーター",
      bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
      image: "/placeholder.svg",
    },
    location: {
      name: "よしのがわラボ",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    capacity: 3,
    pointsForComplete: 700,
    participants: [],
    image: ACTIVITY_IMAGES.ART,
    images: [
      {
        url: "/event-photos/yoshinogawa-1.jpg",
        caption: "マーケット出店の準備風景",
      },
      {
        url: "/event-photos/yoshinogawa-2.jpg",
        caption: "地域の方々との交流",
      },
      {
        url: "/event-photos/yoshinogawa-3.jpg",
        caption: "オリーブオイルの搾油工程",
      },
      {
        url: "/event-photos/yoshinogawa-4.jpg",
        caption: "完成したオリーブオイル",
      },
      {
        url: "/event-photos/yoshinogawa-5.jpg",
        caption: "地域の方々との交流会",
      },
    ],
    recommendedFor: [
      "写真・動画撮影が得意な方",
      "伝統文化に興味がある方",
      "アーカイブ作成に興味がある方",
    ],
  },
  {
    id: "past-event-1",
    title: "小豆島オリーブ収穫祭 2024",
    description:
      "昨年開催された収穫祭では、地域の方々と一緒にオリーブの収穫を行い、収穫したオリーブを使った料理教室も開催しました。参加者からは「農業の大変さと面白さを実感できた」との声が多く寄せられました。",
    type: "EVENT",
    status: "closed",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 0,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),
    startsAt: "2024-10-15T03:00:00.000Z",
    endsAt: "2024-10-15T08:00:00.000Z",
    location: {
      name: "小豆島オリーブ公園",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [
      {
        id: "user1",
        name: "山田美咲",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
      },
      {
        id: "member2",
        name: "田中健一",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member2",
      },
      {
        id: "member3",
        name: "佐藤直子",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member3",
      },
    ],
    images: [
      {
        url: "/placeholder.svg",
        caption: "収穫祭の様子1",
      },
      {
        url: "/placeholder.svg",
        caption: "料理教室での調理風景",
      },
      {
        url: "/placeholder.svg",
        caption: "参加者全員での集合写真",
      },
    ],
    host: {
      name: "小豆島オリーブ農園",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host1",
      title: "オリーブ栽培責任者",
      bio: "小豆島で40年以上オリーブ栽培に携わってきました。若手農家の育成にも力を入れています。",
    },
    capacity: 20,
    recommendedFor: [
      "農業に興味がある方",
      "地域の食文化に興味のある方",
      "オリーブ栽培について知りたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "upcoming-quest-1",
    title: "新商品開発ワークショップ",
    description:
      "地域の特産品を活用した新商品のアイデアを出し合うワークショップです。デザイン思考の手法を用いて、市場ニーズと地域資源を掛け合わせた商品企画を行います。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 600,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    startsAt: "2025-03-01T05:00:00.000Z",
    endsAt: "2025-03-01T08:00:00.000Z",
    location: {
      name: "小豆島町役場 会議室",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [
      {
        id: "user1",
        name: "山田美咲",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
      },
    ],
    images: [
      {
        url: "/placeholder.svg",
        caption: "過去のワークショップの様子",
      },
    ],
    host: {
      name: "小豆島オリーブ農園",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host1",
      title: "商品開発担当",
      bio: "地域の特産品を活用した新商品開発に携わっています。デザイン思考を取り入れた商品企画が得意です。",
    },
    capacity: 15,
    recommendedFor: [
      "農業に興味がある方",
      "地域の食文化に興味のある方",
      "オリーブ栽培について知りたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "past-quest-1",
    title: "オリーブ畑の整備活動",
    description:
      "遊休農地となっていたオリーブ畑の再生作業を行いました。草刈りや土壌改良など、基礎的な農作業を通じて、オリーブ栽培の課題と可能性について学ぶ機会となりました。",
    type: "QUEST",
    status: "closed",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 400,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01"),
    startsAt: "2024-09-15T01:00:00.000Z",
    endsAt: "2024-09-15T05:00:00.000Z",
    location: {
      name: "小豆島町内オリーブ畑",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [
      {
        id: "user1",
        name: "山田美咲",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
      },
      {
        id: "member3",
        name: "佐藤直子",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member3",
      },
    ],
    images: [
      {
        url: "/placeholder.svg",
        caption: "整備前の畑の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "草刈り作業の様子",
      },
      {
        url: "/placeholder.svg",
        caption: "整備後の畑の様子",
      },
    ],
    host: {
      name: "小豆島オリーブ農園",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host1",
      title: "農場管理者",
      bio: "遊休農地の再生と若手農家の育成に取り組んでいます。持続可能な農業を目指しています。",
    },
    capacity: 10,
    recommendedFor: [
      "農業に興味がある方",
      "地域の食文化に興味のある方",
      "オリーブ栽培について知りたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "shodoshima-olive-quest-past-1",
    title: "オリーブの剪定作業",
    description:
      "オリーブの木の健康な成長を促すための剪定作業を行いました。プロの農家から剪定の基本技術を学び、実践することで、オリーブ栽培の重要な技術を習得できました。",
    type: "QUEST",
    status: "closed",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 500,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-10"),
    startsAt: "2024-12-15T01:00:00.000Z",
    endsAt: "2024-12-15T05:00:00.000Z",
    location: {
      name: "小豆島オリーブ農園",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [
      CURRENT_USER,
      {
        id: "member2",
        name: "田中健一",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member2",
      },
    ],
    images: [
      {
        url: "/placeholder.svg",
        caption: "剪定作業の様子",
      },
    ],
    host: {
      name: "山本農園主",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host9",
      title: "オリーブ農家",
      bio: "40年以上オリーブ栽培に携わり、若手農家の育成にも力を入れています。",
    },
    capacity: 10,
    recommendedFor: [
      "農業に興味がある方",
      "オリーブ栽培を学びたい方",
      "自然の中での作業が好きな方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "shodoshima-olive-quest-past-2",
    title: "オリーブオイル搾油体験",
    description:
      "収穫したオリーブの実から油を搾る工程を体験しました。搾油所での作業を通じて、オリーブオイル製造の全工程を学びます。",
    type: "QUEST",
    status: "closed",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 600,
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-11-20"),
    startsAt: "2024-11-25T01:00:00.000Z",
    endsAt: "2024-11-25T06:00:00.000Z",
    location: {
      name: "小豆島オリーブ搾油所",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [
      CURRENT_USER,
      {
        id: "member3",
        name: "佐藤直子",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member3",
      },
    ],
    images: [
      {
        url: "/placeholder.svg",
        caption: "搾油作業の様子",
      },
    ],
    host: {
      name: "井上工場長",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host10",
      title: "搾油技術者",
      bio: "30年以上オリーブオイルの製造に携わり、品質管理のスペシャリストとして活動しています。",
    },
    capacity: 8,
    recommendedFor: [
      "食品加工に興味がある方",
      "オリーブオイルについて詳しく知りたい方",
      "製造工程を学びたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "shodoshima-olive-quest-past-3",
    title: "オリーブ畑の土壌改良作業",
    description:
      "オリーブの生育環境を整えるための土壌改良作業を実施しました。土壌分析の方法から、適切な肥料の選択まで、科学的なアプローチで農業を学ぶことができました。",
    type: "QUEST",
    status: "closed",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 450,
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05"),
    startsAt: "2024-10-10T01:00:00.000Z",
    endsAt: "2024-10-10T04:00:00.000Z",
    location: {
      name: "小豆島オリーブ研究所",
      address: "香川県小豆郡小豆島町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [
      CURRENT_USER,
      {
        id: "member4",
        name: "木村研究員",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member4",
      },
    ],
    images: [
      {
        url: "/placeholder.svg",
        caption: "土壌改良作業の様子",
      },
    ],
    host: {
      name: "鈴木博士",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host11",
      title: "農業研究者",
      bio: "土壌学の専門家として、持続可能な農業の研究と普及に取り組んでいます。",
    },
    capacity: 12,
    recommendedFor: [
      "農業の科学的側面に興味がある方",
      "持続可能な農業を学びたい方",
      "土壌や肥料について知りたい方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "yoshinogawa-lab-event-1",
    title: "プログラミングで地域の未来",
    description:
      "地域課題をテクノロジーで解決する可能性について、実際の事例を交えながら学ぶワークショップです。参加者同士でアイデアを出し合い、簡単なプロトタイプ作成も行います。",
    type: "EVENT",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "host1",
    pointsForComplete: 0,
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-01-25"),
    startsAt: "2025-02-12T01:00:00.000Z",
    endsAt: "2025-02-12T04:00:00.000Z",
    location: {
      name: "よしのがわラボ",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [CURRENT_USER],
    images: [
      {
        url: "/placeholder.svg",
        caption: "ワークショップの様子",
      },
    ],
    host: {
      name: "佐藤エンジニア",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host7",
      title: "ソフトウェアエンジニア",
      bio: "地方でのIT教育に携わり、テクノロジーを活用した地域活性化に取り組んでいます。",
    },
    capacity: 15,
    recommendedFor: [
      "プログラミングに興味がある方",
      "地域課題解決に関心のある方",
      "テクノロジーを学びたい方",
    ],
    image: ACTIVITY_IMAGES.PROGRAMMING,
  },
  {
    id: "yamakawa-station-quest-2",
    title: "駅前花壇のデザインワークショップ",
    description:
      "山川町駅前の新しい花壇のデザインを考えるワークショップです。地域の方々と一緒に、四季を通じて楽しめる植栽計画を立てます。",
    type: "QUEST",
    status: "open",
    communityId: "yamakawa-station",
    hostId: "host1",
    pointsForComplete: 400,
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date("2025-01-28"),
    startsAt: "2025-02-15T01:00:00.000Z",
    endsAt: "2025-02-15T03:00:00.000Z",
    location: {
      name: "山川町駅前広場",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [CURRENT_USER],
    images: [
      {
        url: "/placeholder.svg",
        caption: "ワークショップの様子",
      },
    ],
    host: {
      name: "田中園芸家",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host8",
      title: "ガーデンデザイナー",
      bio: "地域の気候や風土に合わせた持続可能な庭づくりを提案しています。",
    },
    capacity: 15,
    recommendedFor: [
      "ガーデニングに興味がある方",
      "まちづくりに関心のある方",
      "デザインが好きな方",
    ],
    image: ACTIVITY_IMAGES.COMMUNITY,
  },
  {
    id: "yoshinogawa-kominka-cleaning",
    title: "古民家の大掃除ボランティア",
    description:
      "吉野川市の歴史ある古民家を、地域の新たな交流拠点として活用するためのクリーニングプロジェクトです。昔ながらの建築様式を学びながら、みんなで協力して掃除を行います。\n\n作業内容：\n- 床や壁、建具などの清掃\n- 不要物の整理\n- 庭の手入れ\n- 簡単な補修作業\n\n※作業しやすい服装でお越しください。",
    type: "QUEST",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "host1",
    pointsForComplete: 500,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    startsAt: "2024-02-15T01:00:00.000Z",
    endsAt: "2024-02-15T05:00:00.000Z",
    location: {
      name: "吉野川古民家",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.0662,
      lng: 134.3595,
    },
    participants: [],
    images: [
      {
        url: "/placeholder.svg",
        caption: "古民家の外観",
      },
      {
        url: "/placeholder.svg",
        caption: "掃除作業の様子",
      },
    ],
    host: {
      name: "木村修一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host15",
      title: "古民家再生プロジェクトマネージャー",
      bio: "古民家の再生と地域コミュニティの活性化に取り組んでいます。伝統的な建築技術の保存と現代的な活用方法の調和を目指しています。",
    },
    capacity: 15,
    recommendedFor: [
      "地域の歴史的建造物に興味がある方",
      "古民家の保存活動に関心のある方",
      "地域コミュニティの活性化に貢献したい方",
      "掃除や整理整頓が得意な方",
    ],
    image: ACTIVITY_IMAGES.RENOVATION,
  },
  {
    id: "project-discussion-1",
    title: "オリーブ農家の後継者についての壁打ち",
    description:
      "小豆島のオリーブ農家の高齢化が進む中、新規就農者の育成と技術継承が課題となっています。\n\n今回は、以下のポイントについてフィードバックや色々な意見をもらいたいです：\n\n・就農希望者向けの体験プログラムの設計\n・技術継承のためのデジタルドキュメント化\n・農地継承の仕組みづくり\n・新規就農者の収入確保策\n\n実際に新規就農された方や、就農支援に関わる方々と共に、実現可能な育成プログラムの構築を目指します。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 300,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    startsAt: "2025-02-10T05:00:00.000Z",
    endsAt: "2025-02-10T06:30:00.000Z",
    location: {
      name: "オンライン",
      address: "",
      isOnline: true,
      meetingUrl: "https://meet.google.com/xxx-xxxx-xxx",
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [],
    images: [
      {
        url: "/placeholder.svg",
        caption: "オンラインディスカッションの様子",
      },
    ],
    host: {
      name: "木村誠一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host20",
      title: "小豆島オリーブ研究所 研究員",
      bio: "新規就農支援プログラムの開発に携わり、5年間で10名の新規就農者の育成に成功。",
    },
    capacity: 6,
    recommendedFor: [
      "農業研修プログラムの企画・運営経験がある方",
      "就農支援に関わっている方",
      "新規就農者として経験のある方",
      "農業分野でのデジタル活用に知見のある方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "community-discussion-2",
    title: "オリーブオイルの新商品開発ブレスト",
    description:
      "小豆島産オリーブオイルの新しい活用方法と商品企画について、アイデアを出し合うセッションです。\n\n具体的なテーマ：\n・若年層向けの新商品企画\n・オリーブオイルを使った新しいレシピ開発\n・サステナブルなパッケージデザイン\n・ECでの販売戦略\n\n商品企画、デザイン、マーケティングなど、様々な視点からの意見を集め、実現可能な企画としてまとめていきます。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 400,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    startsAt: "2025-02-15T06:00:00.000Z",
    endsAt: "2025-02-15T07:30:00.000Z",
    location: {
      name: "オンライン",
      address: "",
      isOnline: true,
      meetingUrl: "https://meet.google.com/xxx-xxxx-xxx",
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [],
    images: [
      {
        url: "/placeholder.svg",
        caption: "オンラインブレストの様子",
      },
    ],
    host: {
      name: "田中美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host21",
      title: "小豆島オリーブ株式会社 商品開発部",
      bio: "食品メーカーでの商品企画経験を活かし、現在は小豆島のオリーブ製品の開発に携わっています。",
    },
    capacity: 8,
    recommendedFor: [
      "食品の商品企画経験がある方",
      "パッケージデザインの知見がある方",
      "オーガニック商品のECマーケティング経験がある方",
      "食品レシピ開発の経験がある方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "uchiko-renovation-event-2",
    title: "内子町古民家リノベーション見学会",
    description:
      "内子町で実際に行われた古民家リノベーションの事例を見学し、改修のポイントや活用方法について学びます。地域の建築家から直接説明を受けることができます。",
    type: "EVENT",
    status: "open",
    communityId: "uchiko-renovation",
    hostId: "host1",
    pointsForComplete: 0,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    startsAt: "2025-02-08T01:00:00.000Z",
    endsAt: "2025-02-08T04:00:00.000Z",
    location: {
      name: "内子町古民家再生プロジェクト拠点",
      address: "愛媛県喜多郡内子町",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [CURRENT_USER],
    images: [
      {
        url: "/placeholder.svg",
        caption: "リノベーション事例の様子",
      },
    ],
    host: {
      name: "高橋一郎",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host5",
      title: "建築家",
      bio: "内子町を中心に古民家再生プロジェクトを手がけています。伝統工法と現代的なニーズの調和を大切にしています。",
    },
    capacity: 20,
    recommendedFor: [
      "建築・リノベーションに興味がある方",
      "古民家活用を検討している方",
      "地域の歴史的建造物に関心のある方",
    ],
    image: ACTIVITY_IMAGES.RENOVATION,
  },
  {
    id: "yoshinogawa-lab-event-12222",
    title: "プログラミングで地域の未来",
    description:
      "地域課題をテクノロジーで解決する可能性について、実際の事例を交えながら学ぶワークショップです。参加者同士でアイデアを出し合い、簡単なプロトタイプ作成も行います。",
    type: "EVENT",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "host1",
    pointsForComplete: 0,
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-01-25"),
    startsAt: "2025-02-12T01:00:00.000Z",
    endsAt: "2025-02-12T04:00:00.000Z",
    location: {
      name: "よしのがわラボ",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [CURRENT_USER],
    images: [
      {
        url: "/placeholder.svg",
        caption: "ワークショップの様子",
      },
    ],
    host: {
      name: "佐藤エンジニア",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host7",
      title: "ソフトウェアエンジニア",
      bio: "地方でのIT教育に携わり、テクノロジーを活用した地域活性化に取り組んでいます。",
    },
    capacity: 15,
    recommendedFor: [
      "プログラミングに興味がある方",
      "地域課題解決に関心のある方",
      "テクノロジーを学びたい方",
    ],
    image: ACTIVITY_IMAGES.PROGRAMMING,
  },
  {
    id: "yoshinogawa-kominka-cleaningggg",
    title: "古民家の大掃除ボランティア",
    description:
      "吉野川市の歴史ある古民家を、地域の新たな交流拠点として活用するためのクリーニングプロジェクトです。昔ながらの建築様式を学びながら、みんなで協力して掃除を行います。\n\n作業内容：\n- 床や壁、建具などの清掃\n- 不要物の整理\n- 庭の手入れ\n- 簡単な補修作業\n\n※作業しやすい服装でお越しください。",
    type: "QUEST",
    status: "open",
    communityId: "yoshinogawa-lab",
    hostId: "host1",
    pointsForComplete: 500,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    startsAt: "2024-02-15T01:00:00.000Z",
    endsAt: "2024-02-15T05:00:00.000Z",
    location: {
      name: "吉野川古民家",
      address: "徳島県吉野川市",
      isOnline: false,
      lat: 34.0662,
      lng: 134.3595,
    },
    participants: [],
    images: [
      {
        url: "/placeholder.svg",
        caption: "古民家の外観",
      },
      {
        url: "/placeholder.svg",
        caption: "掃除作業の様子",
      },
    ],
    host: {
      name: "木村修一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host15",
      title: "古民家再生プロジェクトマネージャー",
      bio: "古民家の再生と地域コミュニティの活性化に取り組んでいます。伝統的な建築技術の保存と現代的な活用方法の調和を目指しています。",
    },
    capacity: 15,
    recommendedFor: [
      "地域の歴史的建造物に興味がある方",
      "古民家の保存活動に関心のある方",
      "地域コミュニティの活性化に貢献したい方",
      "掃除や整理整頓が得意な方",
    ],
    image: ACTIVITY_IMAGES.RENOVATION,
  },
  {
    id: "project-discussion-3",
    title: "オリーブ農家の後継者についての壁打ち",
    description:
      "小豆島のオリーブ農家の高齢化が進む中、新規就農者の育成と技術継承が課題となっています。\n\n今回は、以下のポイントについてフィードバックや色々な意見をもらいたいです：\n\n・就農希望者向けの体験プログラムの設計\n・技術継承のためのデジタルドキュメント化\n・農地継承の仕組みづくり\n・新規就農者の収入確保策\n\n実際に新規就農された方や、就農支援に関わる方々と共に、実現可能な育成プログラムの構築を目指します。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 300,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    startsAt: "2025-02-10T05:00:00.000Z",
    endsAt: "2025-02-10T06:30:00.000Z",
    location: {
      name: "オンライン",
      address: "",
      isOnline: true,
      meetingUrl: "https://meet.google.com/xxx-xxxx-xxx",
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [],
    images: [
      {
        url: "/placeholder.svg",
        caption: "オンラインディスカッションの様子",
      },
    ],
    host: {
      name: "木村誠一",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host20",
      title: "小豆島オリーブ研究所 研究員",
      bio: "新規就農支援プログラムの開発に携わり、5年間で10名の新規就農者の育成に成功。",
    },
    capacity: 6,
    recommendedFor: [
      "農業研修プログラムの企画・運営経験がある方",
      "就農支援に関わっている方",
      "新規就農者として経験のある方",
      "農業分野でのデジタル活用に知見のある方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
  {
    id: "community-discussion-3",
    title: "オリーブオイルの新商品開発ブレスト",
    description:
      "小豆島産オリーブオイルの新しい活用方法と商品企画について、アイデアを出し合うセッションです。\n\n具体的なテーマ：\n・若年層向けの新商品企画\n・オリーブオイルを使った新しいレシピ開発\n・サステナブルなパッケージデザイン\n・ECでの販売戦略\n\n商品企画、デザイン、マーケティングなど、様々な視点からの意見を集め、実現可能な企画としてまとめていきます。",
    type: "QUEST",
    status: "open",
    communityId: "shodoshima-olive",
    hostId: "host1",
    pointsForComplete: 400,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    startsAt: "2025-02-15T06:00:00.000Z",
    endsAt: "2025-02-15T07:30:00.000Z",
    location: {
      name: "オンライン",
      address: "",
      isOnline: true,
      meetingUrl: "https://meet.google.com/xxx-xxxx-xxx",
      lat: 34.4784,
      lng: 134.2384,
    },
    participants: [],
    images: [
      {
        url: "/placeholder.svg",
        caption: "オンラインブレストの様子",
      },
    ],
    host: {
      name: "田中美咲",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=host21",
      title: "小豆島オリーブ株式会社 商品開発部",
      bio: "食品メーカーでの商品企画経験を活かし、現在は小豆島のオリーブ製品の開発に携わっています。",
    },
    capacity: 8,
    recommendedFor: [
      "食品の商品企画経験がある方",
      "パッケージデザインの知見がある方",
      "オーガニック商品のECマーケティング経験がある方",
      "食品レシピ開発の経験がある方",
    ],
    image: ACTIVITY_IMAGES.OLIVE,
  },
];

export const mockUsers: User[] = [
  {
    ...CURRENT_USER,
    bio: "神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。",
    points: {
      "shodoshima-olive": {
        available: 1200,
        total: 3000,
      },
      "yamakawa-station": {
        available: 500,
        total: 500,
      },
      "setouchi-art": {
        available: 300,
        total: 300,
      },
      "kagawa-local-food": {
        available: 350,
        total: 400,
      },
      "naoshima-sauna": {
        available: 0,
        total: 0,
      },
      "uchiko-renovation": {
        available: 0,
        total: 0,
      },
      "tokushima-maze": {
        available: 0,
        total: 0,
      },
      "yoshinogawa-lab": {
        available: 0,
        total: 0,
      },
      "yoshinogawa-creators-market": {
        available: 0,
        total: 0,
      },
    },
    communities: [],
    appliedOppotunities: mockOpportunities.filter((project) =>
      project.participants.some((p) => p.id === CURRENT_USER.id)
    ),
    invitations: [
      ...mockInvitationOpportunities.map((o) => {
        return {
          id: o.id,
          opportunityId: o.id,
          pointsForBonus: 200,
          senderUserId: o.hostId,
          receiverUserId: CURRENT_USER.id,
          createdAt: new Date(),
          opportunity: o,
        };
      }),
      ...mockOpportunities
        .filter((o) => o.id === "yoshinogawa-lab-event-1")
        .map((o) => {
          return {
            id: o.id,
            pointsForBonus: 100,
            opportunityId: o.id,
            senderUserId: o.hostId,
            receiverUserId: CURRENT_USER.id,
            createdAt: new Date(),
            opportunity: o,
          };
        }),
    ],
  },
  // 小豆島オリーブプロジェクトのメンバー
  {
    id: "member1",
    name: "田中花子",
    title: "オリーブ農家",
    bio: "小豆島で3代続くオリーブ農家です。伝統的な栽培方法を守りながら、新しい品種の研究も行っています。若手農家の育成にも力を入れ、オリーブ栽培の技術継承に取り組んでいます。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=member1",
    points: { "shodoshima-olive": { available: 1000, total: 1200 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // 他のプロジェクトメンバー
  {
    id: "user2",
    name: "鈴木花子",
    title: "地域活性化メンバー",
    bio: "地域の魅力を発信する活動に参加しています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
    points: { "shodoshima-olive": { available: 200, total: 300 } },
    communities: [],
    appliedOppotunities: mockOpportunities.filter((project) =>
      project.participants.some((p) => p.id === "user2")
    ),
    invitations: [],
  },
  {
    id: "user3",
    name: "田中健一",
    title: "地域活性化メンバー",
    bio: "地域の課題解決に取り組んでいます。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
    points: { "shodoshima-olive": { available: 150, total: 200 } },
    communities: [],
    appliedOppotunities: mockOpportunities.filter((project) =>
      project.participants.some((p) => p.id === "user3")
    ),
    invitations: [],
  },
  {
    id: "user4",
    name: "渡辺美咲",
    title: "地域活性化メンバー",
    bio: "地域のイベント企画に携わっています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=user4",
    points: { "shodoshima-olive": { available: 100, total: 150 } },
    communities: [],
    appliedOppotunities: mockOpportunities.filter((project) =>
      project.participants.some((p) => p.id === "user4")
    ),
    invitations: [],
  },
  {
    id: "user5",
    name: "小林誠",
    title: "地域活性化メンバー",
    bio: "地域の伝統文化の継承に取り組んでいます。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=user5",
    points: { "shodoshima-olive": { available: 50, total: 100 } },
    communities: [],
    appliedOppotunities: mockOpportunities.filter((project) =>
      project.participants.some((p) => p.id === "user5")
    ),
    invitations: [],
  },
  {
    id: "user6",
    name: "山本健一",
    bio: "観光振興に関する活動に参加しています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=user6",
    points: { "shodoshima-olive": { available: 80, total: 120 } },
    communities: [],
    appliedOppotunities: mockOpportunities.filter((project) =>
      project.participants.some((p) => p.id === "user6")
    ),
    invitations: [],
  },
  // 瀬戸内アートプロジェクトのメンバー
  {
    id: "member2",
    name: "山本美咲",
    bio: "10年以上にわたり、国内外のアートプロジェクトに携わってきました。地域の文化や歴史を活かしたアート作品の企画・制作を得意とし、瀬戸内の魅力を世界に発信しています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=member2",
    points: { "setouchi-art": { available: 800, total: 1000 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // かがわ食文化プロジェクトのメンバー
  {
    id: "member3",
    name: "佐藤直子",
    bio: "香川の伝統的な食文化を研究し、その価値を現代に伝える活動を行っています。地元の生産者や料理人と協力しながら、新しい食文化の創造にも挑戦中です。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=member3",
    points: { "kagawa-local-food": { available: 600, total: 800 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // 直島サウナプロジェクトのメンバー
  {
    id: "member4",
    name: "木村隆",
    title: "サウナプロデューサー",
    bio: "サステナブルなサウナ文化の普及に取り組んでいます。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=member4",
    points: { "naoshima-sauna": { available: 400, total: 500 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // 内子町古民家再生プロジェクトのメンバー
  {
    id: "member5",
    name: "高橋美咲",
    title: "建築家",
    bio: "古民家の再生と活用をテーマに活動しています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=member5",
    points: { "uchiko-renovation": { available: 300, total: 400 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // 徳島迷路のまちづくりのメンバー
  {
    id: "member6",
    name: "中村誠",
    title: "まちづくりコーディネーター",
    bio: "地域の魅力を活かした体験型観光を企画しています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=member6",
    points: { "tokushima-maze": { available: 200, total: 300 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  {
    id: "host1",
    name: "山田太郎",
    title: "地域活性化コンサルタント",
    bio: "10年以上にわたり、全国各地の地域活性化プロジェクトに携わってきました。小豆島の魅力を最大限に引き出すため、地域の方々と一緒に様々なプロジェクトを推進しています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=host1",
    points: { "naoshima-sauna": { available: 1000, total: 1200 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // 吉野川市クリエイターズマーケットのメンバー
  {
    id: "yoshinogawa-member1",
    name: "河野真理",
    title: "クリエイティブディレクター",
    bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa1",
    points: { "yoshinogawa-creators-market": { available: 1000, total: 1200 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // 山川町駅前開発プロジェクトのメンバー
  {
    id: "yoshinogawa-member2",
    name: "田村健一",
    title: "都市計画コンサルタント",
    bio: "20年以上にわたり、地方都市の駅前開発に携わってきました。人々の暮らしに寄り添った空間づくりを得意としています。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa2",
    points: { "yamakawa-station": { available: 800, total: 1000 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
  // よしのがわラボのメンバー
  {
    id: "yoshinogawa-member3",
    name: "木村さやか",
    title: "教育コーディネーター",
    bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa3",
    points: { "yoshinogawa-lab": { available: 600, total: 800 } },
    communities: [],
    appliedOppotunities: [],
    invitations: [],
  },
];

export const mockCommunities: Community[] = [
  {
    id: "shodoshima-olive",
    title: "小豆島オリーブプロジェクト",
    description:
      "小豆島の伝統的なオリーブ栽培を次世代に継承しながら、新しい特産品の開発や観光プログラムの企画を行っています。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "香川県",
      city: "小豆島町",
      address: "香川県小豆郡小豆島町",
    },
    speakerDeckEmbed: {
      title: "小豆島オリーブプロジェクト概要",
      embedUrl:
        "https://speakerdeck.com/koel/li-kanating-nohazimekata-shu-ji-ban",
    },
    customLinks: [
      {
        title: "プロジェクトブログ",
        url: "https://note.com/shodoshima_olive",
      },
      {
        title: "オリーブオイル販売サイト",
        url: "https://shodoshima-olive.stores.jp",
      },
    ],
    members: Array.from(
      new Set(
        mockOpportunities
          .filter(
            (opportunity) => opportunity.communityId === "shodoshima-olive"
          )
          .map((opportunity) => opportunity.participants)
          .flat()
          .map((participant) => participant.id)
      )
    )
      .map((id) => {
        const participant = mockOpportunities
          .filter(
            (opportunity) => opportunity.communityId === "shodoshima-olive"
          )
          .map((opportunity) => opportunity.participants)
          .flat()
          .find((p) => p.id === id);

        if (!participant) return;
        const titles = [
          "オリーブ栽培アドバイザー",
          "食文化コーディネーター",
          "地域活性化メンバー",
          "オリーブオイルソムリエ",
          "農業体験ファシリテーター",
          "食育プランナー",
          "地域ブランディング担当",
          "サステナビリティコンサルタント",
        ];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        return {
          ...participant,
          title: randomTitle,
          bio: mockUsers.find((user) => user.id === participant.id)?.bio || "",
        };
      })
      .filter(Boolean) as Community["members"],
    opportunities: [],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/shodoshima_olive" },
      { type: "website", url: "https://shodoshima-olive.jp" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-31"),
  },
  {
    id: "setouchi-art",
    title: "瀬戸内アートプロジェクト",
    description:
      "瀬戸内海の島々をアートで繋ぎ、新しい観光の形を提案します。地域の方々とアーティストが協力して作品を制作・展示します。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "香川県",
      city: "高松市",
      address: "香川県高松市",
    },
    members: [
      {
        id: "member2",
        name: "山本美咲",
        title: "アートディレクター",
        bio: "10年以上にわたり、国内外のアートプロジェクトに携わってきました。地域の文化や歴史を活かしたアート作品の企画・制作を得意とし、瀬戸内の魅力を世界に発信しています。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member2",
      },
    ],
    opportunities: [],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/setouchi_art" },
      { type: "twitter", url: "https://twitter.com/setouchi_art" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-31"),
  },
  {
    id: "kagawa-local-food",
    title: "かがわ食文化プロジェクト",
    description:
      "香川の伝統的な食文化を守りながら、現代に合わせた新しい食文化を創造します。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "香川県",
      city: "高松市",
      address: "香川県高松市",
    },
    members: [
      {
        id: "member3",
        name: "佐藤直子",
        title: "食文化研究家",
        bio: "香川の伝統的な食文化を研究し、その価値を現代に伝える活動を行っています。地元の生産者や料理人と協力しながら、新しい食文化の創造にも挑戦中です。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member3",
      },
    ],
    opportunities: [],
    socialLinks: [
      { type: "youtube", url: "https://youtube.com/@kagawa_food" },
      { type: "website", url: "https://kagawa-food.jp" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-31"),
  },
  {
    id: "naoshima-sauna",
    title: "直島サウナプロジェクト",
    description:
      "アートの島として知られる直島で、新たな観光資源としてサウナを活用し、持続可能な観光の形を模索します。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "香川県",
      city: "香川郡直島町",
      address: "香川県香川郡直島町",
    },
    members: [
      {
        id: "member4",
        name: "木村隆",
        title: "サウナプロデューサー",
        bio: "サステナブルなサウナ文化の普及に取り組んでいます。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member4",
      },
    ],
    opportunities: [],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/naoshima_sauna" },
      { type: "website", url: "https://naoshima-sauna.jp" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-31"),
  },
  {
    id: "uchiko-renovation",
    title: "内子町古民家再生プロジェクト",
    description:
      "愛媛県内子町の歴史的な町並みを活かしながら、古民家を再生し、新しい観光・交流の拠点を作ります。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "愛媛県",
      city: "喜多郡内子町",
      address: "愛媛県喜多郡内子町",
    },
    members: [
      {
        id: "member5",
        name: "高橋美咲",
        title: "建築家",
        bio: "古民家の再生と活用をテーマに活動しています。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member5",
      },
    ],
    opportunities: [],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/uchiko_renovation" },
      { type: "website", url: "https://uchiko-renovation.jp" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-31"),
  },
  {
    id: "tokushima-maze",
    title: "徳島迷路のまちづくり",
    description:
      "徳島市の傾斜地に広がる路地を「迷路」として再解釈し、新しい観光資源として活用します。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "徳島県",
      city: "徳島市",
      address: "徳島県徳島市",
    },
    members: [
      {
        id: "member6",
        name: "中村誠",
        title: "まちづくりコーディネーター",
        bio: "地域の魅力を活かした体験型観光を企画しています。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=member6",
      },
    ],
    opportunities: [],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/tokushima_maze" },
      { type: "website", url: "https://tokushima-maze.jp" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-31"),
  },
  {
    id: "yoshinogawa-creators-market",
    title: "吉野川市クリエイターズマーケット",
    description:
      "ローカルクリエイターの作品販売、ワークショップ開催、カフェスペースを備えた複合商業施設。地域の魅力を新しい形で発信します。伝統工芸からデジタルアートまで、多様なクリエイターの活動拠点として、地域の文化的価値を高めていきます。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "徳島県",
      city: "吉野川市",
      address: "徳島県吉野川市",
    },
    members: [
      {
        id: "yoshinogawa-member1",
        name: "河野真理",
        title: "クリエイティブディレクター",
        bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa1",
      },
    ],
    opportunities: [
      {
        id: "yoshinogawa-creators-market-quest-1",
        title: "マーケット出店者サポート",
        description:
          "初めて出店される方のブース設営や商品ディスプレイのお手伝いをしていただきます。\n\n形式：実践型クエスト（2時間程度）",
        type: "QUEST",
        status: "open",
        communityId: "yoshinogawa-creators-market",
        hostId: "yoshinogawa-member1",
        startsAt: "2025-02-05T14:00:00.000Z",
        endsAt: "2025-02-05T16:00:00.000Z",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
        host: {
          name: "河野真理",
          title: "クリエイティブディレクター",
          bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
          image: "/placeholder.svg",
        },
        location: {
          name: "〇〇商店街",
          address: "徳島県吉野川市",
          isOnline: false,
          lat: 34.4784,
          lng: 134.2384,
        },
        capacity: 5,
        pointsForComplete: 500,
        participants: [],
        image: ACTIVITY_IMAGES.ART,
        images: [
          {
            url: "/event-photos/yoshinogawa-1.jpg",
            caption: "マーケット出店の準備風景",
          },
          {
            url: "/event-photos/yoshinogawa-2.jpg",
            caption: "地域の方々との交流",
          },
          {
            url: "/event-photos/yoshinogawa-3.jpg",
            caption: "オリーブオイルの搾油工程",
          },
          {
            url: "/event-photos/yoshinogawa-4.jpg",
            caption: "完成したオリーブオイル",
          },
          {
            url: "/event-photos/yoshinogawa-5.jpg",
            caption: "地域の方々との交流会",
          },
        ],
        recommendedFor: [
          "接客が好きな方",
          "ディスプレイに興味がある方",
          "クリエイターをサポートしたい方",
        ],
      },
      {
        id: "yoshinogawa-creators-market-quest-2",
        title: "マーケットの記録係",
        description:
          "マーケットの様子を写真や動画で記録し、SNSでの発信用コンテンツを作成します。\n\n形式：実践型クエスト（4時間程度）",
        type: "QUEST",
        status: "open",
        communityId: "yoshinogawa-creators-market",
        hostId: "yoshinogawa-member1",
        startsAt: "2025-02-08T10:00:00.000Z",
        endsAt: "2025-02-08T14:00:00.000Z",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
        host: {
          name: "河野真理",
          title: "クリエイティブディレクター",
          bio: "徳島県出身のクリエイティブディレクター。地域の伝統とモダンなデザインを融合させた新しい価値創造に取り組んでいます。",
          image: "/placeholder.svg",
        },
        location: {
          name: "〇〇商店街",
          address: "徳島県吉野川市",
          isOnline: false,
          lat: 34.4784,
          lng: 134.2384,
        },
        capacity: 3,
        pointsForComplete: 800,
        participants: [],
        image: ACTIVITY_IMAGES.ART,
        images: [
          {
            url: "/event-photos/yoshinogawa-1.jpg",
            caption: "マーケット出店の準備風景",
          },
          {
            url: "/event-photos/yoshinogawa-2.jpg",
            caption: "地域の方々との交流",
          },
          {
            url: "/event-photos/yoshinogawa-3.jpg",
            caption: "オリーブオイルの搾油工程",
          },
          {
            url: "/event-photos/yoshinogawa-4.jpg",
            caption: "完成したオリーブオイル",
          },
          {
            url: "/event-photos/yoshinogawa-5.jpg",
            caption: "地域の方々との交流会",
          },
        ],
        recommendedFor: [
          "写真撮影が得意な方",
          "SNSの運用経験がある方",
          "コンテンツ制作に興味がある方",
        ],
      },
    ],
    socialLinks: [
      {
        type: "instagram",
        url: "https://instagram.com/yoshinogawa_creators_market",
      },
      { type: "website", url: "https://yoshinogawa-creators-market.jp" },
    ],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-31"),
  },
  {
    id: "yamakawa-station",
    title: "山川町駅前開発プロジェクト",
    description:
      "駅周辺を多世代交流の拠点として再構築。カフェ、ギャラリー、交流スペースを設置し、駅を単なる通過点から、人々が出会い、つながる場所へと変革します。地域の歴史を活かしながら、新しいコミュニティの形成を目指します。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "徳島県",
      city: "吉野川市山川町",
      address: "徳島県吉野川市山川町",
    },
    members: [
      {
        id: "yoshinogawa-member2",
        name: "田村健一",
        title: "都市計画コンサルタント",
        bio: "20年以上にわたり、地方都市の駅前開発に携わってきました。人々の暮らしに寄り添った空間づくりを得意としています。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa2",
      },
    ],
    opportunities: [
      {
        id: "yamakawa-station-quest-1",
        title: "駅前空間の利用調査",
        description:
          "駅前の人の流れや滞在場所を観察・記録し、より良い空間づくりのためのデータを収集します。\n\n形式：フィールドワーク（3時間程度）",
        type: "QUEST",
        status: "open",
        communityId: "yamakawa-station",
        hostId: "yoshinogawa-member2",
        startsAt: "2025-02-03T13:00:00.000Z",
        endsAt: "2025-02-03T16:00:00.000Z",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
        host: {
          name: "田中健一",
          title: "都市計画コンサルタント",
          bio: "20年以上にわたり、地方都市の駅前開発に携わってきました。人々の暮らしに寄り添った空間づくりを得意としています。",
          image: "/placeholder.svg",
        },
        location: {
          name: "JR山川駅前広場",
          address: "徳島県吉野川市山川町",
          isOnline: false,
          lat: 34.4784,
          lng: 134.2384,
        },
        capacity: 10,
        pointsForComplete: 600,
        participants: [],
        image: ACTIVITY_IMAGES.COMMUNITY,
        images: [
          {
            url: "/event-photos/yamakawa-1.jpg",
            caption: "駅前での清掃活動",
          },
          {
            url: "/event-photos/yamakawa-2.jpg",
            caption: "コミュニティスペースでのワークショップ",
          },
          {
            url: "/event-photos/yamakawa-3.jpg",
            caption: "オリーブオイルの搾油工程",
          },
          {
            url: "/event-photos/yamakawa-4.jpg",
            caption: "完成したオリーブオイル",
          },
          {
            url: "/event-photos/yamakawa-5.jpg",
            caption: "地域の方々との交流会",
          },
        ],
        recommendedFor: [
          "まちづくりに興味がある方",
          "データ収集・分析が好きな方",
          "地域の未来を考えたい方",
        ],
      },
    ],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/yamakawa_station" },
      { type: "website", url: "https://yamakawa-station.jp" },
    ],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-31"),
  },
  {
    id: "yoshinogawa-lab",
    title: "まちの学び舎「よしのがわラボ」",
    description:
      "世代を超えた学びと交流の場。プログラミング教室から伝統文化講座まで、多様な学習機会を提供する複合教育施設。地域の知恵と先端技術を組み合わせた新しい学びの形を創造します。",
    icon: "/placeholder.svg",
    location: {
      prefecture: "徳島県",
      city: "吉野川市",
      address: "徳島県吉野川市",
    },
    members: [
      {
        id: "yoshinogawa-member3",
        name: "木村さやか",
        title: "教育コーディネーター",
        bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=yoshinogawa3",
      },
    ],
    opportunities: [
      {
        id: "yoshinogawa-lab-quest-1",
        title: "プログラミング教室アシスタント",
        description:
          "子ども向けプログラミング教室のサポートスタッフとして、基本的な操作の補助や質問対応をお願いします。\n\n形式：実践型クエスト（2時間程度）",
        type: "QUEST",
        status: "open",
        communityId: "yoshinogawa-lab",
        hostId: "yoshinogawa-member3",
        startsAt: "2025-02-07T13:00:00.000Z",
        endsAt: "2025-02-07T15:00:00.000Z",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
        host: {
          name: "鈴木美咲",
          title: "教育コーディネーター",
          bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
          image: "/placeholder.svg",
        },
        location: {
          name: "よしのがわラボ",
          address: "徳島県吉野川市",
          isOnline: false,
          lat: 34.4784,
          lng: 134.2384,
        },
        capacity: 5,
        pointsForComplete: 500,
        participants: [],
        image: ACTIVITY_IMAGES.PROGRAMMING,
        images: [
          {
            url: "/event-photos/yoshinogawa-1.jpg",
            caption: "マーケット出店の準備風景",
          },
          {
            url: "/event-photos/yoshinogawa-2.jpg",
            caption: "地域の方々との交流",
          },
          {
            url: "/event-photos/yoshinogawa-3.jpg",
            caption: "オリーブオイルの搾油工程",
          },
          {
            url: "/event-photos/yoshinogawa-4.jpg",
            caption: "完成したオリーブオイル",
          },
          {
            url: "/event-photos/yoshinogawa-5.jpg",
            caption: "地域の方々との交流会",
          },
        ],
        recommendedFor: [
          "プログラミングの基礎知識がある方",
          "子どもの教育に興味がある方",
          "IT技術の普及に貢献したい方",
        ],
      },
      {
        id: "yoshinogawa-lab-quest-2",
        title: "伝統文化講座の記録係",
        description:
          "地域の職人による伝統工芸の実演や講話を、写真・動画・文章で記録し、アーカイブ作成に協力していただきます。\n\n形式：実践型クエスト（3時間程度）",
        type: "QUEST",
        status: "open",
        communityId: "yoshinogawa-lab",
        hostId: "yoshinogawa-member3",
        startsAt: "2025-02-20T13:00:00.000Z",
        endsAt: "2025-02-20T16:00:00.000Z",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
        host: {
          name: "鈴木美咲",
          title: "教育コーディネーター",
          bio: "教育現場での経験を活かし、世代間交流を促進する新しい学びの場づくりに取り組んでいます。",
          image: "/placeholder.svg",
        },
        location: {
          name: "よしのがわラボ",
          address: "徳島県吉野川市",
          isOnline: false,
          lat: 34.4784,
          lng: 134.2384,
        },
        capacity: 3,
        pointsForComplete: 700,
        participants: [],
        image: ACTIVITY_IMAGES.ART,
        images: [
          {
            url: "/event-photos/yoshinogawa-1.jpg",
            caption: "マーケット出店の準備風景",
          },
          {
            url: "/event-photos/yoshinogawa-2.jpg",
            caption: "地域の方々との交流",
          },
          {
            url: "/event-photos/yoshinogawa-3.jpg",
            caption: "オリーブオイルの搾油工程",
          },
          {
            url: "/event-photos/yoshinogawa-4.jpg",
            caption: "完成したオリーブオイル",
          },
          {
            url: "/event-photos/yoshinogawa-5.jpg",
            caption: "地域の方々との交流会",
          },
        ],
        recommendedFor: [
          "写真・動画撮影が得意な方",
          "伝統文化に興味がある方",
          "アーカイブ作成に興味がある方",
        ],
      },
    ],
    socialLinks: [
      { type: "instagram", url: "https://instagram.com/yoshinogawa_lab" },
      { type: "website", url: "https://yoshinogawa-lab.jp" },
    ],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-31"),
  },
];

export const CURRENT_USER_DATA = mockUsers.find(
  (u) => u.id === CURRENT_USER.id
) as User;

export type PointHistory = {
  id: string;
  communityId: string;
  title: string;
  amount: number;
  type: "EARNED" | "SPENT";
  description: string;
  createdAt: string;
};

export const mockPointHistory: Record<string, PointHistory[]> = {
  "shodoshima-olive": [
    {
      id: "1",
      communityId: "shodoshima-olive",
      title: "オリーブ畑の整備活動",
      amount: 1000,
      type: "EARNED",
      description: "オリーブ畑の整備活動に参加",
      createdAt: "2024-01-10T09:00:00+09:00",
    },
    {
      id: "2",
      communityId: "shodoshima-olive",
      title: "オリーブオイル搾油体験",
      amount: 1200,
      type: "EARNED",
      description: "オリーブオイル搾油体験に参加",
      createdAt: "2024-01-15T10:00:00+09:00",
    },
    {
      id: "3",
      communityId: "shodoshima-olive",
      title: "収穫祭運営サポート",
      amount: 800,
      type: "EARNED",
      description: "オリーブ収穫祭の運営をサポート",
      createdAt: "2024-01-20T13:00:00+09:00",
    },
    {
      id: "4",
      communityId: "shodoshima-olive",
      title: "オリーブオイル購入",
      amount: 1000,
      type: "SPENT",
      description: "プレミアムオリーブオイルと交換",
      createdAt: "2024-01-25T15:00:00+09:00",
    },
    {
      id: "5",
      communityId: "shodoshima-olive",
      title: "オリーブ製品購入",
      amount: 800,
      type: "SPENT",
      description: "オリーブ石鹸セットと交換",
      createdAt: "2024-02-01T11:00:00+09:00",
    },
  ],
  "naoshima-sauna": [
    {
      id: "4",
      communityId: "naoshima-sauna",
      title: "サウナの薪割り・火おこし体験",
      amount: 800,
      type: "EARNED",
      description: "サウナの薪割り・火おこし体験に参加",
      createdAt: "2024-01-20T15:00:00+09:00",
    },
    {
      id: "5",
      communityId: "naoshima-sauna",
      title: "サウナチケットと交換",
      amount: 500,
      type: "SPENT",
      description: "サウナチケットと交換",
      createdAt: "2024-01-05T16:45:00+09:00",
    },
  ],
  "setouchi-art": [
    {
      id: "setouchi-art-1",
      communityId: "setouchi-art",
      title: "瀬戸内国際芸術祭2024の作品設置サポート",
      amount: 200,
      type: "EARNED",
      description: "新作インスタレーションの設置作業を手伝いました",
      createdAt: "2024-01-15T09:00:00+09:00",
    },
    {
      id: "setouchi-art-2",
      communityId: "setouchi-art",
      title: "来場者案内ボランティア",
      amount: 100,
      type: "EARNED",
      description: "外国人観光客の案内と作品の解説を行いました",
      createdAt: "2024-02-01T10:00:00+09:00",
    },
  ],
  "kagawa-local-food": [
    {
      id: "kagawa-local-food-1",
      communityId: "kagawa-local-food",
      title: "稲刈り体験イベントの運営補助",
      amount: 200,
      type: "EARNED",
      description: "地域の農家さんと協力して稲刈り体験イベントを実施",
      createdAt: "2024-01-20T08:00:00+09:00",
    },
    {
      id: "kagawa-local-food-2",
      communityId: "kagawa-local-food",
      title: "収穫祭の企画・運営",
      amount: 150,
      type: "EARNED",
      description: "地域の食材を使った料理教室の開催",
      createdAt: "2024-01-25T13:00:00+09:00",
    },
  ],
  "yamakawa-station": [
    {
      id: "yamakawa-1",
      communityId: "yamakawa-station",
      title: "駅前空間利用調査への参加",
      amount: 300,
      type: "EARNED",
      description: "駅前の人の流れの記録活動に参加",
      createdAt: "2025-01-15T10:00:00+09:00",
    },
    {
      id: "yamakawa-2",
      communityId: "yamakawa-station",
      title: "ワークショップでのアイデア提案",
      amount: 200,
      type: "EARNED",
      description: "山川町駅前の未来ワークショップへの参加",
      createdAt: "2025-02-01T14:30:00+09:00",
    },
  ],
};

export const mockActivities: Activity[] = [
  {
    id: "activity1",
    title: "オリーヴ兄弟から学ぶ　オリーブ収穫・テイスティング体験",
    description:
      "小豆島の美しいオリーブ畑で、オリーブの収穫から味わいまでを体験できます。オリーブ栽培のエキスパートである「オリーヴ兄弟」から、オリーブの育て方や収穫方法を学び、最後にはオリーブオイルのテイスティングも楽しめます。",
    communityId: "neo88",
    price: 3500,
    duration: 180,
    location: {
      name: "小豆島オリーブ園",
      address: "香川県小豆郡小豆島町西村甲1941-1",
      prefecture: "香川県",
      city: "小豆郡",
      lat: 34.4784,
      lng: 134.2384,
    },
    images: [
      "/images/activities/olive.jpg",
      "/images/activities/olive-tasting.jpg",
      "/images/activities/olive-farm.jpg",
    ],
    capacity: 8,
    schedule: {
      startTime: "09:00",
      endTime: "12:00",
      daysOfWeek: [0, 6], // 土日のみ
    },
    timeSchedule: [
      {
        time: "09:00",
        description: "集合・オリエンテーション",
      },
      {
        time: "09:30",
        description: "オリーブの収穫",
      },
      {
        time: "11:00",
        description: "オリーブオイルのテイスティング",
      },
      {
        time: "12:00",
        description: "解散",
      },
    ],
    precautions: [
      "動きやすい服装、靴でお越しください。",
      "収穫作業に使用する手袋や収穫袋、収穫かごは無料で貸し出しいたします。",
      "前日または当日のご宿泊は、オリーヴの森の敷地内にある宿泊施設、千年オリーブテラス「The STAY」をお勧めします。（別料金）",
    ],
    host: {
      name: "山田 美咲",
      bio: "20年以上にわたり四国の伝統工芸を研究。地域の文化継承に力を入れています。",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity2",
    title: "正岡子規生誕の地で自分の人生を見つける俳句体験",
    description:
      "松山市の正岡子規記念館で、俳句の世界に浸る特別な体験を提供します。地元の俳句の達人から俳句の基本を学び、子規の足跡を辿りながら、自分だけの俳句を作り上げていきます。",
    communityId: "neo88",
    price: 3500,
    duration: 120,
    location: {
      name: "正岡子規記念館",
      address: "愛媛県松山市道後公園1-30",
      prefecture: "愛媛県",
      city: "松山市",
      lat: 33.8516,
      lng: 132.7866,
    },
    images: [
      "/images/activities/haiku-museum.jpg",
      "/images/activities/haiku-workshop.jpg",
      "/images/activities/haiku-garden.jpg",
    ],
    capacity: 10,
    schedule: {
      startTime: "13:00",
      endTime: "15:00",
      daysOfWeek: [3, 6], // 水曜と土曜
    },
    timeSchedule: [
      {
        time: "13:00",
        description: "集合・オリエンテーション",
      },
      {
        time: "13:30",
        description: "俳句の基礎講座",
      },
      {
        time: "14:30",
        description: "吟行体験",
      },
      {
        time: "15:00",
        description: "解散",
      },
    ],
    precautions: [
      "ペンやノートはご用意ください。",
      "子規記念館の見学は自由です。",
      "事前予約は必要です。",
    ],
    host: {
      name: "山田葉子",
      bio: "松山市在住の俳人。地域の俳句会で指導者として活動しています。",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity3",
    title: "四万十川でのカヌー体験と地域の食文化探訪",
    description:
      "四万十川の清流でカヌーを楽しみながら、地域の自然と食文化を体験できるプログラムです。地元ガイドと共に川下りを楽しみ、昼食には地元の食材を使った料理を堪能します。",
    communityId: "neo88",
    price: 6500,
    duration: 240,
    location: {
      name: "四万十川カヌーステーション",
      address: "高知県四万十市西土佐用井1111-11",
      prefecture: "高知県",
      city: "四万十市",
      lat: 33.2138,
      lng: 132.9339,
    },
    images: [
      "/images/activities/shimanto-canoe.jpg",
      "/images/activities/shimanto-river.jpg",
      "/images/activities/shimanto-lunch.jpg",
    ],
    capacity: 6,
    schedule: {
      startTime: "09:00",
      endTime: "13:00",
      daysOfWeek: [0, 6], // 土日のみ
    },
    timeSchedule: [
      {
        time: "09:00",
        description: "集合・安全講習",
      },
      {
        time: "09:30",
        description: "カヌー体験開始",
      },
      {
        time: "11:30",
        description: "地元食材の昼食",
      },
      {
        time: "13:00",
        description: "解散",
      },
    ],
    precautions: [
      "濡れても良い服装でお越しください。",
      "着替えをご持参ください。",
      "天候により中止となる場合があります。",
    ],
    host: {
      name: "中村太郎",
      bio: "四万十川で20年以上カヌーガイドを務めています。地域の自然と文化の案内人として活動中。",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity4",
    title: "阿波藍染め体験と徳島の伝統工芸探訪",
    description:
      "徳島の伝統工芸である阿波藍染めを体験できるプログラムです。藍染めの歴史や技法を学び、オリジナルの作品を作ることができます。地元の職人から直接指導を受けられる貴重な機会です。",
    communityId: "neo88",
    price: 4500,
    duration: 180,
    location: {
      name: "阿波藍染工房",
      address: "徳島県徳島市川内町平石若宮8-1",
      prefecture: "徳島県",
      city: "徳島市",
      lat: 34.0744,
      lng: 134.5725,
    },
    images: [
      "/images/activities/awa-indigo.jpg",
      "/images/activities/awa-dyeing.jpg",
      "/images/activities/awa-workshop.jpg",
    ],
    capacity: 8,
    schedule: {
      startTime: "13:00",
      endTime: "16:00",
      daysOfWeek: [2, 4, 6], // 火木土
    },
    timeSchedule: [
      {
        time: "13:00",
        description: "藍染めの歴史と技法の説明",
      },
      {
        time: "14:00",
        description: "染色体験",
      },
      {
        time: "15:30",
        description: "作品の仕上げ",
      },
      {
        time: "16:00",
        description: "解散",
      },
    ],
    precautions: [
      "汚れても良い服装でお越しください。",
      "エプロンは貸し出しいたします。",
      "作品の持ち帰りは当日可能です。",
    ],
    host: {
      name: "藤原恵子",
      bio: "阿波藍染めの技法を継承する職人。伝統工芸士として後進の育成にも力を入れています。",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity5",
    title: "讃岐うどん打ち体験と地域の食文化探訪",
    description:
      "香川県の伝統的な讃岐うどんの打ち方を学べる体験プログラムです。地元の職人から本場の技術を学び、自分で打ったうどんを試食できます。地域の食文化についても深く学べます。",
    communityId: "neo88",
    price: 4000,
    duration: 150,
    location: {
      name: "さぬきうどん学校",
      address: "香川県高松市牟礼町原631-8",
      prefecture: "香川県",
      city: "高松市",
      lat: 34.3266,
      lng: 134.1588,
    },
    images: [
      "/images/activities/udon.png",
      "/images/activities/udon-making.jpg",
      "/images/activities/udon-tasting.jpg",
    ],
    capacity: 10,
    schedule: {
      startTime: "10:00",
      endTime: "12:30",
      daysOfWeek: [1, 3, 5], // 月水金
    },
    timeSchedule: [
      {
        time: "10:00",
        description: "讃岐うどんの歴史と特徴の説明",
      },
      {
        time: "10:30",
        description: "うどん打ち体験",
      },
      {
        time: "11:45",
        description: "試食",
      },
      {
        time: "12:30",
        description: "解散",
      },
    ],
    precautions: [
      "エプロンをご持参ください。",
      "アレルギーをお持ちの方は事前にお申し出ください。",
      "体験で作ったうどんはお持ち帰りいただけます。",
    ],
    host: {
      name: "香川誠一",
      bio: "讃岐うどんの技術を継承する職人。40年以上の経験を活かし、伝統の技を分かりやすく伝えています。",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity6",
    title: "盆栽×Web3×地方創生トーク",
    description:
      "盆栽の聖地・高松で、伝統的な盆栽文化とWeb3技術を組み合わせた新しい地方創生の可能性について語り合います。盆栽職人とIT技術者が共に未来を描くユニークな対話の場です。",
    communityId: "neo88",
    price: 3000,
    duration: 120,
    location: {
      name: "高松盆栽センター",
      address: "香川県高松市鬼無町佐藤123",
      prefecture: "香川県",
      city: "高松市",
      lat: 34.3266,
      lng: 134.0588,
    },
    images: [
      "/images/activities/bonsai-web3.jpg",
      "/images/activities/bonsai-garden.jpg",
      "/images/activities/bonsai-workshop.jpg",
    ],
    capacity: 15,
    schedule: {
      startTime: "14:00",
      endTime: "16:00",
      daysOfWeek: [4], // 木曜のみ
    },
    timeSchedule: [
      {
        time: "14:00",
        description: "盆栽の歴史と現状",
      },
      {
        time: "14:45",
        description: "Web3と地方創生",
      },
      {
        time: "15:30",
        description: "ディスカッション",
      },
      {
        time: "16:00",
        description: "解散",
      },
    ],
    precautions: [
      "PCやスマートフォンをご持参ください。",
      "Web3の知識は不要です。",
      "盆栽園の見学も可能です。",
    ],
    host: {
      name: "木下智也",
      bio: "盆栽職人の家系に生まれ、IT技術を活用した伝統文化の発信に取り組んでいます。",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity7",
    title: "森の恵みで草木染め 上質オリジナルストール作り",
    description:
      "四国の秘境で、地元の「やまんば」から草木染めを学びます。森で採取した植物を使って、世界に一つだけのストールを作り上げる体験です。",
    communityId: "neo88",
    price: 5500,
    duration: 240,
    location: {
      name: "森の工房まほろば",
      address: "愛媛県西予市野村町野村12-34",
      prefecture: "愛媛県",
      city: "西予市",
      lat: 33.3666,
      lng: 132.6588,
    },
    images: [
      "/images/activities/forest-dyeing.jpg",
      "/images/activities/dyeing-workshop.jpg",
      "/images/activities/stole-making.jpg",
    ],
    capacity: 6,
    schedule: {
      startTime: "10:00",
      endTime: "14:00",
      daysOfWeek: [3, 4, 5], // 水木金
    },
    timeSchedule: [
      {
        time: "10:00",
        description: "森での素材採取",
      },
      {
        time: "11:30",
        description: "染料作り",
      },
      {
        time: "13:00",
        description: "染色作業",
      },
      {
        time: "14:00",
        description: "解散",
      },
    ],
    precautions: [
      "汚れても良い服装でお越しください。",
      "雨天決行です。",
      "軽装でお越しください。",
    ],
    host: {
      name: "森田はるか",
      bio: "20年以上草木染めを研究。地域の植物を活かした染色技法を確立しました。",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity8",
    title: "リノベーション進行中、空き家拝見ツアー",
    description:
      "吉野川市山川町でリノベーションした古民家、リノベーション中の空き家や旧店舗などを回ります。地域課題の一つである「空き家」を使った活動ツアーとなっており、町の歴史や環境をどう組み合わせてプロジェクトを作っているのか、どういう人たちが運営や作業を行っているのかリアル体験記として初開催します。",
    communityId: "neo88",
    price: 3000,
    duration: 180,
    location: {
      name: "リノベーション物件",
      address: "徳島県吉野川市山川町建石151",
      prefecture: "徳島県",
      city: "吉野川市",
      lat: 34.0666,
      lng: 134.2588,
    },
    images: [
      "/images/activities/kumu.jpg",
      "/images/activities/renovation-work.jpg",
      "/images/activities/renovation-house.jpg",
    ],
    capacity: 5,
    schedule: {
      startTime: "13:30",
      endTime: "16:30",
      daysOfWeek: [6],
    },
    timeSchedule: [
      {
        time: "13:30",
        description: "集合・オリエンテーション",
      },
      {
        time: "14:00",
        description: "リノベーション物件見学",
      },
      {
        time: "15:30",
        description: "意見交換会",
      },
      {
        time: "16:30",
        description: "解散",
      },
    ],
    precautions: [
      "動きやすい服装でお越しください",
      "歩きやすい靴をご着用ください",
      "雨天決行です",
    ],
    host: {
      name: "谷内尾 恵",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "多摩美術大学 大学院卒業後、フリーランスアーティストとして活動。2024年4月から一般社団法人ネイテック吉野川に市地域おこし協力隊としてkumu projectで地域活動を行っている。",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
  {
    id: "activity9",
    title: "NBQ -鍋＆BBQ- 体験",
    description:
      "徳島県美馬市脇町うだつの町並みエリア内にあるゲストハウス「のどけや」のもつ鍋。地元肉屋さんから仕入れしたもつ、地元農家さんから直接届いた野菜などの食材を使った鍋を堪能できます！",
    communityId: "neo88",
    price: 4500,
    duration: 120,
    location: {
      name: "のどけや本館",
      address: "徳島県美馬市脇町大字脇町117-1",
      prefecture: "徳島県",
      city: "美馬市",
      lat: 34.0744,
      lng: 134.1525,
    },
    images: [
      "/images/activities/nbq.jpg",
      "/images/activities/nbq-ingredients.jpg",
      "/images/activities/nbq-guesthouse.jpg",
    ],
    capacity: 4,
    schedule: {
      startTime: "18:00",
      endTime: "20:00",
      daysOfWeek: [5, 6],
    },
    timeSchedule: [
      {
        time: "18:00",
        description: "集合・食材説明",
      },
      {
        time: "18:30",
        description: "調理開始",
      },
      {
        time: "19:00",
        description: "食事タイム",
      },
      {
        time: "20:00",
        description: "解散",
      },
    ],
    precautions: [
      "アレルギーをお持ちの方は事前にお申し出ください",
      "お酒の持ち込みは可能です",
      "当日のキャンセルはご遠慮ください",
    ],
    host: {
      name: "柴田 義帆",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "ゲストハウスのどけや代表。大阪府門真市出身。10年前に徳島県美馬市へ移住してゲストハウス「のどけや」をオープン。ITの会社を立ち上げて、プラットフォーム開発やミートアップ、四国シェアサミット2019を主催。",
    },
    status: "open",
    createdAt: "2024-01-01T09:00:00+09:00",
    updatedAt: "2024-01-01T09:00:00+09:00",
  },
];

export const mockArticles: Article[] = [
  {
    id: "article-1",
    title: "地元の魅力を再発見！四万十川でのカヌー体験レポート",
    description:
      "四万十川でのカヌー体験を通じて、地域の自然の素晴らしさと、それを守り続ける地元の人々の思いに触れました。",
    content:
      "四万十川でのカヌー体験は、私にとって忘れられない思い出となりました...",
    type: "activity_report",
    thumbnail:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shimanto-kankou.com%2Fwp%2Fwp-content%2Fuploads%2F2017%2F07%2Fkawarakko_ph004.jpg&f=1&nofb=1&ipt=82fe845b6d6574ad4b95daa9bb2b42fb519a83bf92c4793663cfa4a61d13bc73&ipo=images",
    publishedAt: "2025-02-01T09:00:00Z",
    author: {
      name: "田中 美咲",
      image: "/placeholder.svg",
      bio: "地域の魅力を発信するライター",
    },
    relatedActivityId: "activity-1",
    tags: ["四万十川", "カヌー", "自然体験", "高知"],
    status: "published",
    createdAt: "2025-01-30T15:00:00Z",
    updatedAt: "2025-02-01T09:00:00Z",
  },
  {
    id: "article-2",
    title: "伝統を守り続ける職人の想い - 土佐打刃物職人 中村さんインタビュー",
    description:
      "400年以上の歴史を持つ土佐打刃物。その伝統を受け継ぎ、現代に活かす職人の想いに迫ります。",
    content:
      "土佐打刃物の伝統を受け継ぐ中村工房を訪ね、三代目の中村匠司さんにお話を伺いました...",
    type: "interview",
    thumbnail:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbaseec-img-mng.akamaized.net%2Fimages%2Fuser%2Fblog%2F1414651%2Fblog%2Fb11f85dddf9ddce18d2af08ffad68c13.jpg%3Fimformat%3Dgeneric%26q%3D90%26im%3DResize%2Cwidth%3D2048%2Ctype%3Ddownsize&f=1&nofb=1&ipt=816c3c01006454529db8301eadb46afd5ecee58080e52c6036d7b3e135ba13cc&ipo=images",
    publishedAt: "2025-02-03T10:00:00Z",
    author: {
      name: "山本 健一",
      image: "/placeholder.svg",
      bio: "伝統工芸研究家",
    },
    relatedUserId: "user-2",
    tags: ["土佐打刃物", "伝統工芸", "職人", "高知"],
    status: "published",
    createdAt: "2025-02-02T15:00:00Z",
    updatedAt: "2025-02-03T10:00:00Z",
  },
];

// mockOpportunitiesからEVENTとQUESTを分離
export const mockEvents = mockOpportunities.filter(
  (opportunity) => opportunity.type === "EVENT"
);

export const mockQuests = mockOpportunities.filter(
  (opportunity) => opportunity.type === "QUEST"
);
