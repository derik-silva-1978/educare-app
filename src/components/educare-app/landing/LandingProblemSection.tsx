import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Clock, Zap, Moon, HeartPulse, Monitor, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LandingProblemSectionProps {
  onTestFree?: () => void;
}

const LandingProblemSection: React.FC<LandingProblemSectionProps> = ({ onTestFree }) => {
  const concerns = [
    {
      title: "Meu filho deveria estar falando/andando como as outras crianças da idade?",
      stat: "85% dos pais comparam com outras crianças",
      icon: Users,
      gradient: "from-rose-400 to-pink-500"
    },
    {
      title: "Será que perdi algum marco importante do desenvolvimento?",
      stat: "70% dos atrasos poderiam ser identificados antes dos 2 anos",
      icon: Clock,
      gradient: "from-amber-400 to-orange-500"
    },
    {
      title: "Estou estimulando meu filho da forma correta para a idade dele?",
      stat: "60% dos pais não sabem quais atividades são adequadas",
      icon: Zap,
      gradient: "from-yellow-400 to-amber-500"
    },
    {
      title: "Acordo de madrugada me perguntando se está tudo bem com meu bebê",
      stat: "78% das mães perdem o sono por preocupações",
      icon: Moon,
      gradient: "from-indigo-400 to-purple-500"
    },
    {
      title: "O pediatra disse 'está normal', mas eu sinto que algo não está certo",
      stat: "43% dos pais precisam de mais orientações entre consultas",
      icon: HeartPulse,
      gradient: "from-red-400 to-rose-500"
    },
    {
      title: "Internet tem muita informação contraditória. Em quem confiar?",
      stat: "91% dos pais se sentem perdidos com excesso de informações",
      icon: Monitor,
      gradient: "from-cyan-400 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleCTA = () => {
    if (onTestFree) {
      onTestFree();
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Você não está sozinho(a) nessa preocupação
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            97% dos pais têm dúvidas sobre o desenvolvimento dos filhos. Reconhece alguma situação?
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {concerns.map((concern, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl p-8 border border-border shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${concern.gradient}`}>
                  <concern.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-6 leading-snug">
                {concern.title}
              </h3>

              <div className="inline-block text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full">
                {concern.stat}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {onTestFree ? (
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              onClick={handleCTA}
            >
              Começar avaliação agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              asChild
            >
              <Link to="/educare-app/auth?action=register">
                Começar avaliação agora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
          <p className="text-muted-foreground mt-4">
            Sua tranquilidade está a poucos cliques de distância
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingProblemSection;
