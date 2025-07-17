import React from "react";
import { useReadMore } from "@/hooks/useReadMore";
import { Button } from "@/components/ui/button";
import { renderWithLinks } from "../utils";
import { INITIAL_DISPLAY_LINES } from "../constants";

export const BodySection = ({ body }: { body: string }) => {
  const { textRef, expanded, showReadMore, toggleExpanded, getTextStyle } = useReadMore({
    text: body,
    maxLines: INITIAL_DISPLAY_LINES,
  });

  return (
    <section className="pt-6 pb-8 mt-0 max-w-mobile-l">
      <h2 className="text-display-md text-foreground mb-4">助けてもらいたいこと</h2>
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
