import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Screen = 
  | 'landing'
  | 'onboarding'
  | 'signin'
  | 'signup'
  | 'forgot-password'
  | 'reset-password'
  | 'chat-guest'
  | 'chat-logged-in'
  | 'legal-aid'
  | 'categories'
  | 'category-detail'
  | 'quiz-home'
  | 'quiz-questions'
  | 'quiz-results'
  | 'profile'
  | 'subscription'
  | 'admin-dashboard';

interface AppRouterContextType {
  currentScreen: Screen;
  navigate: (screen: Screen, data?: any) => void;
  screenData: any;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AppRouterContext = createContext<AppRouterContextType | undefined>(undefined);

export const AppRouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [screenData, setScreenData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    setScreenData(data);
  };

  return (
    <AppRouterContext.Provider value={{ 
      currentScreen, 
      navigate, 
      screenData, 
      isLoggedIn, 
      setIsLoggedIn 
    }}>
      {children}
    </AppRouterContext.Provider>
  );
};

export const useRouter = (): AppRouterContextType => {
  const context = useContext(AppRouterContext);
  if (!context) {
    throw new Error('useRouter must be used within an AppRouterProvider');
  }
  return context;
};