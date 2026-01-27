"use client";

import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { forwardRef, AnchorHTMLAttributes } from "react";

type CommunityLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  };

/**
 * CommunityLink wraps next/link to automatically prepend the current communityId
 * to the href path. This ensures all internal navigation maintains the community context.
 *
 * Usage:
 * <CommunityLink href="/activities">Activities</CommunityLink>
 * // Renders as: <Link href="/neo88/activities">Activities</Link> (if communityId is "neo88")
 *
 * For external links or links that should not include communityId, use next/link directly.
 */
const CommunityLink = forwardRef<HTMLAnchorElement, CommunityLinkProps>(
  ({ href, children, ...props }, ref) => {
    const params = useParams();
    const communityId = params?.communityId as string | undefined;

    // Build the href with communityId prefix
    const buildHref = (originalHref: LinkProps["href"]): LinkProps["href"] => {
      if (!communityId) {
        return originalHref;
      }

      // Handle string href
      if (typeof originalHref === "string") {
        // Skip if already has communityId prefix or is external/absolute URL
        if (
          originalHref.startsWith(`/${communityId}`) ||
          originalHref.startsWith("http://") ||
          originalHref.startsWith("https://") ||
          originalHref.startsWith("//")
        ) {
          return originalHref;
        }

        // Ensure path starts with /
        const path = originalHref.startsWith("/") ? originalHref : `/${originalHref}`;
        return `/${communityId}${path}`;
      }

      // Handle UrlObject href
      if (typeof originalHref === "object" && originalHref !== null) {
        const { pathname, ...rest } = originalHref;
        if (pathname) {
          // Skip if already has communityId prefix
          if (pathname.startsWith(`/${communityId}`)) {
            return originalHref;
          }
          const newPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
          return {
            ...rest,
            pathname: `/${communityId}${newPathname}`,
          };
        }
        return originalHref;
      }

      return originalHref;
    };

    const finalHref = buildHref(href);

    return (
      <Link ref={ref} href={finalHref} {...props}>
        {children}
      </Link>
    );
  }
);

CommunityLink.displayName = "CommunityLink";

export default CommunityLink;
