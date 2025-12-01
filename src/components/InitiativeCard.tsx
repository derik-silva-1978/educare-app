
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InitiativeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  delay: number;
  cta?: string;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  description,
  icon,
  color,
  link,
  delay,
  cta = "Saiba Mais"
}) => {
  return (
    <motion.div
      className="group h-full flex flex-col rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className={`${color} p-6`}>
        <div className="rounded-full bg-white/20 w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
      </div>
      
      <div className="px-6 pb-6 mt-auto">
        <Link 
          to={link}
          className="inline-flex items-center px-4 py-2 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors text-sm font-medium w-full justify-center"
        >
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default InitiativeCard;
