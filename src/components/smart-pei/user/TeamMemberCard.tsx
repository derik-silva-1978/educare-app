
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamMemberCardProps {
  member: {
    id: string;
    name: string;
    photoUrl?: string;
    position?: string;
    specialties?: string[];
    description?: string; // Made optional to match TeamMember interface
  };
  onViewProfile?: (id: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member,
  onViewProfile
}) => {
  const { id, name, photoUrl, position, specialties, description } = member;

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewProfile?.(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={photoUrl || '/placeholder.svg'} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">{name}</h4>
            {position && (
              <p className="text-xs text-muted-foreground">{position}</p>
            )}
          </div>
        </div>
        
        {specialties && specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {specialties.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      +{specialties.length - 3}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="p-2">
                    {specialties.slice(3).join(', ')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
