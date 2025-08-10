import Link from "next/link";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { OpportunityHost } from "@/components/domains/opportunity/types";
import ArticleCard from "@/app/articles/components/Card";

export const HostInfoSection = ({ host }: { host: OpportunityHost }) => {
    if (!host) return null;
  
    return (
      <section className="pt-6 pb-8 mt-0 bg-background-hover -mx-4 px-4">
        <h2 className="text-display-md text-foreground mb-4">依頼人</h2>
        <div className="rounded-xl flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {host.id ? (
              <Link
                href={`/users/${host.id}`}
                className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
              >
                <Image
                  src={host.image || PLACEHOLDER_IMAGE}
                  alt={host.name || "案内者"}
                  fill
                  className="object-cover"
                />
              </Link>
            ) : (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={host.image || PLACEHOLDER_IMAGE}
                  alt={host.name || "案内者"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-title-sm font-bold mb-1 text-caption">
                <span className="text-display-sm mr-1 text-foreground">{host.name}</span>さん
              </h3>
              {host.bio && <p className="text-body-sm text-caption line-clamp-2">{host.bio}</p>}
            </div>
          </div>
          {host.interview && <ArticleCard article={host.interview} />}
        </div>
      </section>
    );
  };