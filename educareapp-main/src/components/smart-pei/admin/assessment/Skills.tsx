
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Save, Trash2, Edit, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DevelopmentDomain } from '@/types/assessment';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { createDomainRecord } from '@/utils/assessment/helpers';

interface Skill {
  id: string;
  name: string;
  domain: DevelopmentDomain;
  description: string;
}

const skillLabels: Record<DevelopmentDomain, string> = {
  motor: 'Motor',
  cognitive: 'Cognitivo',
  language: 'Linguagem',
  social: 'Social',
  adaptive: 'Adaptativo',
  emotional: 'Emocional',
  communication: 'Comunicação',
  social_emotional: 'Socioemocional',
  self_care: 'Autocuidado',
  maternal_health: 'Saúde Materna',
  sensory: 'Sensorial',
  behavioral: 'Comportamental',
  academic: 'Acadêmico'
};

export const Skills: React.FC = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    domain: 'cognitive',
    description: '',
  });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedSkills = localStorage.getItem('assessment_skills');
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (e) {
        console.error('Error parsing saved skills', e);
      }
    }
  }, []);

  const saveSkills = (updatedSkills: Skill[]) => {
    localStorage.setItem('assessment_skills', JSON.stringify(updatedSkills));
    setSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a habilidade",
        variant: "destructive"
      });
      return;
    }

    const skill: Skill = {
      id: `skill_${Date.now()}`,
      ...newSkill
    };

    const updatedSkills = [...skills, skill];
    saveSkills(updatedSkills);
    
    setNewSkill({
      name: '',
      domain: 'cognitive',
      description: '',
    });

    toast({
      title: "Habilidade adicionada",
      description: `A habilidade "${skill.name}" foi adicionada com sucesso`
    });
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setIsEditing(true);
  };

  const handleUpdateSkill = () => {
    if (!editingSkill) return;

    const updatedSkills = skills.map(s => 
      s.id === editingSkill.id ? editingSkill : s
    );
    
    saveSkills(updatedSkills);
    setIsEditing(false);
    setEditingSkill(null);

    toast({
      title: "Habilidade atualizada",
      description: `A habilidade foi atualizada com sucesso`
    });
  };

  const handleDeleteSkill = (id: string) => {
    const updatedSkills = skills.filter(s => s.id !== id);
    saveSkills(updatedSkills);

    toast({
      title: "Habilidade removida",
      description: "A habilidade foi removida com sucesso"
    });
  };

  const getDomainName = (domain: DevelopmentDomain): string => {
    return skillLabels[domain] || domain;
  };

  const descriptions = createDomainRecord({
    communication: 'Habilidades para expressar necessidades e compreender os outros',
    motor: 'Capacidade de controlar e coordenar movimentos corporais',
    social: 'Interação com outras pessoas e desenvolvimento de relações',
    cognitive: 'Capacidade de aprender, raciocinar e resolver problemas',
    adaptive: 'Habilidades para se adaptar ao ambiente e realizar tarefas diárias',
    sensory: 'Processamento de informações sensoriais do ambiente',
    language: 'Compreensão e expressão da linguagem verbal',
    social_emotional: 'Desenvolvimento de habilidades emocionais e sociais',
    self_care: 'Habilidades para cuidar de si mesmo',
    maternal_health: 'Aspectos da saúde materna que impactam o desenvolvimento',
    emotional: 'Desenvolvimento de competências emocionais',
    behavioral: 'Padrões de comportamento e regulação',
    academic: 'Habilidades relacionadas ao aprendizado formal'
  }, 'Área importante do desenvolvimento infantil');

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-muted">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {isEditing ? 'Editar Habilidade' : 'Adicionar Nova Habilidade'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skill-name">Nome da Habilidade</Label>
                <Input 
                  id="skill-name"
                  value={isEditing ? editingSkill?.name || '' : newSkill.name}
                  onChange={(e) => isEditing 
                    ? setEditingSkill(prev => prev ? {...prev, name: e.target.value} : null)
                    : setNewSkill({...newSkill, name: e.target.value})
                  }
                  placeholder="Ex: Compreensão de textos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skill-domain">Domínio</Label>
                <Select 
                  value={isEditing ? editingSkill?.domain || 'cognitive' : newSkill.domain}
                  onValueChange={(value: DevelopmentDomain) => isEditing
                    ? setEditingSkill(prev => prev ? {...prev, domain: value} : null)
                    : setNewSkill({...newSkill, domain: value})
                  }
                >
                  <SelectTrigger id="skill-domain">
                    <SelectValue placeholder="Selecione um domínio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="communication">Comunicação</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="cognitive">Cognitivo</SelectItem>
                    <SelectItem value="adaptive">Adaptativo</SelectItem>
                    <SelectItem value="sensory">Sensorial</SelectItem>
                    <SelectItem value="social_emotional">Socioemocional</SelectItem>
                    <SelectItem value="self_care">Autocuidado</SelectItem>
                    <SelectItem value="maternal_health">Saúde Materna</SelectItem>
                    <SelectItem value="emotional">Emocional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skill-description">Descrição</Label>
              <Textarea 
                id="skill-description"
                value={isEditing ? editingSkill?.description || '' : newSkill.description}
                onChange={(e) => isEditing
                  ? setEditingSkill(prev => prev ? {...prev, description: e.target.value} : null)
                  : setNewSkill({...newSkill, description: e.target.value})
                }
                placeholder="Descreva a habilidade e como ela deve ser avaliada"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setEditingSkill(null);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateSkill}>
                <Save className="h-4 w-4 mr-2" />
                Atualizar Habilidade
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => {
                setNewSkill({
                  name: '',
                  domain: 'cognitive',
                  description: '',
                });
              }}>
                Limpar
              </Button>
              <Button onClick={handleAddSkill}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Habilidade
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Habilidades Cadastradas</h3>
        
        {skills.length === 0 ? (
          <div className="text-center p-6 bg-muted/30 rounded-md border">
            <p>Nenhuma habilidade cadastrada ainda.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-3">
              {skills.map((skill) => (
                <Card key={skill.id} className="overflow-hidden">
                  <div className="flex items-start p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{skill.name}</h4>
                        <Badge variant="outline">{getDomainName(skill.domain)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {skill.description || "Sem descrição"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
