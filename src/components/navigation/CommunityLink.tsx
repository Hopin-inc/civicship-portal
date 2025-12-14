"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { useCommunityId } from "@/contexts/CommunityContext";
import { prefixPath } from "@/lib/communities/prefixPath";

type CommunityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  };

export const CommunityLink = forwardRef<HTMLAnchorElement, CommunityLinkProps>(
  function CommunityLink({ href, ...props }, ref) {
    const communityId = useCommunityId();
    const prefixedHref = prefixPath(href, communityId);

    return <Link ref={ref} href={prefixedHref} {...props} />;
  }
);

export default CommunityLink;
