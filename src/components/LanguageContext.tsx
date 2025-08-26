'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'am'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.chat': 'Chat',
    'nav.profile': 'Profile',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.forgot_password': 'Forgot Password?',
    'auth.no_account': "Don't have an account?",
    'auth.have_account': 'Already have an account?',
    
    // Legal
    'legal.consultation': 'Legal Consultation',
    'legal.assistance': 'Legal Assistance',
    'legal.categories': 'Legal Categories',
    'legal.chat': 'Legal Chat',
    'legal.resources': 'Legal Resources',
  },
  am: {
    // Navigation (Amharic)
    'nav.home': 'ዋና ገጽ',
    'nav.categories': 'ምድቦች',
    'nav.chat': 'ውይይት',
    'nav.profile': 'መገለጫ',
    'nav.signin': 'ግባ',
    'nav.signup': 'ተመዝገብ',
    
    // Common (Amharic)
    'common.loading': 'በመጫን ላይ...',
    'common.error': 'ስህተት ተከስቷል',
    'common.success': 'ተሳክቷል',
    'common.cancel': 'ሰርዝ',
    'common.save': 'አስቀምጥ',
    'common.delete': 'ሰርዝ',
    'common.edit': 'አርም',
    'common.close': 'ዝጋ',
    
    // Auth (Amharic)
    'auth.email': 'ኢሜይል',
    'auth.password': 'የይለፍ ቃል',
    'auth.signin': 'ግባ',
    'auth.signup': 'ተመዝገብ',
    'auth.forgot_password': 'የይለፍ ቃልዎን ረሳቹ?',
    'auth.no_account': 'መለያ የለዎትም?',
    'auth.have_account': 'መለያ አለዎት?',
    
    // Legal (Amharic)
    'legal.consultation': 'የህግ ምክር',
    'legal.assistance': 'የህግ እርዳታ',
    'legal.categories': 'የህግ ምድቦች',
    'legal.chat': 'የህግ ውይይት',
    'legal.resources': 'የህግ መረጃዎች',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}