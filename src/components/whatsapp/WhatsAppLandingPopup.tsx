import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowRight } from 'lucide-react';

const WHATSAPP_PHONE = '559192018206';

const WHATSAPP_ICON = (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.908 15.908 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.614c-.39 1.1-1.932 2.014-3.178 2.28-.852.18-1.964.324-5.71-1.228-4.798-1.986-7.882-6.85-8.122-7.17-.23-.318-1.932-2.572-1.932-4.904 0-2.332 1.222-3.478 1.656-3.952.39-.428 1.03-.62 1.644-.62.198 0 .376.01.536.018.474.02.712.048 1.024.792.39.928 1.34 3.26 1.458 3.498.12.24.24.558.08.876-.148.328-.278.474-.518.748-.24.274-.468.484-.708.778-.22.258-.468.534-.194.998.274.456 1.218 2.01 2.616 3.256 1.798 1.6 3.314 2.096 3.784 2.326.348.17.762.14 1.048-.17.364-.398.816-1.058 1.274-1.71.328-.464.74-.522 1.12-.352.386.16 2.442 1.152 2.862 1.362.42.21.7.316.802.49.1.172.1 1.01-.29 2.11z"/>
  </svg>
);

interface QuickOption {
  id: string;
  label: string;
  emoji: string;
  message: string;
}

const quickOptions: QuickOption[] = [
  {
    id: 'conhecer',
    label: 'Quero conhecer a plataforma',
    emoji: '🌟',
    message: 'Olá! Vim do site do Educare+ e gostaria de conhecer melhor a plataforma. Podem me apresentar?'
  },
  {
    id: 'demo',
    label: 'Agendar uma demonstração',
    emoji: '📋',
    message: 'Olá! Vim do site do Educare+ e gostaria de agendar uma demonstração da plataforma!'
  },
  {
    id: 'precos',
    label: 'Saber sobre planos e preços',
    emoji: '💰',
    message: 'Olá! Vim do site do Educare+ e gostaria de saber mais sobre os planos e preços disponíveis.'
  },
  {
    id: 'duvidas',
    label: 'Tenho dúvidas',
    emoji: '❓',
    message: 'Olá! Vim do site do Educare+ e tenho algumas dúvidas sobre a plataforma. Podem me ajudar?'
  }
];

const WhatsAppLandingPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && !isOpen) {
      const hintTimer = setTimeout(() => {
        setShowHint(true);
      }, 4000);
      return () => clearTimeout(hintTimer);
    } else {
      setShowHint(false);
    }
  }, [isVisible, isOpen]);

  const handleOptionClick = (option: QuickOption) => {
    const encoded = encodeURIComponent(option.message);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  const handleDirectChat = () => {
    const msg = encodeURIComponent('Olá! Vim do site do Educare+ e gostaria de conversar com vocês.');
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');
    setIsOpen(false);
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
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 px-4 py-3 max-w-[220px]"
              >
                <button
                  onClick={() => setShowHint(false)}
                  className="absolute -top-2 -right-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                </button>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Fale com a gente pelo WhatsApp!
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Estamos prontos para ajudar
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
                className="w-[340px] sm:w-[360px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-[#075E54] px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-2 flex-shrink-0">
                    <div className="w-6 h-6 text-white">
                      {WHATSAPP_ICON}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm">Educare+ My Ch@t</h3>
                    <p className="text-green-200 text-xs">Online agora</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-[#ECE5DD] dark:bg-gray-800 px-4 py-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg rounded-tl-none px-4 py-3 shadow-sm max-w-[85%] relative">
                    <div className="absolute -top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white dark:border-t-gray-700 border-l-[8px] border-l-transparent" />
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      Olá! Sou o assistente do <strong>Educare+</strong>. Como posso ajudar você hoje?
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 float-right mt-1">agora</span>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-2">
                    Escolha um assunto:
                  </p>
                  {quickOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 transition-all group"
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span className="flex-1">{option.label}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-green-600 dark:text-green-400" />
                    </button>
                  ))}
                </div>

                <div className="px-4 pb-4 bg-white dark:bg-gray-900">
                  <button
                    onClick={handleDirectChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    Iniciar conversa direta
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
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
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
                  key="whatsapp"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-7 h-7"
                >
                  {WHATSAPP_ICON}
                </motion.div>
              )}
            </AnimatePresence>

            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">1</span>
              </span>
            )}

            {!isOpen && (
              <>
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppLandingPopup;
