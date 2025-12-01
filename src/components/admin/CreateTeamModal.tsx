import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

import { CreateTeamData } from '@/services/teamService';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTeamData) => Promise<boolean>;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'professional' as 'professional' | 'educational' | 'family' | 'other',
    logoUrl: '',
  });

  // Função para resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'professional',
      logoUrl: '',
    });
  };

  // Função para fechar modal
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  // Função para salvar equipe
  const handleSave = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setLoading(true);
    try {
      const teamData: CreateTeamData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        logoUrl: formData.logoUrl.trim() || undefined,
      };

      const success = await onSave(teamData);
      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar campo do formulário
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Equipe</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar uma nova equipe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Equipe *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Equipe de Desenvolvimento Infantil"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o propósito e objetivos da equipe..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo da Equipe</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => updateField('type', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="educational">Educacional</SelectItem>
                    <SelectItem value="family">Família</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo (opcional)</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://exemplo.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => updateField('logoUrl', e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações sobre tipos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Equipe</CardTitle>
              <CardDescription>
                Entenda os diferentes tipos de equipe disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-600">Profissional:</strong> Equipes formadas por profissionais de saúde, terapeutas, psicólogos, etc.
                </div>
                <div>
                  <strong className="text-green-600">Educacional:</strong> Equipes de educadores, professores e profissionais da educação.
                </div>
                <div>
                  <strong className="text-purple-600">Família:</strong> Grupos familiares para acompanhamento conjunto de crianças.
                </div>
                <div>
                  <strong className="text-gray-600">Outro:</strong> Outros tipos de equipes personalizadas.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading || !formData.name.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Equipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
