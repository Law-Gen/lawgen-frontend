import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, User, Bot, Menu, History, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';
import { useRouter } from './AppRouter';
import BottomNavigation from './BottomNavigation';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isLoggedIn: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isLoggedIn }) => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isLoggedIn 
        ? 'Welcome back! How can I assist you with your legal questions today?' 
        : 'Hello! I\'m your AI legal assistant. I can help answer general legal questions, but remember that this is not a substitute for professional legal advice.',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatHistory = [
    'Family law consultation',
    'Business contract review',
    'Property rights question',
    'Employment dispute',
    'Divorce proceedings'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I understand your question. This is a simulated response. In a real application, this would connect to an AI legal assistant API. For specific legal advice, I recommend consulting with a qualified attorney.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Chat History Sidebar (logged-in only) */}
      <AnimatePresence>
        {isLoggedIn && showHistory && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-80 bg-card border-r border-border/50 flex flex-col"
          >
            <div className="p-4 border-b border-border/50">
              <h3 className="text-primary mb-4">{t('chatHistory')}</h3>
              <div className="space-y-2">
                {chatHistory.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto p-3 rounded-lg hover:bg-accent"
                    >
                      <History className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{item}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header 
          className="px-4 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-primary">Legal Assistant</h2>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Disclaimer (guest mode only) */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-4 py-3 bg-amber-50 border-b border-amber-200"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-700">{t('chatDisclaimer')}</p>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-primary mr-3' : 'bg-accent ml-3'
                  }`}>
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <User className="w-4 h-4 text-accent-foreground" />
                    )}
                  </div>
                  <Card className={`${
                    message.isBot 
                      ? 'bg-card border-border/50' 
                      : 'bg-primary text-primary-foreground border-primary'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.isBot ? 'text-muted-foreground' : 'text-primary-foreground/70'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Card className="bg-card border-border/50">
                    <CardContent className="p-3">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div 
          className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Sign In/Up prompt for guests */}
          {!isLoggedIn && (
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Want to save your conversations and access more features?
              </p>
              <div className="flex space-x-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('signin')}
                  className="rounded-full"
                  asChild
                >
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {t('signIn')}
                  </motion.button>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('signup')}
                  className="rounded-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {t('signUp')}
                  </motion.button>
                </Button>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('typeMessage')}
                className="pr-12 rounded-full border-border/50 focus:border-primary bg-input-background"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto rounded-full hover:bg-accent"
                title={t('voiceInput')}
              >
                <Mic className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50 hover:scale-105 transition-all duration-300"
              asChild
            >
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </Button>
          </div>
        </motion.div>

        {/* Bottom Navigation (logged-in only) */}
        {isLoggedIn && <BottomNavigation />}
      </div>
    </div>
  );
};

export default ChatInterface;