import { Card, CardHeader } from "@/components/ui/card";
import { Copy, Info, ExternalLink, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { truncateText, shortenMiddle } from "@/utils/stringUtils";
import { InfoCardProps } from "@/types";
import CommunityLink from "@/components/navigation/CommunityLink";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("コピーしました");
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    toast.error("コピーに失敗しました");
  }
};

const WarningDisplay = ({ warningText }: { warningText: string }) => (
  <div className="flex items-center gap-1">
    <Info className="w-4 h-4 text-warning" />
    <span className="text-label-sm whitespace-pre-wrap text-center">
      {warningText}
    </span>
  </div>
);

const ActionButtons = ({
  showCopy,
  copyData,
  label,
  secondaryLabel
}: {
  showCopy?: boolean;
  copyData?: string;
  label: string;
  secondaryLabel?: string;
}) => (
  <>
    {showCopy && copyData && (
      <button
        onClick={() => copyToClipboard(copyData, secondaryLabel || label)}
        className="flex items-center hover:opacity-70 transition-opacity"
        aria-label={`${secondaryLabel || label}をコピー`}
      >
        <Copy className="w-4 h-4 mr-1" />
      </button>
    )}
  </>
);

const ExternalLinkButton = ({
  externalLink,
  label,
  secondaryLabel
}: {
  externalLink?: { url: string; text: string };
  label: string;
  secondaryLabel?: string;
}) => (
  <>
    {externalLink && (
      <CommunityLink
        href={externalLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-70 transition-opacity ml-1"
        aria-label={`${secondaryLabel || label}の詳細を開く`}
      >
        <ExternalLink className="w-4 h-4" />
      </CommunityLink>
    )}
  </>
);

export const InfoCard = ({
  label,
  value,
  showCopy = false,
  copyData,
  externalLink,
  internalLink,
  isWarning = false,
  secondaryValue,
  secondaryLabel,
  warningText,
  showTruncate = true,
  truncatePattern,
  truncateHead,
  truncateTail,
  valueAlign = 'right',
  layout = 'horizontal',
  fallbackText
}: InfoCardProps) => {
  const t = useTranslations();

  if (!label) {
    console.warn('InfoCard: label is required');
    return null;
  }

  const hasSecondaryContent = secondaryValue || warningText;

  let displayValue = value;
  if (showTruncate && value) {
    if (truncatePattern === 'middle' && truncateHead !== undefined && truncateTail !== undefined) {
      displayValue = shortenMiddle(value, truncateHead, truncateTail);
    } else {
      displayValue = truncateText(value, 15, truncatePattern);
    }
  }

  const renderValue = (content: React.ReactNode, className?: string) => {
    if (internalLink) {
      return (
        <CommunityLink
          href={internalLink}
          className={cn('flex items-center gap-1 hover:underline', className)}
          aria-label={`${label}の詳細ページへ移動`}
        >
          {content}
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </CommunityLink>
      );
    }
    return <span className={className}>{content}</span>;
  };

  if (layout === 'vertical') {
    const content = displayValue == null || displayValue === '' ? (fallbackText ?? t('common.noData')) : displayValue;
    return (
      <Card className="rounded-2xl border border-gray-200 bg-card shadow-none">
        <CardHeader className="flex flex-col gap-1 py-4 px-6">
          <div className="text-gray-400 text-xs">
            {label}
          </div>
          <div className="text-sm text-black font-bold whitespace-pre-wrap break-words text-left">
            {renderValue(content)}
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-gray-200 bg-card shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 py-4 px-6">
        <div className="text-gray-400 text-xs whitespace-pre-wrap shrink-0">
          {label}
        </div>
        {hasSecondaryContent ? (
          <div className={`flex-1 flex flex-col break-words ${valueAlign === 'left' ? 'items-start text-left' : 'items-end text-right'}`}>
            <div className="text-sm text-black font-bold flex items-center">
              {renderValue(displayValue)}
              <ExternalLinkButton
                externalLink={externalLink}
                label={label}
                secondaryLabel={secondaryLabel}
              />
            </div>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              {isWarning && warningText && <WarningDisplay warningText={warningText} />}
              <ActionButtons
                showCopy={showCopy}
                copyData={copyData}
                label={label}
                secondaryLabel={secondaryLabel}
              />
              {secondaryValue && (
                <span>{truncateText(secondaryValue, 15, truncatePattern)}</span>
              )}
            </div>
          </div>
        ) : (
          <div className={`flex-1 flex items-center text-gray-400 text-sm ${valueAlign === 'left' ? 'justify-start text-left' : 'justify-end text-right'}`}>
            {isWarning && warningText && <WarningDisplay warningText={warningText} />}
            <ActionButtons
              showCopy={showCopy}
              copyData={copyData}
              label={label}
              secondaryLabel={secondaryLabel}
            />
            {renderValue(
              displayValue == null || displayValue === '' ? (fallbackText ?? t('common.noData')) : displayValue,
              `break-words ${isWarning ? "text-gray-400" : "font-bold text-black"}`
            )}
            <ExternalLinkButton
              externalLink={externalLink}
              label={label}
              secondaryLabel={secondaryLabel}
            />
          </div>
        )}
      </CardHeader>
    </Card>
  );
};
