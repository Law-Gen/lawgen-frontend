import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';

const OnboardingScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleContinue = () => {
    if (consentAccepted) {
      navigate('chat-guest');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header 
        className="px-4 py-6 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('landing')}
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo Animation */}
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-primary-foreground text-2xl">L</span>
              </div>
              <h1 className="text-2xl text-primary mb-2">{t('welcome')}</h1>
              <p className="text-muted-foreground">{t('welcomeText')}</p>
            </motion.div>

            {/* Consent Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="consent"
                    checked={consentAccepted}
                    onCheckedChange={setConsentAccepted}
                    className="mt-1"
                  />
                  <label 
                    htmlFor="consent" 
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    {t('consent')}
                  </label>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: consentAccepted ? 1 : 0.5, 
                  scale: consentAccepted ? 1 : 0.95 
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleContinue}
                  disabled={!consentAccepted}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  <motion.span
                    animate={consentAccepted ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    {t('continue')}
                  </motion.span>
                  {consentAccepted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="ml-2"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;