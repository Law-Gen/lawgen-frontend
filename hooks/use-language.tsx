"use client";

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

type Language = "en" | "am";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const translations: Record<string, { en: string; am: string }> = {
  nav_chat: { en: "Chat", am: "ውይይት" },
  nav_categories: { en: "Categories", am: "ምድቦች" },
  nav_quiz: { en: "Quiz", am: "ፈተና" },
  nav_profile: { en: "Profile", am: "መገለጫ" },
  quiz_categories: { en: "Quiz Categories", am: "የፈተና ምድቦች" },
  test_knowledge: { en: "Test your legal knowledge", am: "የህግ እውቀትዎን ተመርመሩ" },
  explore_topics: { en: "Explore Topics", am: "ርዕሶችን ያስሱ" },
  menu: { en: "Menu", am: "ሜኑ" },
  legal_aid: { en: "LegalAid", am: "ህጋዊ እገዛ" },
  my_profile: { en: "My Profile", am: "መገለጫዬ" },
  manage_account: { en: "Manage your account and preferences", am: "መለያዎን እና ምርጫዎችን ያቀናብሩ" },
  subscription: { en: "Subscription", am: "መዝገብ" },
  view_manage_subscription: { en: "View and manage your subscription plan", am: "የመዝገብ እቅድዎን ይመልከቱ እና ያቀናብሩ" },
  feedback: { en: "Feedback", am: "አስተያየት" },
  share_thoughts: { en: "Share your thoughts and help us improve", am: "ሐሳቦችዎን ያካፍሉ እና እንዲበልጥ ይረዱን" },
  send: { en: "Send", am: "ላክ" },
  ask_legal_question: { en: "Ask a legal question...", am: "የህግ ጥያቄ ይጠይቁ..." },
  quizzes_label: { en: "quizzes", am: "ፈተናዎች" },
};

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load and persist language safely on the client
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("app_language") as Language) || null;
      if (saved) setLanguageState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("app_language", language);
      document.documentElement.setAttribute("lang", language);
    } catch {}
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key: string) => translations[key]?.[language] ?? key,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}


