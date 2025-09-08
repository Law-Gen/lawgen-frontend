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
  test_legal_knowledge: {
    en: "Test your legal knowledge",
    am: "የህግ እውቀትዎን ይፈትሹ",
  },
  back_to_quizzes: { en: "Back to quizzes", am: "ወደ ኩዊዝ ተመለስ" },

  nav_chat: { en: "Chat", am: "ውይይት" },
  nav_categories: { en: "Categories", am: "ምድቦች" },
  nav_quiz: { en: "Quiz", am: "ፈተና" },
  nav_profile: { en: "Profile", am: "መገለጫ" },
  quiz_categories: { en: "Quiz Categories", am: "የፈተና ምድቦች" },
  test_knowledge: { en: "Test your legal knowledge", am: "የህግ እውቀትዎን ተመርመሩ" },
  explore_topics: { en: "Explore Topics", am: "ርዕሶችን ያስሱ" },
  menu: { en: "Menu", am: "ሜኑ" },
  legal_aid: { en: "LegalAid", am: "ህጋዊ እገዛ" },
  subscription: { en: "Subscription", am: "መዝገብ" },
  view_manage_subscription: {
    en: "View and manage your subscription plan",
    am: "የመዝገብ እቅድዎን ይመልከቱ እና ያስተካክሉ",
  },
  feedback: { en: "Feedback", am: "አስተያየት" },
  send: { en: "Send", am: "ላክ" },
  ask_legal_question: { en: "Ask a legal question...", am: "የህግ ጥያቄ ይጠይቁ..." },
  quizzes_label: { en: "quizzes", am: "ፈተናዎች" },
  // Add to your translations object in hooks/use-language.tsx

  legal_categories: { en: "Legal Categories", am: "የህግ ምድቦች" },
  explore_legal_topics: {
    en: "Explore legal topics by category",
    am: "የህግ ጉዳዮችን በምድብ ያስሱ",
  },
  // General
  my_profile: { en: "My Profile", am: "መግለጫዬ" },
  manage_account: {
    en: "Manage your account and preferences",
    am: "መለያዎን እና ቅንብሮችዎን ያስተካክሉ",
  },
  share_thoughts: {
    en: "Share your thoughts and help us improve",
    am: "አስተያየቶትን ያጋሩ እና ለማሻሻል ይርዱን",
  },
  sign_out: { en: "Sign Out", am: "ውጣ" },
  edit_profile: { en: "Edit Profile", am: "መግለጫዬን አስተካክል" },
  save_changes: { en: "Save Changes", am: "ለውጦችን አስቀምጥ" },
  cancel: { en: "Cancel", am: "ይቅር" },
  current_plan: { en: "Current Plan", am: "የአሁኑ እቃ" },
  upgrade: { en: "Upgrade", am: "አሻሽል" },
  most_popular: { en: "Most Popular", am: "በጣም የተወደደ" },
  loading_profile: { en: "Loading profile...", am: "መግለጫ በመጫን ላይ..." },
  no_profile_data: { en: "No profile data found.", am: "የመግለጫ መረጃ አልተገኘም።" },
  member_since: { en: "Member since", am: "አባል ከ" },
  security: { en: "Security", am: "ደህንነት" },
  change_password: { en: "Change Password", am: "የይለፍ ቃል ቀይር" },
  old_password: { en: "Old Password", am: "የድሮ የይለፍ ቃል" },
  new_password: { en: "New Password", am: "አዲስ የይለፍ ቃል" },
  update_password: { en: "Update Password", am: "የይለፍ ቃል አዘምን" },
  updating: { en: "Updating...", am: "በማዘምን ላይ..." },
  profile_information: { en: "Profile Information", am: "የመግለጫ መረጃ" },
  full_name: { en: "Full Name", am: "ሙሉ ስም" },
  email_address: { en: "Email Address", am: "ኢሜይል አድራሻ" },
  gender: { en: "Gender", am: "ፆታ" },
  male: { en: "Male", am: "ወንድ" },
  female: { en: "Female", am: "ሴት" },
  other: { en: "Other", am: "ሌላ" },
  birthdate: { en: "Birthdate", am: "የትውልድ ቀን" },
  language_preference: { en: "Language Preference", am: "የቋንቋ ምርጫ" },
  english: { en: "English", am: "እንግሊዝኛ" },
  amharic: { en: "Amharic", am: "አማርኛ" },
  keep_subscription: { en: "Keep Subscription", am: "የመዝገብ እቃዎን ይቆዩ" },
  cancel_subscription: { en: "Cancel Subscription", am: "የመዝገብ እቃ ሰርዝ" },
  cancel_subscription_title: { en: "Cancel Subscription", am: "የመዝገብ እቃ ሰርዝ" },
  cancel_subscription_desc: {
    en: "Are you sure you want to cancel your subscription? This action cannot be undone and will revert you to the free plan immediately.",
    am: "የመዝገብ እቃዎን ማቋረጥ እፈልጋለሁ ብለዋል? ይህ እርምጃ ሊቀየር አይችልም እና ወዲያውኑ ወደ ነፃ እቃ ይመለሳሉ።",
  },
  what_happens_when_cancel: {
    en: "What happens when you cancel:",
    am: "ሲሰርዙ የሚከሰቱ ነገሮች:",
  },
  subscription_end_immediately: {
    en: "Your subscription will end immediately",
    am: "የመዝገብ እቃዎ ወዲያውኑ ይቋረጣል",
  },
  downgraded_to_free: {
    en: "You'll be downgraded to the free plan",
    am: "ወደ ነፃ እቃ ትመለሳላችሁ",
  },
  access_lost: {
    en: "Access to premium features will be lost",
    am: "ወደ ፕሪሚየም ባህሪያት መድረሻ ይጠፋል",
  },
  can_resubscribe: {
    en: "You can resubscribe at any time",
    am: "በማንኛውም ጊዜ መመዝገብ ይችላሉ",
  },
  current_subscription: { en: "Current Subscription", am: "የአሁኑ የመዝገብ እቃ" },
  status: { en: "Status", am: "ሁኔታ" },
  features: { en: "Features", am: "ባህሪያት" },
  loading_plans: { en: "Loading plans...", am: "እቃዎችን በመጫን ላይ..." },
  cancellation_failed: { en: "Cancellation Failed", am: "ማቋረጥ አልተሳካም" },
  subscription_cancelled: {
    en: "Subscription Cancelled",
    am: "የመዝገብ እቃ ተሰርዟል",
  },
  profile_updated: { en: "Profile Updated", am: "መግለጫዎ ተዘምኗል" },
  failed_to_update_profile: {
    en: "Failed to update profile",
    am: "መግለጫዎን ማዘመን አልተሳካም",
  },
  // Add more as needed for your UI
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


