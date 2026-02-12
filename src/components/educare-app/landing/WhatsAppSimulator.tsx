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
  | { type: "bot_chart"; text: string; delay: number }
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

const CHART_DATA = [
  { label: "Motor", pct: 85, color: "#6366f1" },
  { label: "Cognitivo", pct: 72, color: "#8b5cf6" },
  { label: "Social", pct: 90, color: "#10b981" },
  { label: "Linguagem", pct: 65, color: "#3b82f6" },
];

const MilestoneChart = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-sim-slide-up">
    <div
      className="px-3 py-2 flex items-center gap-2"
      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
    >
      <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
        <span className="text-white text-[8px] font-black">E+</span>
      </div>
      <span className="text-white text-[11px] font-semibold">Marcos do Desenvolvimento</span>
    </div>
    <div className="px-3 py-2.5 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-medium">Semana 32 — 8 meses</span>
        <span className="text-[9px] text-indigo-500 font-semibold">78% geral</span>
      </div>
      {CHART_DATA.map((item) => (
        <div key={item.label} className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-600 font-medium">{item.label}</span>
            <span className="text-[9px] font-semibold" style={{ color: item.color }}>{item.pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${item.pct}%`,
                background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
              }}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100 mt-1">
        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-[9px] text-gray-400">Baseado em OMS e SBP</span>
      </div>
    </div>
    <p className="text-[9px] text-gray-400 text-right px-3 pb-1.5">agora</p>
  </div>
);

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
      { type: "typing", duration: 1400, delay: 3500 },
      {
        type: "bot_chart",
        text: "__CHART__",
        delay: 0,
      },
      { type: "typing", duration: 1000, delay: 4500 },
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
  const [showChart, setShowChart] = useState(false);
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
  }, [messages, buttons, showTyping, typewriterText, showChart]);

  const runScene = useCallback(
    (sceneIndex: number) => {
      clearTimers();
      setMessages([]);
      setButtons([]);
      setSelectedButton(null);
      setShowTyping(false);
      setTypewriterText("");
      setShowTypewriter(false);
      setShowChart(false);

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
              setShowChart(false);
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

          case "bot_chart": {
            msgCounter++;
            schedule(() => {
              setShowChart(true);
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
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-inner"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)" }}
          >
            <span className="text-white text-[10px] font-black tracking-tight">E+</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-white text-sm font-semibold">Educare+</p>
              <span className="text-emerald-300 text-[10px] font-medium">Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full" />
              <span className="text-green-200 text-xs">online</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
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

          {showChart && <MilestoneChart />}

          {buttons.length > 0 && (
            <div className="animate-sim-slide-up">
              <div className="bg-white rounded-xl px-3 py-2 shadow-sm mb-1">
                <p className="text-[10px] text-gray-400 mb-1.5">
                  Educare+ Chat 🚀
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
