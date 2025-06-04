import React from "react";
import LinkifyIt from "linkify-it";
import { useReadMore } from "@/hooks/useReadMore";
import { Button } from "@/components/ui/button";

const INITIAL_DISPLAY_LINES = 6;

const phoneRegex = /0\d{1,4}-\d{1,4}-\d{3,4}|0\d{9,10}/g;

const linkify = new LinkifyIt();
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

const renderWithLinks = (text: string): React.ReactNode[] => {
  const matches = linkify.match(text);
  if (!matches) return [text];

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (lastIndex < match.index) {
      elements.push(text.slice(lastIndex, match.index));
    }
    elements.push(
      <a
        key={match.index}
        href={match.url}
        target={match.schema === "tel:" ? undefined : "_blank"}
        rel={match.schema === "tel:" ? undefined : "noopener noreferrer"}
        className="text-blue-600 underline hover:text-blue-800 break-words"
      >
        {match.raw}
      </a>,
    );
    lastIndex = match.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
};

export const ActivityBodySection = ({ body }: { body: string }) => {
  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: body,
    maxLines: INITIAL_DISPLAY_LINES,
  });

  return (
    <section className="pt-6 pb-8 mt-0 max-w-mobile-l">
      <h2 className="text-display-md text-foreground mb-4">体験できること</h2>
      <div className="relative">
        <p
          ref={textRef}
          className="text-body-md text-foreground whitespace-pre-wrap transition-all duration-300"
          style={getTextStyle()}
        >
          {renderWithLinks(body)}
        </p>

        {showReadMore && !expanded && (
          <div className="absolute bottom-0 left-0 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="relative flex justify-center pt-8">
              <Button
                variant="tertiary"
                size="sm"
                onClick={toggleExpanded}
                className="bg-white px-6"
              >
                <span className="text-label-sm font-bold">もっと見る</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
