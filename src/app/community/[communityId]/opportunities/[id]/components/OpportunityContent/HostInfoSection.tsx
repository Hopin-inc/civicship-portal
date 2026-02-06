import ArticleCard from "@/app/community/[communityId]/articles/components/Card";
import { OpportunityHost } from "@/components/domains/opportunities/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { AppLink } from "@/lib/navigation";

export const HostInfoSection = ({ host, hostLabel }: { host: OpportunityHost, hostLabel: string }) => {
    if (!host) return null;
  
    return (
      <section className="pt-6 pb-8 mt-0 bg-background-hover -mx-4 px-4">
        <h2 className="text-display-md text-foreground mb-4">{hostLabel}</h2>
        <div className="rounded-xl flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {host.id ? (
              <AppLink href={`/users/${host.id}`} className="flex-shrink-0">
                <Avatar className="w-16 h-16 mt-1">
                  <AvatarImage src={host.image ?? PLACEHOLDER_IMAGE} alt={host.name || "案内人"} />
                  <AvatarFallback>{host.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </AppLink>
            ) : (
              <div className="flex-shrink-0">
                <Avatar className="w-16 h-16 mt-1">
                  <AvatarImage src={host.image ?? PLACEHOLDER_IMAGE} alt={host.name || "案内人"} />
                  <AvatarFallback>{host.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
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