
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AssessmentDomain } from '@/types/assessment';
import QuestionForm, { Question, Skill } from './components/QuestionForm';
import QuestionList from './components/QuestionList';

export const Questions: React.FC = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    skillId: '',
    text: '',
    helpText: '',
    levels: {},
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');

  useEffect(() => {
    const savedSkills = localStorage.getItem('assessment_skills');
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (e) {
        console.error('Error parsing saved skills', e);
      }
    }
    
    const savedQuestions = localStorage.getItem('assessment_questions');
    if (savedQuestions) {
      try {
        setQuestions(JSON.parse(savedQuestions));
      } catch (e) {
        console.error('Error parsing saved questions', e);
      }
    }
  }, []);

  const saveQuestions = (updatedQuestions: Question[]) => {
    localStorage.setItem('assessment_questions', JSON.stringify(updatedQuestions));
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.skillId) {
      toast({
        title: "Habilidade obrigatória",
        description: "Por favor, selecione uma habilidade para esta questão",
        variant: "destructive"
      });
      return;
    }

    if (!newQuestion.text.trim()) {
      toast({
        title: "Texto obrigatório",
        description: "Por favor, insira o texto da questão",
        variant: "destructive"
      });
      return;
    }

    const question: Question = {
      id: `question_${Date.now()}`,
      ...newQuestion
    };

    const updatedQuestions = [...questions, question];
    saveQuestions(updatedQuestions);
    
    setNewQuestion({
      skillId: newQuestion.skillId,
      text: '',
      helpText: '',
      levels: {},
    });

    toast({
      title: "Questão adicionada",
      description: "A questão foi adicionada com sucesso"
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditing(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    );
    
    saveQuestions(updatedQuestions);
    setIsEditing(false);
    setEditingQuestion(null);

    toast({
      title: "Questão atualizada",
      description: "A questão foi atualizada com sucesso"
    });
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    saveQuestions(updatedQuestions);

    toast({
      title: "Questão removida",
      description: "A questão foi removida com sucesso"
    });
  };

  const handleChangeQuestion = (field: string, value: any) => {
    if (isEditing && editingQuestion) {
      setEditingQuestion(prev => ({
        ...prev!,
        [field]: value
      }));
    } else {
      setNewQuestion(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleResetForm = () => {
    setNewQuestion({
      skillId: newQuestion.skillId,
      text: '',
      helpText: '',
      levels: {},
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingQuestion(null);
  };

  const filteredQuestions = selectedSkillFilter === 'all' 
    ? questions 
    : questions.filter(q => q.skillId === selectedSkillFilter);

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-muted">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {isEditing ? 'Editar Questão' : 'Adicionar Nova Questão'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm 
            isEditing={isEditing}
            question={isEditing ? editingQuestion! : newQuestion}
            skills={skills}
            onSave={handleAddQuestion}
            onUpdate={handleUpdateQuestion}
            onCancel={handleCancelEdit}
            onChange={handleChangeQuestion}
            onReset={handleResetForm}
          />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Questões Cadastradas</h3>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-skill" className="text-sm whitespace-nowrap">Filtrar por Habilidade:</Label>
            <Select 
              value={selectedSkillFilter}
              onValueChange={setSelectedSkillFilter}
            >
              <SelectTrigger id="filter-skill" className="w-[200px]">
                <SelectValue placeholder="Todas as habilidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as habilidades</SelectItem>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <QuestionList 
          questions={questions}
          skills={skills}
          filteredQuestions={filteredQuestions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      </div>
    </div>
  );
};
