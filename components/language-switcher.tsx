"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/lib/locale-context";

type LanguageSwitcherProps = {
  withLabel?: boolean;
  className?: string;
};

export function LanguageSwitcher({
  withLabel = false,
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className={className}>
      {withLabel && (
        <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
          {t("language.switchLabel")}
        </label>
      )}
      <Select
        value={locale}
        onValueChange={(value) => setLocale(value === "am" ? "am" : "en")}
      >
        <SelectTrigger className="h-9 min-w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("language.english")}</SelectItem>
          <SelectItem value="am">{t("language.amharic")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

