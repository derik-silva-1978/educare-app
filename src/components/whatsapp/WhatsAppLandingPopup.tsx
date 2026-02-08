import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, Loader2 } from 'lucide-react';

const WHATSAPP_PHONE = '559192018206';
const API_URL = import.meta.env.VITE_API_URL || '';

const WHATSAPP_ICON = (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.908 15.908 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.614c-.39 1.1-1.932 2.014-3.178 2.28-.852.18-1.964.324-5.71-1.228-4.798-1.986-7.882-6.85-8.122-7.17-.23-.318-1.932-2.572-1.932-4.904 0-2.332 1.222-3.478 1.656-3.952.39-.428 1.03-.62 1.644-.62.198 0 .376.01.536.018.474.02.712.048 1.024.792.39.928 1.34 3.26 1.458 3.498.12.24.24.558.08.876-.148.328-.278.474-.518.748-.24.274-.468.484-.708.778-.22.258-.468.534-.194.998.274.456 1.218 2.01 2.616 3.256 1.798 1.6 3.314 2.096 3.784 2.326.348.17.762.14 1.048-.17.364-.398.816-1.058 1.274-1.71.328-.464.74-.522 1.12-.352.386.16 2.442 1.152 2.862 1.362.42.21.7.316.802.49.1.172.1 1.01-.29 2.11z"/>
  </svg>
);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'O que é o Educare+?',
  'Como funciona a Jornada do Desenvolvimento?',
  'Quais são os planos disponíveis?',
  'Como o TitiNauta pode me ajudar?',
];

const WhatsAppLandingPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && !isOpen) {
      const hintTimer = setTimeout(() => setShowHint(true), 4000);
      return () => clearTimeout(hintTimer);
    } else {
      setShowHint(false);
    }
  }, [isVisible, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${API_URL}/api/public/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: history,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.success
          ? data.answer
          : 'Desculpe, não consegui processar sua pergunta no momento. Tente novamente ou fale conosco pelo WhatsApp.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Não foi possível conectar ao assistente. Tente novamente em instantes ou fale conosco pelo WhatsApp.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleWhatsApp = () => {
    const userMessages = messages.filter(m => m.role === 'user');
    let text: string;
    if (userMessages.length > 0) {
      const topics = userMessages.map(m => m.content).slice(-3).join('; ');
      text = `Olá! Vim do site do Educare+ e gostaria de saber mais. Conversei pelo chat sobre: ${topics}`;
    } else {
      text = 'Olá! Vim do site do Educare+ e gostaria de saber mais sobre a plataforma.';
    }
    if (text.length > 250) {
      text = text.substring(0, 247) + '...';
    }
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Olá! Sou o assistente virtual do **Educare+**. Posso tirar suas dúvidas sobre a plataforma, planos, funcionalidades e muito mais. Como posso ajudar?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const formatContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {showHint && !isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 px-4 py-3 max-w-[230px]"
              >
                <button
                  onClick={() => setShowHint(false)}
                  className="absolute -top-2 -right-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                </button>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Tem dúvidas? Converse com nosso assistente!
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Atendimento online via IA
                </p>
                <div className="absolute bottom-0 right-8 translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-white dark:bg-gray-800 border-r border-b border-gray-100 dark:border-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-[350px] sm:w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
                style={{ maxHeight: 'min(520px, calc(100vh - 120px))' }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3.5 flex items-center gap-3 flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm">Assistente Educare+</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-blue-100 text-xs">Online</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-800/50" style={{ minHeight: '200px' }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600 rounded-bl-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{formatContent(msg.content)}</p>
                        <span className={`text-[10px] float-right mt-1 ${
                          msg.role === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {messages.length <= 1 && !isLoading && (
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1.5">
                      Perguntas frequentes:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-xs px-2.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="px-3 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                  <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Digite sua pergunta..."
                      disabled={isLoading}
                      maxLength={500}
                      className="flex-1 text-sm px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white flex items-center justify-center transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </form>
                </div>

                <div className="px-3 pb-3 bg-white dark:bg-gray-900 flex-shrink-0">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Prefere falar no WhatsApp?
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl"
                >
                  💬
                </motion.div>
              )}
            </AnimatePresence>

            {!isOpen && (
              <>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">1</span>
                </span>
                <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppLandingPopup;
