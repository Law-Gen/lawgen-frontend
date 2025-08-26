import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Grid3X3, Brain, User } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';

const BottomNavigation: React.FC = () => {
  const { t } = useLanguage();
  const { navigate, currentScreen } = useRouter();

  const navItems = [
    {
      icon: MessageCircle,
      label: t('chat'),
      screen: 'chat-logged-in' as const,
      isActive: currentScreen === 'chat-logged-in'
    },
    {
      icon: Grid3X3,
      label: t('categories'),
      screen: 'categories' as const,
      isActive: currentScreen === 'categories' || currentScreen === 'category-detail'
    },
    {
      icon: Brain,
      label: t('quiz'),
      screen: 'quiz-home' as const,
      isActive: currentScreen.startsWith('quiz')
    },
    {
      icon: User,
      label: t('profile'),
      screen: 'profile' as const,
      isActive: currentScreen === 'profile' || currentScreen === 'subscription'
    }
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-card/80 backdrop-blur-sm border-t border-border/50 px-4 py-2"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => (
          <motion.div
            key={item.screen}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center space-y-1 p-3 h-auto min-w-0 transition-all duration-300 ${
                item.isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
              asChild
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={item.isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className={`w-5 h-5 ${item.isActive ? 'text-primary' : ''}`} />
                </motion.div>
                <span className={`text-xs ${item.isActive ? 'text-primary' : ''}`}>
                  {item.label}
                </span>
                {item.isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;