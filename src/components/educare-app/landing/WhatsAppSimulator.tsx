import { useState, useEffect, useRef, useCallback } from "react";

type MessageType = {
  id: string;
  text: string;
  sender: "bot" | "user";
};

type ButtonType = {
  text: string;
  id: string;
  selected?: boolean;
};

type SceneStep =
  | { type: "bot"; text: string; delay: number }
  | { type: "user"; text: string; delay: number; typewriter?: boolean }
  | { type: "buttons"; buttons: ButtonType[]; delay: number }
  | { type: "button_select"; buttonId: string; delay: number }
  | { type: "typing"; duration: number; delay: number }
  | { type: "clear"; delay: number };

type Scene = {
  day: string;
  label: string;
  steps: SceneStep[];
};

const SCENES: Scene[] = [
  {
    day: "SEG",
    label: "Boas-vindas",
    steps: [
      { type: "typing", duration: 1400, delay: 800 },
      {
        type: "bot",
        text: "Olá! 👋 Eu sou o TitiNauta, seu assistente inteligente no Educare+.\n\nEstou aqui para acompanhar o desenvolvimento do seu bebê com orientações baseadas na OMS e SBP. 🚀",
        delay: 0,
      },
      { type: "typing", duration: 1000, delay: 3000 },
      {
        type: "bot",
        text: "Sobre o que você quer falar agora? 💬",
        delay: 0,
      },
      {
        type: "buttons",
        buttons: [
          { text: "👶 Sobre meu bebê", id: "ctx_child" },
          { text: "💚 Sobre mim", id: "ctx_mother" },
        ],
        delay: 1200,
      },
      { type: "button_select", buttonId: "ctx_child", delay: 3000 },
      { type: "user", text: "👶 Sobre meu bebê", delay: 600 },
      { type: "typing", duration: 1200, delay: 1000 },
      {
        type: "bot",
        text: "Ótimo! 💜 Agora estou no modo Bebê.\n\nPode me perguntar qualquer coisa sobre desenvolvimento, marcos, alimentação, sono...\n\nEstou aqui pra te ajudar!",
        delay: 0,
      },
    ],
  },
  {
    day: "TER",
    label: "Conteúdo Semanal",
    steps: [
      { type: "clear", delay: 0 },
      { type: "typing", duration: 1400, delay: 800 },
      {
        type: "bot",
        text: "🌟 Conteúdo da Semana 32!\n\nSeu bebê está com aproximadamente 8 meses. Nesta fase, ele pode estar:\n\n✅ Sentando sem apoio\n✅ Tentando engatinhar\n✅ Respondendo ao próprio nome\n✅ Pegando objetos com pinça",
        delay: 0,
      },
      { type: "typing", duration: 1000, delay: 3500 },
      {
        type: "bot",
        text: "💡 Atividade da semana:\n\nColoque brinquedos coloridos um pouco à frente do bebê para estimular o engatinhar. Fique por perto encorajando! 🎯",
        delay: 0,
      },
      {
        type: "buttons",
        buttons: [
          { text: "📖 Ver mais detalhes", id: "content_more" },
          { text: "▶️ Próximo tema", id: "content_next" },
        ],
        delay: 2000,
      },
      { type: "button_select", buttonId: "content_more", delay: 3000 },
      { type: "user", text: "📖 Ver mais detalhes", delay: 600 },
      { type: "typing", duration: 1200, delay: 1000 },
      {
        type: "bot",
        text: "Aos 8 meses, a motricidade grossa está a todo vapor! 🏃‍♂️\n\nAlguns bebês pulam o engatinhar e vão direto para ficar em pé — isso também é normal.\n\nO importante é oferecer estímulos adequados e um ambiente seguro para explorar.",
        delay: 0,
      },
    ],
  },
  {
    day: "QUA",
    label: "Quiz Interativo",
    steps: [
      { type: "clear", delay: 0 },
      { type: "typing", duration: 1200, delay: 800 },
      {
        type: "bot",
        text: "🧩 Quiz da Semana!\n\nVamos verificar alguns marcos do desenvolvimento do seu bebê?\n\nPergunta 1 de 3:",
        delay: 0,
      },
      { type: "typing", duration: 1000, delay: 2500 },
      {
        type: "bot",
        text: "Seu bebê já consegue transferir objetos de uma mão para a outra?",
        delay: 0,
      },
      {
        type: "buttons",
        buttons: [
          { text: "✅ Sim, faz isso!", id: "quiz_yes" },
          { text: "🔄 Às vezes", id: "quiz_sometimes" },
          { text: "❌ Ainda não", id: "quiz_no" },
        ],
        delay: 1500,
      },
      { type: "button_select", buttonId: "quiz_yes", delay: 3500 },
      { type: "user", text: "✅ Sim, faz isso!", delay: 600 },
      { type: "typing", duration: 1400, delay: 1000 },
      {
        type: "bot",
        text: "Excelente! 🎉 Esse é um marco importante da coordenação motora fina, esperado entre 6-9 meses.\n\nSeu bebê está no caminho certo! Continue oferecendo objetos variados para manipulação.\n\n📊 Progresso: 1/3 marcos verificados",
        delay: 0,
      },
    ],
  },
  {
    day: "QUI",
    label: "Conversa Livre",
    steps: [
      { type: "clear", delay: 0 },
      {
        type: "user",
        text: "Meu bebê acorda muito à noite, é normal?",
        delay: 1200,
        typewriter: true,
      },
      { type: "typing", duration: 1800, delay: 1200 },
      {
        type: "bot",
        text: "É uma dúvida muito comum! 🌙\n\nAos 8 meses, é normal que o sono sofra alterações. Isso pode acontecer por:\n\n• Ansiedade de separação (marco emocional)\n• Saltos de desenvolvimento\n• Nascimento de dentes\n• Mudanças na rotina",
        delay: 0,
      },
      { type: "typing", duration: 1200, delay: 3500 },
      {
        type: "bot",
        text: "💤 Dicas para ajudar:\n\n1. Mantenha uma rotina de sono consistente\n2. Crie um ritual relaxante antes de dormir\n3. Ofereça segurança sem criar dependência\n4. Seja paciente — essa fase passa!\n\nQuer saber mais sobre algum desses pontos?",
        delay: 0,
      },
      {
        type: "user",
        text: "Muito obrigada! Me ajudou bastante 💜",
        delay: 4000,
        typewriter: true,
      },
      { type: "typing", duration: 1000, delay: 1000 },
      {
        type: "bot",
        text: "Fico feliz em ajudar! 😊 Lembre-se: você está fazendo um ótimo trabalho. Estou sempre aqui quando precisar! 💜",
        delay: 0,
      },
    ],
  },
  {
    day: "SEX",
    label: "Feedback",
    steps: [
      { type: "clear", delay: 0 },
      { type: "typing", duration: 1200, delay: 800 },
      {
        type: "bot",
        text: "✨ Resumo da sua semana:\n\n📖 1 conteúdo semanal recebido\n🧩 1 quiz completado\n💬 2 conversas realizadas\n\nVocê está acompanhando o desenvolvimento do seu bebê de forma incrível! 🌟",
        delay: 0,
      },
      { type: "typing", duration: 1000, delay: 3500 },
      {
        type: "bot",
        text: "Como foi sua experiência esta semana? ⭐",
        delay: 0,
      },
      {
        type: "buttons",
        buttons: [
          { text: "⭐⭐⭐⭐⭐ Adorei!", id: "fb_5" },
          { text: "⭐⭐⭐ Razoável", id: "fb_3" },
          { text: "⭐ Precisa melhorar", id: "fb_1" },
        ],
        delay: 1500,
      },
      { type: "button_select", buttonId: "fb_5", delay: 3500 },
      { type: "user", text: "⭐⭐⭐⭐⭐ Adorei!", delay: 600 },
      { type: "typing", duration: 1200, delay: 1000 },
      {
        type: "bot",
        text: "Obrigado pelo feedback! 🙏💜\n\nNa próxima semana teremos novos conteúdos sobre alimentação complementar e mais quizzes!\n\nBom fim de semana! 🌈\n\n— TitiNauta 🚀",
        delay: 0,
      },
    ],
  },
];

const TypingIndicator = () => (
  <div className="flex items-end mb-2 animate-sim-slide-up">
    <div className="bg-white rounded-xl px-4 py-3 max-w-[80%] flex gap-1.5 items-center shadow-sm">
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

const WhatsAppSimulator = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [buttons, setButtons] = useState<ButtonType[]>([]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const mountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(() => {
      if (mountedRef.current) fn();
    }, delay);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, buttons, showTyping, typewriterText]);

  const runScene = useCallback(
    (sceneIndex: number) => {
      clearTimers();
      setMessages([]);
      setButtons([]);
      setSelectedButton(null);
      setShowTyping(false);
      setTypewriterText("");
      setShowTypewriter(false);

      const scene = SCENES[sceneIndex];
      if (!scene) return;

      let cumulativeDelay = 0;
      let msgCounter = 0;

      scene.steps.forEach((step) => {
        cumulativeDelay += step.delay;

        switch (step.type) {
          case "clear":
            schedule(() => {
              setMessages([]);
              setButtons([]);
              setSelectedButton(null);
            }, cumulativeDelay);
            break;

          case "typing": {
            const startDelay = cumulativeDelay;
            const dur = step.duration;
            schedule(() => setShowTyping(true), startDelay);
            cumulativeDelay += dur;
            schedule(() => setShowTyping(false), cumulativeDelay);
            break;
          }

          case "bot": {
            const id = `bot-${sceneIndex}-${msgCounter++}`;
            const text = step.text;
            schedule(() => {
              setMessages((prev) => [...prev, { id, text, sender: "bot" }]);
            }, cumulativeDelay);
            cumulativeDelay += 500;
            break;
          }

          case "user": {
            const id = `user-${sceneIndex}-${msgCounter++}`;
            const text = step.text;
            if (step.typewriter) {
              const twDelay = cumulativeDelay;
              schedule(() => {
                setShowTypewriter(true);
                let i = 0;
                const interval = setInterval(() => {
                  if (!mountedRef.current) {
                    clearInterval(interval);
                    return;
                  }
                  i++;
                  setTypewriterText(text.slice(0, i));
                  if (i >= text.length) {
                    clearInterval(interval);
                  }
                }, 50);
                intervalsRef.current.push(interval);
              }, twDelay);
              cumulativeDelay += text.length * 50 + 500;
              schedule(() => {
                setShowTypewriter(false);
                setTypewriterText("");
                setMessages((prev) => [...prev, { id, text, sender: "user" }]);
              }, cumulativeDelay);
              cumulativeDelay += 400;
            } else {
              schedule(() => {
                setMessages((prev) => [...prev, { id, text, sender: "user" }]);
              }, cumulativeDelay);
              cumulativeDelay += 400;
            }
            break;
          }

          case "buttons": {
            const btns = step.buttons;
            schedule(() => {
              setButtons(btns);
              setSelectedButton(null);
            }, cumulativeDelay);
            cumulativeDelay += 300;
            break;
          }

          case "button_select": {
            const btnId = step.buttonId;
            schedule(() => {
              setSelectedButton(btnId);
            }, cumulativeDelay);
            cumulativeDelay += 700;
            schedule(() => {
              setButtons([]);
              setSelectedButton(null);
            }, cumulativeDelay);
            break;
          }
        }
      });

      const sceneEndDelay = cumulativeDelay + 4000;
      schedule(() => {
        setTransitioning(true);
        schedule(() => {
          const nextScene = (sceneIndex + 1) % SCENES.length;
          setCurrentScene(nextScene);
          setTransitioning(false);
          runScene(nextScene);
        }, 800);
      }, sceneEndDelay);
    },
    [clearTimers, schedule]
  );

  useEffect(() => {
    mountedRef.current = true;
    runScene(0);
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, []);

  const scene = SCENES[currentScene];

  return (
    <>
      <style>{`
        @keyframes simSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-sim-slide-up {
          animation: simSlideUp 0.3s ease-out forwards;
        }
        @keyframes simFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-sim-fade-in {
          animation: simFadeIn 0.4s ease-out forwards;
        }
      `}</style>
      <div className="max-w-sm mx-auto rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ backgroundColor: "#075E54" }}
        >
          <svg
            className="w-5 h-5 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
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
          <span className="text-white/60 text-[10px] font-medium">
            Educare+
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50">
          {SCENES.map((s, i) => (
            <button
              key={s.day}
              className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 min-w-[48px] ${
                i === currentScene
                  ? "bg-emerald-600 text-white shadow-sm scale-105"
                  : i < currentScene
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                    : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <span className="text-[9px] font-bold leading-tight">
                {s.day}
              </span>
              <span
                className={`text-[7px] leading-tight ${i === currentScene ? "text-emerald-100" : ""}`}
              >
                {s.label.length > 8 ? s.label.slice(0, 8) + "…" : s.label}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={chatRef}
          className={`px-3 py-3 space-y-2 overflow-y-auto transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"}`}
          style={{
            backgroundColor: "#ECE5DD",
            maxHeight: "340px",
            minHeight: "340px",
          }}
        >
          <div className="flex justify-center mb-2">
            <span className="text-[10px] bg-white/80 text-gray-500 px-3 py-1 rounded-full shadow-sm">
              {scene?.label} — Semana Educare+
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-sim-slide-up`}
            >
              <div
                className={`rounded-xl px-3 py-2 max-w-[82%] shadow-sm ${
                  msg.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                }`}
                style={{
                  backgroundColor:
                    msg.sender === "user" ? "#DCF8C6" : "#FFFFFF",
                }}
              >
                <p className="text-[13px] text-gray-800 whitespace-pre-line leading-relaxed">
                  {msg.text}
                </p>
                <p className="text-[9px] text-gray-400 text-right mt-0.5">
                  agora
                </p>
              </div>
            </div>
          ))}

          {buttons.length > 0 && (
            <div className="animate-sim-slide-up">
              <div className="bg-white rounded-xl px-3 py-2 shadow-sm mb-1">
                <p className="text-[10px] text-gray-400 mb-1.5">
                  TitiNauta 🚀
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {buttons.map((btn) => (
                    <span
                      key={btn.id}
                      className={`text-[12px] border rounded-full px-3 py-1.5 transition-all duration-300 cursor-default ${
                        selectedButton === btn.id
                          ? "bg-emerald-600 text-white border-emerald-600 scale-105"
                          : "border-emerald-600 text-emerald-700"
                      }`}
                    >
                      {btn.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showTyping && <TypingIndicator />}

          {showTypewriter && (
            <div className="flex justify-end animate-sim-slide-up">
              <div
                className="rounded-xl rounded-tr-sm px-3 py-2 max-w-[82%] shadow-sm"
                style={{ backgroundColor: "#DCF8C6" }}
              >
                <p className="text-[13px] text-gray-800">
                  {typewriterText}
                  <span className="animate-pulse text-gray-500">|</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
            <p className="text-[11px] text-gray-400">
              Digite uma mensagem...
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#075E54" }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppSimulator;
