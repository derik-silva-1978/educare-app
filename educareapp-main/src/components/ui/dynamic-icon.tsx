
import React from 'react';
import { 
  Activity, 
  Brain, 
  Circle, 
  Heart, 
  MessageSquare, 
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Baby,
  Star,
  Compass,
  Music,
  Puzzle,
  Book,
  Bird,
  Flower,
  Gamepad
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, color }) => {
  const iconProps = {
    className,
    color
  };

  const iconMap: Record<string, React.ReactNode> = {
    // Domain icons
    'Brain': <Brain {...iconProps} />,
    'Activity': <Activity {...iconProps} />,
    'Users': <Users {...iconProps} />,
    'Heart': <Heart {...iconProps} />,
    'MessageSquare': <MessageSquare {...iconProps} />,
    
    // Calendar icons
    'Calendar': <Calendar {...iconProps} />,
    'CheckCircle': <CheckCircle {...iconProps} />,
    'Clock': <Clock {...iconProps} />,
    'AlertTriangle': <AlertTriangle {...iconProps} />,
    
    // Baby development icons
    'Baby': <Baby {...iconProps} />,
    'Star': <Star {...iconProps} />,
    'Compass': <Compass {...iconProps} />,
    'Music': <Music {...iconProps} />,
    'Puzzle': <Puzzle {...iconProps} />,
    'Book': <Book {...iconProps} />,
    'Bird': <Bird {...iconProps} />,
    'Flower': <Flower {...iconProps} />,
    'Gamepad': <Gamepad {...iconProps} />,
    
    // Fallback
    'Circle': <Circle {...iconProps} />
  };
  
  return iconMap[name] || <Circle {...iconProps} />;
};

export default DynamicIcon;
