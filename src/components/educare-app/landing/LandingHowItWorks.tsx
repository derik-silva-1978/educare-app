import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, MessageCircle, Brain, Bot, ArrowRight, Sparkles } from "lucide-react";
import WhatsAppSimulator from "./WhatsAppSimulator";

const steps = [
  {
    icon: MessageCircle,
    title: "Escolha sua Jornada",
    description: "Bebê ou saúde materna — experiência personalizada de acordo com suas necessidades.",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: Brain,
    title: "Receba Análise Instantânea",
    description: "Avaliação baseada em marcos do desenvolvimento da OMS e Ministério da Saúde.",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    icon: Bot,
    title: "Converse com o TitiNauta",
    description: "Tire dúvidas, receba dicas práticas e acompanhe o desenvolvimento no seu ritmo.",
    gradient: "from-blue-400 to-cyan-500",
  },
];

const LandingHowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Como Funciona</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça o TitiNauta — seu assistente inteligente no WhatsApp
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shrink-0`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <Link
                to="/educare-app/auth?action=register"
                className="group inline-flex flex-col items-start"
              >
                <div
                  className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)" }}
                  />
                  <Sparkles className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Experimentar Gratuitamente</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <span className="text-xs text-muted-foreground mt-2.5 ml-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% gratuito para começar — sem cartão de crédito
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="md:col-span-5 sticky top-24">
            <WhatsAppSimulator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
