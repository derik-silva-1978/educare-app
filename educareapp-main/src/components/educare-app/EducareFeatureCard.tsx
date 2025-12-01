
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducareFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
  className?: string;
}

const EducareFeatureCard: React.FC<EducareFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color = "#91D8F7",
  delay = 0,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "bg-white rounded-xl p-6 shadow-lg border border-gray-100",
        className
      )}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="h-6 w-6" style={{ color: color }} />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default EducareFeatureCard;
