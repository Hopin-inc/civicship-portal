"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { useCommunityId } from "@/contexts/CommunityContext";

type CommunityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  };

function prefixHref(href: string | URL, communityId: string): string {
  const hrefString = typeof href === "string" ? href : href.toString();
  
  if (hrefString.startsWith("http://") || hrefString.startsWith("https://")) {
    return hrefString;
  }
  
  if (hrefString.startsWith("#")) {
    return hrefString;
  }
  
  if (hrefString.startsWith(`/${communityId}/`) || hrefString === `/${communityId}`) {
    return hrefString;
  }
  
  if (hrefString.startsWith("/")) {
    return `/${communityId}${hrefString}`;
  }
  
  return `/${communityId}/${hrefString}`;
}

export const CommunityLink = forwardRef<HTMLAnchorElement, CommunityLinkProps>(
  function CommunityLink({ href, ...props }, ref) {
    const communityId = useCommunityId();
    const prefixedHref = prefixHref(href as string | URL, communityId);

    return <Link ref={ref} href={prefixedHref} {...props} />;
  }
);

export default CommunityLink;
