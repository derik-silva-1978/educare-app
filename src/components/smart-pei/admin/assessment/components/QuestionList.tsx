
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Question, Skill, getLevelName } from './QuestionForm';

interface QuestionListProps {
  questions: Question[];
  skills: Skill[];
  filteredQuestions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  skills,
  filteredQuestions,
  onEdit,
  onDelete
}) => {
  const getSkillName = (skillId: string): string => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : 'Habilidade não encontrada';
  };

  if (questions.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/30 rounded-md border">
        <p>Nenhuma questão cadastrada ainda.</p>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/30 rounded-md border">
        <p>Nenhuma questão encontrada para o filtro selecionado.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 space-y-3">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline">
                    {getSkillName(question.skillId)}
                  </Badge>
                  <h4 className="font-medium">{question.text}</h4>
                  {question.helpText && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Ajuda:</span> {question.helpText}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(question)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => onDelete(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              </div>
              
              {Object.keys(question.levels).length > 0 && (
                <div className="border rounded-md p-3 bg-muted/30 mt-2">
                  <h5 className="text-sm font-medium mb-2">Níveis:</h5>
                  <div className="space-y-1.5">
                    {(['not_present', 'emerging', 'developing', 'developing_strong', 'achieved', 'mastered', 'acquired'] as const)
                      .filter(level => question.levels[level])
                      .map((level) => (
                        <div key={level} className="flex gap-2 text-sm">
                          <span className="font-medium min-w-28">{getLevelName(level)}:</span>
                          <span className="text-muted-foreground">{question.levels[level]}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default QuestionList;
