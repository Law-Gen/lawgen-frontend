import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';
import BottomNavigation from './BottomNavigation';

const CategoryDetailScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigate, screenData } = useRouter();
  
  if (!screenData?.category) {
    navigate('categories');
    return null;
  }

  const { category } = screenData;

  const relatedResources = [
    {
      title: 'Legal Aid Organizations',
      description: 'Find local organizations providing free legal assistance',
      type: 'directory'
    },
    {
      title: 'Court Self-Help Center',
      description: 'Resources for representing yourself in court',
      type: 'resource'
    },
    {
      title: 'Legal Forms Library',
      description: 'Download common legal forms and documents',
      type: 'forms'
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
          onClick={() => navigate('categories')}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
            <category.icon className="w-4 h-4" />
          </div>
          <h1 className="text-xl text-primary">{category.title}</h1>
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto mb-20">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Overview
                  <Badge variant="secondary">{category.count} topics</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button 
                  onClick={() => navigate('chat-logged-in')}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Common Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.topics.map((topic: string, index: number) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-4 border-border/50 hover:bg-accent/50"
                        onClick={() => navigate('chat-logged-in')}
                      >
                        <div>
                          <p className="font-medium">{topic}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click to ask about this topic
                          </p>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Related Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedResources.map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <h4 className="font-medium text-primary">{resource.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    {index < relatedResources.length - 1 && (
                      <Separator className="mt-4" />
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

export default CategoryDetailScreen;