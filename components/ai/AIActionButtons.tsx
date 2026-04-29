import { Button } from "@/components/ui/button";

type AIActionButtonsProps = {
  onPrimary: () => void;
  onSecondary: () => void;
  onTertiary?: () => void;
  primaryLabel: string;
  secondaryLabel: string;
  tertiaryLabel?: string;
};

export function AIActionButtons({
  onPrimary,
  onSecondary,
  onTertiary,
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
}: AIActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onPrimary} className="rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
        {primaryLabel}
      </Button>
      <Button onClick={onSecondary} variant="outline" className="rounded-xl border-[#CBD5E1] bg-white text-[#334155]">
        {secondaryLabel}
      </Button>
      {tertiaryLabel && onTertiary && (
        <Button onClick={onTertiary} variant="ghost" className="rounded-xl text-[#2563EB]">
          {tertiaryLabel}
        </Button>
      )}
    </div>
  );
}
