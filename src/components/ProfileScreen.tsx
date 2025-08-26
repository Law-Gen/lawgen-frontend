import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Settings, Crown, LogOut, Edit, Mail, Calendar, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';
import BottomNavigation from './BottomNavigation';

const ProfileScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigate, setIsLoggedIn } = useRouter();

  const userStats = [
    { label: 'Chats Started', value: '24', icon: '💬' },
    { label: 'Quizzes Taken', value: '8', icon: '🧠' },
    { label: 'Topics Explored', value: '15', icon: '📚' },
    { label: 'Questions Asked', value: '47', icon: '❓' }
  ];

  const menuItems = [
    {
      icon: Crown,
      title: 'Upgrade to Premium',
      description: 'Unlock advanced features and priority support',
      action: () => navigate('subscription'),
      color: 'text-amber-600'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'App preferences and notifications',
      action: () => {},
      color: 'text-muted-foreground'
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'View your learning milestones',
      action: () => {},
      color: 'text-green-600'
    },
    {
      icon: LogOut,
      title: 'Sign Out',
      description: 'Sign out of your account',
      action: () => {
        setIsLoggedIn(false);
        navigate('landing');
      },
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header 
        className="px-4 py-6 flex items-center bg-card/50 backdrop-blur-sm border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('chat-logged-in')}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl text-primary">{t('myProfile')}</h1>
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto mb-20">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl text-primary">John Doe</h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since March 2024</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Free Plan
                  </Badge>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('subscription')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {userStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="text-center p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-2xl text-primary mb-1">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-0">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={item.action}
                      className="w-full justify-start h-auto p-4 rounded-none hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <div className="text-left flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </Button>
                    {index < menuItems.length - 1 && (
                      <Separator />
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfileScreen;