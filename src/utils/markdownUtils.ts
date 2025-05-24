import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import xss from "xss";
import remarkBreaks from "remark-breaks";

const xssOptions = {
  whiteList: {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    p: [],
    a: ["href"],
    strong: [],
    em: [],
    b: [],
    ul: [],
    ol: [],
    li: [],
    blockquote: [],
    code: [],
    pre: [],
    img: ["src", "alt"],
    table: [],
    thead: [],
    tbody: [],
    tr: [],
    th: [],
    td: [],
    del: [],
    ins: [],
    mark: [],
    sub: [],
    sup: [],
    abbr: ["title"], // 略語を追加、ツールチップを表示
    kbd: [], // キーボード入力
    cite: [], // 引用文献
    details: [], // 詳細要素
    summary: [], // 要約
    br: [],
  },
};

export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  const result = await unified()
    .use(remarkParse) // Markdownをパース
    .use(remarkGfm) // GFM（GitHub Flavored Markdown）対応
    .use(remarkBreaks)
    .use(remarkRehype, { allowDangerousHtml: true }) // MarkdownをHTMLに変換
    .use(rehypeStringify, { allowDangerousHtml: true }) // HTMLに変換
    .process(markdown);

  // HTMLをサニタイズして返す
  return xss(String(result), xssOptions);
};
