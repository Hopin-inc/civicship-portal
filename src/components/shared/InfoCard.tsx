import { Card, CardHeader } from "@/components/ui/card";
import { Copy, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { truncateText } from "@/utils/stringUtils";
import { InfoCardProps } from "@/types";
import Link from "next/link";

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
    <Info className="w-4 h-4 text-[#EAB308]" />
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
      <Link
        href={externalLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-70 transition-opacity ml-1"
        aria-label={`${secondaryLabel || label}の詳細を開く`}
      >
        <ExternalLink className="w-4 h-4" />
      </Link>
    )}
  </>
);

export const InfoCard = ({ 
  label, 
  value, 
  showCopy = false, 
  copyData, 
  externalLink,
  isWarning = false,
  secondaryValue,
  secondaryLabel,
  warningText,
  showTruncate = true,
  truncatePattern = 'middle'
}: InfoCardProps) => {
  if (!label) {
    console.warn('InfoCard: label is required');
    return null;
  }

  const hasSecondaryContent = secondaryValue || warningText;
  const displayValue = showTruncate ? truncateText(value, 15, truncatePattern) : value;

  return (
    <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
        <div className="text-gray-400 text-xs whitespace-pre-wrap">
          {label}
        </div>
        {hasSecondaryContent ? (
          <div className="flex flex-col items-end">
            <div className="text-sm text-black font-bold flex items-center">
              {value}
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
          <div className="flex items-center text-gray-400 text-sm mt-1">
            {isWarning && warningText && <WarningDisplay warningText={warningText} />}
            <ActionButtons
              showCopy={showCopy}
              copyData={copyData}
              label={label}
              secondaryLabel={secondaryLabel}
            />
            <span className={isWarning ? "text-gray-400" : "font-bold text-black"}>
              {displayValue?.length === 0 ? "データが存在しません" : displayValue}
            </span>
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