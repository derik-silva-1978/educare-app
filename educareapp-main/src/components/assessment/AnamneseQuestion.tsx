
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AnamneseQuestion } from '@/types/assessment';
import { HelpCircle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AnamneseQuestionProps {
  question: AnamneseQuestion;
  response?: string;
  notes?: string;
  onChange: (response: string, notes?: string) => void;
  disabled?: boolean;
}

export const AnamneseQuestionCard: React.FC<AnamneseQuestionProps> = ({
  question,
  response,
  notes = '',
  onChange,
  disabled = false
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(notes);
  const [showTips, setShowTips] = useState(false);
  
  const handleResponseChange = (value: string) => {
    if (disabled) return;
    onChange(value, notesValue);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(e.target.value);
  };
  
  const handleNotesSave = () => {
    if (response) {
      onChange(response, notesValue);
    }
    setShowNotes(false);
  };
  
  // Use options if available, otherwise fallback to responseOptions
  const options = question.options || question.responseOptions || ['Sim', 'Não', 'Parcialmente'];
  
  return (
    <Card className={`overflow-hidden transition-shadow ${response ? 'shadow' : 'shadow-sm'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                {question.category}
              </span>
              {question.required && <span className="text-red-500">*</span>}
            </div>
            
            <div className="flex items-start gap-1.5">
              <h3 className="font-medium text-lg">{question.question}</h3>
              {question.friendlyDescription && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Ajuda</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{question.friendlyDescription}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        
        <RadioGroup 
          value={response} 
          onValueChange={handleResponseChange}
          disabled={disabled}
          className="space-y-2"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${index}`} />
              <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        
        {(question.positiveFeeback || question.motherTips) && (
          <Collapsible open={showTips} onOpenChange={setShowTips} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex gap-1 items-center p-0 h-auto">
                <Info className="h-4 w-4" />
                <span>{showTips ? 'Esconder Dicas' : 'Mostrar Dicas'}</span>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2 space-y-2">
              {question.positiveFeeback && (
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="text-sm font-medium text-green-800">Informação Importante</h4>
                  <p className="text-sm text-green-700">{question.positiveFeeback}</p>
                </div>
              )}
              
              {question.motherTips && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800">Dicas para a Mãe</h4>
                  <p className="text-sm text-blue-700">{question.motherTips}</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
        
        <div className="mt-4">
          {showNotes ? (
            <div className="space-y-2">
              <Textarea 
                value={notesValue} 
                onChange={handleNotesChange}
                placeholder="Adicione observações aqui..."
                disabled={disabled}
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNotes(false)}
                  disabled={disabled}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm"
                  onClick={handleNotesSave}
                  disabled={disabled}
                >
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {notesValue ? (
                  <p className="text-muted-foreground">{notesValue}</p>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma observação</p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNotes(true)}
                disabled={disabled}
              >
                {notesValue ? 'Editar' : 'Adicionar'} observações
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnamneseQuestionCard;
