"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { translations, type Translations } from "@/i18n";

export type Language = "en" | "am" | "om" | "ti";

export const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "am", label: "Amharic", nativeLabel: "\u12A0\u121B\u122D\u129B" },
  { code: "om", label: "Oromiffa", nativeLabel: "Afaan Oromoo" },
  { code: "ti", label: "Tigrigna", nativeLabel: "\u1275\u130D\u122D\u129B" },
];

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  mounted: boolean;
  t: <K extends keyof Translations>(section: K) => Translations[K];
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("tenadam-lang") as Language | null;
    if (stored && languages.some((l) => l.code === stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("tenadam-lang", lang);
  }, []);

  const t = useCallback(
    (section: keyof Translations) => translations[language][section],
    [language]
  ) as LanguageContextType["t"];

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, mounted, t } },
    children
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
