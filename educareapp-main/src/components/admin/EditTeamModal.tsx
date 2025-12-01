import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

import { Team, UpdateTeamData } from '@/services/teamService';

interface EditTeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateTeamData) => Promise<boolean>;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  team,
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
    isActive: true,
  });

  // Atualizar formulário quando team mudar
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
        type: team.type || 'professional',
        logoUrl: team.logoUrl || '',
        isActive: team.isActive,
      });
    }
  }, [team]);

  // Função para resetar formulário
  const resetForm = () => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
        type: team.type || 'professional',
        logoUrl: team.logoUrl || '',
        isActive: team.isActive,
      });
    }
  };

  // Função para fechar modal
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  // Função para salvar alterações
  const handleSave = async () => {
    if (!formData.name.trim() || !team) {
      return;
    }

    setLoading(true);
    try {
      const updateData: UpdateTeamData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        logoUrl: formData.logoUrl.trim() || undefined,
        isActive: formData.isActive,
      };

      const success = await onSave(updateData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar campo do formulário
  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Equipe</DialogTitle>
          <DialogDescription>
            Atualize as informações da equipe "{team.name}"
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

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
              <CardDescription>
                Status e configurações da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Equipe Ativa</Label>
                  <div className="text-sm text-gray-500">
                    Equipes inativas não podem receber novos membros
                  </div>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateField('isActive', checked)}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações da Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Equipe</CardTitle>
              <CardDescription>
                Dados atuais da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Proprietário:</strong>
                  <div className="text-gray-600">{team.owner?.name}</div>
                  <div className="text-gray-500">{team.owner?.email}</div>
                </div>
                <div>
                  <strong>Membros:</strong>
                  <div className="text-gray-600">
                    {team.activeMemberCount} ativos
                    {team.pendingInvites > 0 && (
                      <span className="text-orange-600"> + {team.pendingInvites} pendentes</span>
                    )}
                  </div>
                </div>
                <div>
                  <strong>Criada em:</strong>
                  <div className="text-gray-600">
                    {new Date(team.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <strong>Última atualização:</strong>
                  <div className="text-gray-600">
                    {new Date(team.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
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
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamModal;
