import { Metadata } from "next";

const DEFAULT_TITLE = "NEO四国88祭";
const DEFAULT_DESCRIPTION =
  "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？";

const DEFAULT_ICONS: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico" },
    { url: "/images/favicon-16.png", type: "image/png", sizes: "16x16" },
    { url: "/images/favicon-32.png", type: "image/png", sizes: "32x32" },
    { url: "/images/favicon-48.png", type: "image/png", sizes: "48x48" },
  ],
};

const DEFAULT_OGP: Metadata["openGraph"] = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  url: "https://www.neo88.app",
  siteName: DEFAULT_TITLE,
  images: [
    {
      url: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
      width: 1200,
      height: 630,
      alt: DEFAULT_TITLE,
    },
  ],
  locale: "ja_JP",
  type: "website",
};

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_ICONS, DEFAULT_OGP };
