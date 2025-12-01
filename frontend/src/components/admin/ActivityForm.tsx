import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';
import { Activity, CreateActivityData, UpdateActivityData } from '../../services/activityService';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: CreateActivityData | UpdateActivityData) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

const CATEGORIES = [
  'motor',
  'cognitive',
  'sensory',
  'communication',
  'social_emotional',
  'nutrition',
  'baby_health',
  'maternal_health',
  'maternal_self_care'
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' }
];

export const ActivityForm: React.FC<ActivityFormProps> = ({
  activity,
  onSubmit,
  onCancel,
  loading = false
}) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    min_age_months: 0,
    max_age_months: 12,
    category: '',
    difficulty_level: 'easy' as const,
    duration_minutes: 15,
    materials_needed: [] as string[],
    instructions: [] as string[],
    benefits: [] as string[],
    safety_tips: [] as string[],
    is_active: true
  });

  // Estados para inputs temporários
  const [newMaterial, setNewMaterial] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newSafetyTip, setNewSafetyTip] = useState('');

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
        min_age_months: activity.min_age_months,
        max_age_months: activity.max_age_months,
        category: activity.category,
        difficulty_level: activity.difficulty_level,
        duration_minutes: activity.duration_minutes,
        materials_needed: activity.materials_needed || [],
        instructions: activity.instructions || [],
        benefits: activity.benefits || [],
        safety_tips: activity.safety_tips || [],
        is_active: activity.is_active
      });
    }
  }, [activity]);

  // Atualizar campo do formulário
  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Adicionar item a uma lista
  const addToList = (field: keyof typeof formData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentList = formData[field] as string[];
      updateField(field, [...currentList, value.trim()]);
      setter('');
    }
  };

  // Remover item de uma lista
  const removeFromList = (field: keyof typeof formData, index: number) => {
    const currentList = formData[field] as string[];
    updateField(field, currentList.filter((_, i) => i !== index));
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.title.trim()) {
      alert('Título é obrigatório');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Descrição é obrigatória');
      return;
    }
    
    if (!formData.category) {
      alert('Categoria é obrigatória');
      return;
    }
    
    if (formData.min_age_months >= formData.max_age_months) {
      alert('Idade mínima deve ser menor que a idade máxima');
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      // Limpar formulário se for criação
      if (!activity) {
        setFormData({
          title: '',
          description: '',
          min_age_months: 0,
          max_age_months: 12,
          category: '',
          difficulty_level: 'easy',
          duration_minutes: 15,
          materials_needed: [],
          instructions: [],
          benefits: [],
          safety_tips: [],
          is_active: true
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {activity ? 'Editar Atividade' : 'Nova Atividade'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex: Brincadeira com chocalho"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateField('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descreva a atividade..."
              rows={3}
              required
            />
          </div>

          {/* Configurações da Atividade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_age">Idade Mínima (meses) *</Label>
              <Input
                id="min_age"
                type="number"
                min="0"
                max="60"
                value={formData.min_age_months}
                onChange={(e) => updateField('min_age_months', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_age">Idade Máxima (meses) *</Label>
              <Input
                id="max_age"
                type="number"
                min="1"
                max="60"
                value={formData.max_age_months}
                onChange={(e) => updateField('max_age_months', parseInt(e.target.value) || 12)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="120"
                value={formData.duration_minutes}
                onChange={(e) => updateField('duration_minutes', parseInt(e.target.value) || 15)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Nível de Dificuldade</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => updateField('difficulty_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => updateField('is_active', checked)}
              />
              <Label htmlFor="is_active">Atividade ativa</Label>
            </div>
          </div>

          {/* Materiais Necessários */}
          <div className="space-y-2">
            <Label>Materiais Necessários</Label>
            <div className="flex gap-2">
              <Input
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Ex: Chocalho colorido"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToList('materials_needed', newMaterial, setNewMaterial);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addToList('materials_needed', newMaterial, setNewMaterial)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.materials_needed.map((material, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {material}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFromList('materials_needed', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Instruções */}
          <div className="space-y-2">
            <Label>Instruções</Label>
            <div className="flex gap-2">
              <Input
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Ex: Balançar o chocalho suavemente"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToList('instructions', newInstruction, setNewInstruction);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addToList('instructions', newInstruction, setNewInstruction)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm flex-1">{index + 1}. {instruction}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-red-500"
                    onClick={() => removeFromList('instructions', index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-2">
            <Label>Benefícios</Label>
            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Ex: Desenvolve coordenação motora"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToList('benefits', newBenefit, setNewBenefit);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addToList('benefits', newBenefit, setNewBenefit)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {benefit}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFromList('benefits', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Dicas de Segurança */}
          <div className="space-y-2">
            <Label>Dicas de Segurança</Label>
            <div className="flex gap-2">
              <Input
                value={newSafetyTip}
                onChange={(e) => setNewSafetyTip(e.target.value)}
                placeholder="Ex: Sempre supervisionar a criança"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToList('safety_tips', newSafetyTip, setNewSafetyTip);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addToList('safety_tips', newSafetyTip, setNewSafetyTip)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.safety_tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <span className="text-sm flex-1">⚠️ {tip}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-red-500"
                    onClick={() => removeFromList('safety_tips', index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (activity ? 'Atualizar' : 'Criar')} Atividade
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
