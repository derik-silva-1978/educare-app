import { useState, useEffect, useRef, useCallback } from "react";

type MessageType = {
  id: number;
  text: string;
  sender: "bot" | "user";
  visible: boolean;
};

const TypingIndicator = () => (
  <div className="flex items-end mb-2">
    <div className="bg-white rounded-xl px-4 py-3 max-w-[80%] flex gap-1 items-center animate-slide-up">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

const WhatsAppSimulator = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showButtons, setShowButtons] = useState(false);
  const [buttonHighlight, setButtonHighlight] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showTypewriter, setShowTypewriter] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showButtons, showTyping, typewriterText, scrollToBottom]);

  const addMessage = useCallback((id: number, text: string, sender: "bot" | "user") => {
    setMessages((prev) => [...prev, { id, text, sender, visible: true }]);
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  const runSequence = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setMessages([]);
    setShowButtons(false);
    setButtonHighlight(false);
    setShowTyping(false);
    setTypewriterText("");
    setShowTypewriter(false);

    schedule(() => {
      addMessage(1, "Olá! 😊 Sou o TitiNauta, seu assistente no Educare+.\n\nSobre o que você quer falar agora? 💬", "bot");
    }, 500);

    schedule(() => {
      setShowButtons(true);
    }, 2000);

    schedule(() => {
      setButtonHighlight(true);
    }, 3500);

    schedule(() => {
      setShowButtons(false);
      addMessage(2, "👶 Sobre meu bebê", "user");
    }, 3800);

    schedule(() => {
      setShowTyping(true);
    }, 4500);

    schedule(() => {
      setShowTyping(false);
      addMessage(3, "Que bom falar sobre o seu bebê! 💜\n\nMe conta, qual sua dúvida ou preocupação? Estou aqui para ajudar com orientações baseadas na OMS e SBP.", "bot");
    }, 5500);

    const userMsg = "Meu bebê tem 8 meses e ainda não engatinha";
    schedule(() => {
      setShowTypewriter(true);
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setTypewriterText(userMsg.slice(0, i));
        if (i >= userMsg.length) {
          clearInterval(typeInterval);
        }
      }, 40);
      timeoutsRef.current.push(typeInterval as unknown as NodeJS.Timeout);
    }, 7500);

    schedule(() => {
      setShowTypewriter(false);
      setTypewriterText("");
      addMessage(4, userMsg, "user");
    }, 7500 + userMsg.length * 40 + 200);

    schedule(() => {
      setShowTyping(true);
    }, 9500);

    schedule(() => {
      setShowTyping(false);
      addMessage(5, "Cada bebê tem seu tempo! 🌱 Aos 8 meses, muitos ainda estão se preparando para engatinhar. Vou te mostrar algumas atividades que podem ajudar...", "bot");
    }, 10500);

    schedule(() => {
      runSequence();
    }, 13500);
  }, [addMessage, schedule]);

  useEffect(() => {
    runSequence();
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [runSequence]);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      <div className="max-w-sm mx-auto rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "#075E54" }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center">
            <span className="text-white text-xs font-bold">TN</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">TitiNauta</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full" />
              <span className="text-green-200 text-xs">online</span>
            </div>
          </div>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </div>

        <div
          ref={chatRef}
          className="px-3 py-4 space-y-2 overflow-y-auto"
          style={{ backgroundColor: "#ECE5DD", maxHeight: "350px", minHeight: "350px" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id + "-" + msg.text.slice(0, 10)}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div
                className={`rounded-xl px-3 py-2 max-w-[80%] ${
                  msg.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                }`}
                style={{
                  backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFFFFF",
                }}
              >
                <p className="text-sm text-gray-800 whitespace-pre-line">{msg.text}</p>
                <p className="text-[10px] text-gray-400 text-right mt-1">agora</p>
              </div>
            </div>
          ))}

          {showButtons && (
            <div className="flex gap-2 justify-center animate-slide-up">
              <button
                className={`border text-sm rounded-full px-4 py-2 transition-all ${
                  buttonHighlight
                    ? "bg-primary text-white border-primary"
                    : "border-primary text-primary"
                }`}
              >
                👶 Sobre meu bebê
              </button>
              <button className="border border-primary text-primary text-sm rounded-full px-4 py-2">
                💚 Sobre mim
              </button>
            </div>
          )}

          {showTyping && <TypingIndicator />}

          {showTypewriter && (
            <div className="flex justify-end animate-slide-up">
              <div className="rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]" style={{ backgroundColor: "#DCF8C6" }}>
                <p className="text-sm text-gray-800">{typewriterText}<span className="animate-pulse">|</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-200">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <p className="text-xs text-gray-400">Digite uma mensagem...</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#075E54" }}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppSimulator;
