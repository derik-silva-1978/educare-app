import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, MessageCircle, Brain, Bot, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
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
              className="pt-4"
            >
              <Link to="/educare-app/auth?action=register">
                <Button size="lg" className="gap-2">
                  <Rocket className="w-5 h-5" />
                  Experimentar Gratuitamente
                </Button>
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
