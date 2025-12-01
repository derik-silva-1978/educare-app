
import React, { ReactNode } from 'react';
import { 
  Brain, 
  Activity, 
  Users, 
  MessageSquare, 
  Box, 
  MessageCircle, 
  Eye,
  Heart,
  Shield,
  Stethoscope,
  Repeat,
  BookOpen,
  Smile
} from 'lucide-react';
import { DevelopmentDomain } from '@/types/assessment';

// Create a complete icon map for all domains
const createDomainIconMap = (): Record<DevelopmentDomain, ReactNode> => {
  const iconMap: Partial<Record<DevelopmentDomain, ReactNode>> = {
    communication: <MessageCircle className="h-5 w-5" />,
    motor: <Activity className="h-5 w-5" />,
    social: <Users className="h-5 w-5" />,
    cognitive: <Brain className="h-5 w-5" />,
    adaptive: <Repeat className="h-5 w-5" />,
    sensory: <Eye className="h-5 w-5" />,
    language: <MessageSquare className="h-5 w-5" />,
    social_emotional: <Heart className="h-5 w-5" />,
    self_care: <Shield className="h-5 w-5" />,
    maternal_health: <Stethoscope className="h-5 w-5" />,
    emotional: <Smile className="h-5 w-5" />,
    behavioral: <Box className="h-5 w-5" />,
    academic: <BookOpen className="h-5 w-5" />
  };
  
  // Ensure all domains have an icon
  return iconMap as Record<DevelopmentDomain, ReactNode>;
};

const DomainIcon: React.FC<{ domain: DevelopmentDomain }> = ({ domain }) => {
  const iconMap = createDomainIconMap();
  return <div className="text-primary">{iconMap[domain] || <Box className="h-5 w-5" />}</div>;
};

export default DomainIcon;
