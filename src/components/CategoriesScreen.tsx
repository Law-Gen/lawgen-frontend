import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Scale, Building, Shield, Home, Users2, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';
import BottomNavigation from './BottomNavigation';

const CategoriesScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  const categories = [
    {
      icon: Users2,
      title: t('familyLaw'),
      description: 'Marriage, divorce, child custody, adoption',
      count: 24,
      color: 'bg-blue-50 text-blue-600',
      topics: [
        'Divorce proceedings',
        'Child custody',
        'Adoption process',
        'Prenuptial agreements',
        'Domestic violence',
        'Child support'
      ]
    },
    {
      icon: Building,
      title: t('businessLaw'),
      description: 'Contracts, partnerships, corporate law',
      count: 18,
      color: 'bg-green-50 text-green-600',
      topics: [
        'Business formation',
        'Contract disputes',
        'Intellectual property',
        'Employment law',
        'Tax compliance',
        'Mergers & acquisitions'
      ]
    },
    {
      icon: Shield,
      title: t('criminalLaw'),
      description: 'Defense, charges, court proceedings',
      count: 15,
      color: 'bg-red-50 text-red-600',
      topics: [
        'Criminal defense',
        'DUI/DWI',
        'White collar crimes',
        'Drug offenses',
        'Assault charges',
        'Appeals process'
      ]
    },
    {
      icon: Home,
      title: t('propertyLaw'),
      description: 'Real estate, landlord-tenant, property rights',
      count: 21,
      color: 'bg-amber-50 text-amber-600',
      topics: [
        'Real estate transactions',
        'Landlord-tenant disputes',
        'Property boundaries',
        'Zoning issues',
        'Construction law',
        'Property taxes'
      ]
    },
    {
      icon: Scale,
      title: 'Personal Injury',
      description: 'Accidents, medical malpractice, compensation',
      count: 12,
      color: 'bg-purple-50 text-purple-600',
      topics: [
        'Car accidents',
        'Medical malpractice',
        'Workplace injuries',
        'Product liability',
        'Slip and fall',
        'Insurance claims'
      ]
    },
    {
      icon: Briefcase,
      title: 'Employment Law',
      description: 'Workplace rights, discrimination, wages',
      count: 16,
      color: 'bg-indigo-50 text-indigo-600',
      topics: [
        'Wrongful termination',
        'Workplace discrimination',
        'Wage disputes',
        'Sexual harassment',
        'Workers compensation',
        'Employment contracts'
      ]
    }
  ];

  const handleCategoryClick = (category: any) => {
    navigate('category-detail', { category });
  };

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
        <h1 className="text-xl text-primary">Legal Categories</h1>
      </motion.header>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">
                          {category.count} topics
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg text-primary mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {category.topics.slice(0, 3).map((topic) => (
                        <Badge 
                          key={topic} 
                          variant="outline" 
                          className="text-xs border-border/50 bg-muted/30"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {category.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs border-border/50 bg-muted/30">
                          +{category.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CategoriesScreen;