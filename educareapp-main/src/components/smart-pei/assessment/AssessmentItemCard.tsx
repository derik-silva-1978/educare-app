
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { AssessmentItem, AssessmentLevel, getLevelLabel } from '@/types/assessment';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AssessmentItemCardProps {
  item: AssessmentItem;
  onLevelChange: (level: string) => void;
  onNotesChange: (notes: string) => void;
  readOnly?: boolean;
}

export const AssessmentItemCard: React.FC<AssessmentItemCardProps> = ({
  item,
  onLevelChange,
  onNotesChange,
  readOnly = false
}) => {
  // Helper function to get colors based on level
  const getLevelColors = (level: AssessmentLevel | null) => {
    if (level === 'not_present') return 'bg-red-50 border-red-200 text-red-800';
    if (level === 'emerging') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (level === 'developing') return 'bg-blue-50 border-blue-200 text-blue-800';
    if (level === 'acquired') return 'bg-green-50 border-green-200 text-green-800';
    return '';
  };

  // Helper function to get item title
  const getItemTitle = () => {
    if (item.title) return item.title;
    if (item.skill) return item.skill;
    if (typeof item.question === 'string') return item.question;
    if (item.question && typeof item.question === 'object') {
      return item.question.text || item.question.question || 'Untitled Item';
    }
    return 'Untitled Item';
  };

  return (
    <Card className={`w-full transition-all duration-200 ${item.level ? getLevelColors(item.level) : 'bg-card'}`}>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <h3 className="text-base font-medium">{getItemTitle()}</h3>
            
            {item.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-80">
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`level-${item.id}`} className="text-sm">Nível de Desenvolvimento</Label>
          
          <RadioGroup 
            id={`level-${item.id}`}
            value={item.level === null ? '' : String(item.level)}
            onValueChange={onLevelChange}
            className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
            disabled={readOnly}
          >
            {(['not_present', 'emerging', 'developing', 'acquired'] as AssessmentLevel[]).map((level) => (
              <div key={level} className="relative flex items-center">
                <RadioGroupItem 
                  value={level} 
                  id={`${item.id}-${level}`} 
                  disabled={readOnly}
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor={`${item.id}-${level}`}
                  className={`
                    p-2 text-sm rounded-md border border-muted flex items-center gap-2
                    peer-hover:bg-muted/50 peer-data-[state=checked]:bg-primary/10
                    peer-data-[state=checked]:border-primary
                    peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                    ${readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                  `}
                >
                  <span className="flex h-3 w-3 rounded-full border border-current 
                    peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary">
                  </span>
                  <span>{getLevelLabel(level)}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`notes-${item.id}`} className="text-sm">Observações</Label>
          <Textarea 
            id={`notes-${item.id}`}
            placeholder="Observações específicas sobre este item..."
            value={item.notes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
            className={`min-h-20 ${readOnly ? 'bg-muted cursor-not-allowed' : ''}`}
            readOnly={readOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentItemCard;
