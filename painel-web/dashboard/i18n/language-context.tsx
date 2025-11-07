"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import ptTranslations from "./translations/pt.json";
import enTranslations from "./translations/en.json";
import esTranslations from "./translations/es.json";

type Language = "pt" | "en" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string | string[];
};

const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>("pt");

  useEffect(() => {
    // Tenta recuperar o idioma salvo no localStorage
    const savedLanguage = localStorage.getItem("hywork-language") as Language | null;
    if (savedLanguage && ["pt", "en", "es"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Detecta o idioma do navegador
      const browserLanguage = navigator.language.split("-")[0] as Language;
      if (["pt", "en", "es"].includes(browserLanguage)) {
        setLanguageState(browserLanguage);
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("hywork-language", newLanguage);
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // Tratamento especial para arrays conhecidos
    if (key.includes("features") || key.includes("categories")) {
      return Array.isArray(value) ? value : [value];
    }

    return value;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};
