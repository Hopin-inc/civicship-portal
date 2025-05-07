import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from "@/components/ui/card";

interface Author {
  id: string;
  name: string;
  image: string | null;
}

interface ArticleCardProps {
  id: string;
  title: string;
  introduction: string;
  thumbnail: {
    url: string;
    alt: string;
  } | null;
  publishedAt: string;
  authors: Author[];
}

export default function ArticleCard({
  id,
  title,
  introduction,
  thumbnail,
  publishedAt,
  authors,
}: ArticleCardProps) {
  const mainAuthor = authors[0];
  const thumbnailUrl = thumbnail?.url || '';
  const authorImageUrl = mainAuthor?.image || '/images/default-avatar.jpg';

  return (
    <Link href={`/articles/${id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[16/9]">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {introduction}
          </p>
          <div className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
              <Image
                src={authorImageUrl}
                alt={mainAuthor?.name || '著者'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{mainAuthor?.name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(publishedAt), 'yyyy年MM月dd日')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}              