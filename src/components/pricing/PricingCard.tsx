
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  period: string;
  annualPrice: string;
  save: string;
  popular: boolean;
  color: string;
  borderColor: string;
  icon: React.ReactNode;
  studentLimit: string;
  features: string[];
}

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col ${
          plan.popular ? 'border-2 border-educare-500 shadow-lg' : 'border border-border'
        }`}
      >
        {plan.popular && (
          <div className="absolute top-0 right-0">
            <div className={`${plan.color} text-white text-xs font-medium px-3 py-1 rounded-bl-md`}>
              Mais Popular
            </div>
          </div>
        )}
        
        <CardHeader className={`pb-4 ${plan.popular ? 'pt-8' : 'pt-5'} sm:pt-6`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`rounded-full p-1.5 sm:p-2 ${plan.color} text-white`}>
              {plan.icon}
            </div>
            <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs sm:text-sm">
            {plan.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4 flex-grow">
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-1 text-xs sm:text-sm">{plan.period}</span>
            </div>
            <div className="flex items-center mt-1 text-xs sm:text-sm">
              <span className="text-muted-foreground">{plan.annualPrice}</span>
              <span className="ml-2 text-green-600 font-medium">{plan.save}</span>
            </div>
          </div>
          
          <div className="bg-muted/40 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 mb-4">
            <p className="text-xs sm:text-sm font-medium flex items-center">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary" />
              {plan.studentLimit}
            </p>
          </div>
          
          <ul className="space-y-2 sm:space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className={`h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 mt-0.5 ${plan.color} text-white rounded-full p-[0.2rem] sm:p-1 flex-shrink-0`} />
                <span className="text-xs sm:text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="pt-0 mt-auto">
          <Button 
            asChild 
            size="sm"
            className={`w-full rounded-full py-1.5 text-xs sm:text-sm sm:py-2 ${
              plan.popular
                ? plan.color + ' hover:opacity-90 text-white'
                : 'bg-primary/10 hover:bg-primary/20 text-primary'
            }`}
          >
            <Link to={`/auth?action=register&plan=${plan.id}`}>
              Começar agora
              <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
