import LinkifyIt from "linkify-it";

const phoneRegex = /0\d{1,4}-\d{1,4}-\d{3,4}|0\d{9,10}/g;

export const linkify = new LinkifyIt();
linkify.add("0", {
  validate: function (text, pos) {
    const target = "0" + text.slice(pos);
    const match = target.match(phoneRegex);
    if (match) return match[0].length - 1;
    return 0;
  },
  normalize: function (match) {
    match.url = "tel:" + match.raw.replace(/-/g, "");
  },
});