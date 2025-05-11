import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import xss from "xss";

const xssOptions = {
  whiteList: {
    h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
    p: [], a: ["href"], strong: [], em: [],
    ul: [], ol: [], li: [], blockquote: [],
    code: [], pre: [], img: ["src", "alt"],
    table: [], thead: [], tbody: [], tr: [], th: [], td: [],
  },
};

/**
 * Converts markdown to sanitized HTML
 * @param markdown - Markdown text to convert
 * @returns Sanitized HTML string
 */
export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return xss(String(result), xssOptions);
};
