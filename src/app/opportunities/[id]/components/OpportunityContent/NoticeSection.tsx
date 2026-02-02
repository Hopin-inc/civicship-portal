import IconWrapper from "@/components/shared/IconWrapper";
import { AlertCircle } from "lucide-react";
import { FC } from "react";
import { getNoticeItems } from "@/lib/communities/content";

export const NoticeSection: FC = () => {
    const noticeItems = getNoticeItems();

    return (
      <section className="pt-6 pb-8 mt-0 bg-background-hover -mx-4 px-4">
        <h2 className="text-display-md text-foreground mb-4">注意事項</h2>
        <div className="space-y-4">
          {noticeItems.map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <IconWrapper color="warning">
                <AlertCircle size={20} strokeWidth={2.5} />
              </IconWrapper>
              <p className={`text-body-md flex-1 ${index === 0 ? "font-bold" : ""}`}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };
