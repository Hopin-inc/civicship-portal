import { linkify } from "..";

export const renderWithLinks = (text: string): React.ReactNode[] => {
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