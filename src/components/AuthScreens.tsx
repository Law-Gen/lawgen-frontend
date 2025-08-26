import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';

interface AuthScreenProps {
  mode: 'signin' | 'signup' | 'forgot-password' | 'reset-password';
}

const AuthScreens: React.FC<AuthScreenProps> = ({ mode }) => {
  const { t } = useLanguage();
  const { navigate, setIsLoggedIn } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const getTitle = () => {
    switch (mode) {
      case 'signin': return t('signIn');
      case 'signup': return t('signUp');
      case 'forgot-password': return t('forgotPassword');
      case 'reset-password': return t('resetPassword');
      default: return t('signIn');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    if (mode === 'signin' || mode === 'signup') {
      setIsLoggedIn(true);
      navigate('chat-logged-in');
    } else if (mode === 'forgot-password') {
      navigate('reset-password');
    } else {
      navigate('signin');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          onClick={() => navigate(mode === 'reset-password' ? 'forgot-password' : 'landing')}
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
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div 
                className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
              >
                <span className="text-primary-foreground text-xl">L</span>
              </motion.div>
              <h1 className="text-2xl text-primary mb-2">{getTitle()}</h1>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Email Field */}
              {(mode === 'signin' || mode === 'signup' || mode === 'forgot-password') && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 rounded-xl border-border/50 focus:border-primary bg-input-background"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Field */}
              {(mode === 'signin' || mode === 'signup' || mode === 'reset-password') && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 rounded-xl border-border/50 focus:border-primary bg-input-background"
                      placeholder="••••••••"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Confirm Password Field */}
              {(mode === 'signup' || mode === 'reset-password') && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 rounded-xl border-border/50 focus:border-primary bg-input-background"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  size="lg"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getTitle()}
                  </motion.span>
                </Button>
              </motion.div>

              {/* Additional Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center space-y-3"
              >
                {mode === 'signin' && (
                  <>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => navigate('forgot-password')}
                      className="text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      {t('forgotPassword')}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => navigate('signup')}
                        className="text-primary hover:text-primary/80 p-0 h-auto"
                      >
                        {t('signUp')}
                      </Button>
                    </div>
                  </>
                )}
                
                {mode === 'signup' && (
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => navigate('signin')}
                      className="text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      {t('signIn')}
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreens;