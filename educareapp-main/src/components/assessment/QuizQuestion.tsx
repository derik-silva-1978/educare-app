
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  DevelopmentQuestion, 
  ResponseType, 
  ResponseLabels 
} from '@/types/assessment';

interface QuizQuestionProps {
  question: DevelopmentQuestion;
  response: ResponseType | null;
  notes?: string;
  onChange: (response: ResponseType, notes?: string) => void;
  disabled?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  response,
  notes = '',
  onChange,
  disabled = false,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(notes);
  
  const handleResponseChange = (value: ResponseType) => {
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
  
  const responseOptions: ResponseType[] = ['yes', 'partially', 'no', 'not_applicable', 'developing'];
  
  // Safely display question text by checking different possible properties
  const getQuestionText = (): string => {
    if (typeof question === 'string') {
      return question;
    }
    
    if (question.question) {
      return question.question;
    }
    
    // Fall back to alternative properties
    return question.text || question.id || 'Pergunta';
  };
  
  const displayText = getQuestionText();
  
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">{displayText}</h3>
            {question.help_text && (
              <p className="text-sm text-muted-foreground">{question.help_text}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {responseOptions.map((option) => (
              <Button
                key={option}
                variant={response === option ? "default" : "outline"}
                size="sm"
                onClick={() => handleResponseChange(option)}
                disabled={disabled}
              >
                {ResponseLabels[option]}
              </Button>
            ))}
          </div>
          
          <div className="pt-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
