import { motion } from "framer-motion";
import { Target, Eye, Heart, Star } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Nossa Missão",
    desc: "Promover o desenvolvimento saudável e seguro na primeira infância, democratizando o acesso à ciência por meio de tecnologia acessível, empática e inteligente.",
    colors: "from-pink-50 to-pink-100/50 dark:from-pink-950/30 dark:to-pink-900/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: Eye,
    title: "Nossa Visão",
    desc: "Ser referência nacional no acompanhamento digital do desenvolvimento infantil até 2030, impactando mais de 1 milhão de famílias brasileiras.",
    colors: "from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    icon: Heart,
    title: "Nossos Valores",
    desc: "Ciência e evidência • Empatia e acolhimento • Acessibilidade e inclusão • Inovação com propósito • Colaboração com especialistas • Escuta ativa das famílias",
    colors: "from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Star,
    title: "Nossa Proposta",
    desc: "Transformamos a vida das famílias reduzindo ansiedade dos pais, detectando problemas precocemente e oferecendo orientações personalizadas baseadas em protocolos científicos.",
    colors: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

const LandingAboutSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quem Somos</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça a Educare+ e nossa missão de transformar o acompanhamento do desenvolvimento infantil no Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`group p-8 rounded-2xl border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${card.colors}`}
            >
              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingAboutSection;
