import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crown, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';

const SubscriptionScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic legal information and limited AI chat',
      features: [
        '5 AI chat sessions per month',
        'Basic legal quizzes',
        'Limited legal categories',
        'Community support'
      ],
      buttonText: 'Current Plan',
      disabled: true,
      color: 'border-border'
    },
    {
      id: 'premium-monthly',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Unlimited access to all legal assistance features',
      features: [
        'Unlimited AI chat sessions',
        'Priority AI responses',
        'All legal categories & topics',
        'Advanced legal quizzes',
        'Legal document templates',
        'Email support',
        'Chat history backup'
      ],
      buttonText: 'Upgrade Now',
      disabled: false,
      color: 'border-primary bg-primary/5',
      popular: true
    },
    {
      id: 'premium-yearly',
      name: 'Premium Annual',
      price: '$99.99',
      period: 'per year',
      description: 'All premium features with 2 months free',
      features: [
        'Everything in Premium',
        'Save $19.89 per year',
        'Priority customer support',
        'Early access to new features',
        'Legal consultation credits',
        'Advanced analytics'
      ],
      buttonText: 'Best Value',
      disabled: false,
      color: 'border-amber-400 bg-amber-50',
      savings: 'Save 17%'
    }
  ];

  const handleSubscribe = (planId: string) => {
    // Simulate subscription process
    console.log('Subscribing to:', planId);
    // In a real app, this would integrate with a payment processor
    navigate('profile');
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
          onClick={() => navigate('profile')}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl text-primary">Upgrade to Premium</h1>
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl text-primary mb-2">Unlock Premium Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get unlimited access to AI legal assistance, advanced quizzes, and priority support
            </p>
          </motion.div>

          {/* Premium Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 text-amber-500 mr-2" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: '🚀',
                      title: 'Unlimited AI Chat',
                      description: 'Ask as many legal questions as you need'
                    },
                    {
                      icon: '⚡',
                      title: 'Priority Responses',
                      description: 'Get faster AI responses and support'
                    },
                    {
                      icon: '📚',
                      title: 'Complete Library',
                      description: 'Access all legal categories and resources'
                    },
                    {
                      icon: '🎯',
                      title: 'Advanced Quizzes',
                      description: 'Test knowledge with specialized quizzes'
                    },
                    {
                      icon: '📄',
                      title: 'Document Templates',
                      description: 'Download legal forms and templates'
                    },
                    {
                      icon: '💾',
                      title: 'Chat History',
                      description: 'Save and search your conversations'
                    }
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="text-center p-4"
                    >
                      <div className="text-2xl mb-2">{benefit.icon}</div>
                      <h4 className="font-medium text-primary mb-1">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                {plan.savings && (
                  <Badge className="absolute -top-2 right-4 bg-amber-500 text-white">
                    {plan.savings}
                  </Badge>
                )}
                
                <Card className={`h-full ${plan.color} border-2 transition-all duration-300`}>
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      {plan.id === 'premium-yearly' && <Star className="w-5 h-5 text-amber-500" />}
                      <span>{plan.name}</span>
                    </CardTitle>
                    <div className="py-4">
                      <div className="text-3xl text-primary mb-1">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.period}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + featureIndex * 0.05 }}
                          className="flex items-start space-x-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={plan.disabled}
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : plan.id === 'premium-yearly'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : ''
                      }`}
                      variant={plan.disabled ? 'outline' : 'default'}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-sm text-muted-foreground mb-20"
          >
            <p className="mb-2">🔒 Secure payment • Cancel anytime • 30-day money-back guarantee</p>
            <p>Join thousands of users who trust LegalAid for their legal information needs</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;