"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en from "@/locales/en.json";
import am from "@/locales/am.json";

type Locale = "en" | "am";

type TranslationValue = string | number | TranslationDictionary;
type TranslationDictionary = Record<string, TranslationValue>;

type Replacements = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Replacements) => string;
  get: <T = TranslationValue>(key: string) => T | undefined;
  formatDate: (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatNumber: (
    value: number,
    options?: Intl.NumberFormatOptions,
  ) => string;
  formatRelativeTime: (
    value: number,
    unit?: Intl.RelativeTimeFormatUnit,
  ) => string;
  formatPlural: (count: number, forms: Record<string, string>) => string;
};

const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  en,
  am,
};

const DEFAULT_LOCALE: Locale = "en";
const STORAGE_KEY = "smartprep.locale";

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function isDictionary(value: TranslationValue): value is TranslationDictionary {
  return typeof value === "object" && value !== null;
}

function getTranslationValue(key: string, locale: Locale): TranslationValue | undefined {
  const segments = key.split(".");
  let current: TranslationValue | undefined = TRANSLATIONS[locale];

  for (const segment of segments) {
    if (!current || !isDictionary(current)) {
      return undefined;
    }
    current = current[segment];
  }

  return current;
}

function applyReplacements(value: string, replacements?: Replacements): string {
  if (!replacements) {
    return value;
  }

  return Object.entries(replacements).reduce((acc, [matchKey, matchValue]) => {
    return acc.replaceAll(`{${matchKey}}`, String(matchValue));
  }, value);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLocale = window.localStorage.getItem(STORAGE_KEY) as
      | Locale
      | null;
    if (storedLocale && storedLocale in TRANSLATIONS) {
      setLocaleState(storedLocale);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const t = (key: string, replacements?: Replacements) => {
      const result = getTranslationValue(key, locale);
      if (result === undefined) {
        return key;
      }
      if (typeof result === "string" || typeof result === "number") {
        return applyReplacements(String(result), replacements);
      }
      return key;
    };

    const get = <T = TranslationValue>(key: string): T | undefined => {
      const result = getTranslationValue(key, locale);
      return result as T | undefined;
    };

    const formatDate = (
      value: Date | number | string,
      options?: Intl.DateTimeFormatOptions,
    ) => {
      const date =
        value instanceof Date ? value : new Date(value ?? Date.now());
      return new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-US", {
        ...options,
      }).format(date);
    };

    const formatNumber = (
      value: number,
      options?: Intl.NumberFormatOptions,
    ) => {
      return new Intl.NumberFormat(locale === "am" ? "am-ET" : "en-US", {
        ...options,
      }).format(value);
    };

    const formatRelativeTime = (
      value: number,
      unit: Intl.RelativeTimeFormatUnit = "day",
    ) => {
      return new Intl.RelativeTimeFormat(locale === "am" ? "am-ET" : "en-US", {
        numeric: "auto",
      }).format(value, unit);
    };

    const formatPlural = (count: number, forms: Record<string, string>) => {
      const rule = new Intl.PluralRules(locale === "am" ? "am-ET" : "en-US");
      const pluralCategory = rule.select(count);
      const template = forms[pluralCategory] ?? forms.other ?? "";
      return applyReplacements(template, { count });
    };

    return {
      locale,
      setLocale,
      t,
      get,
      formatDate,
      formatNumber,
      formatRelativeTime,
      formatPlural,
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

