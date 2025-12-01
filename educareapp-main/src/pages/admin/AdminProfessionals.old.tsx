import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProfessionalManagement } from '@/hooks/useProfessionalManagement';
import { Professional } from '@/services/api/professionalService';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRoleName } from '@/utils/auth-utils';
import { Search, UserPlus, Edit, Trash2, Filter, Users, GraduationCap, Stethoscope, Brain } from 'lucide-react';
import httpClient from '@/services/api/httpClient';

interface ProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
  onSubmit: (professionalData: Partial<Professional>) => void;
}

const ProfessionalDialog: React.FC<ProfessionalDialogProps> = ({
  open,
  onOpenChange,
  professional,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: professional?.name || '',
    email: professional?.email || '',
    role: professional?.role || 'professional' as UserRole,
    phone: professional?.phone || '',
    profession: professional?.profile?.profession || '',
    specialization: professional?.profile?.specialization || '',
    registration_number: professional?.profile?.registration_number || '',
    bio: professional?.profile?.bio || ''
  });
  
  // Reset form when professional changes
  React.useEffect(() => {
    setFormData({
      name: professional?.name || '',
      email: professional?.email || '',
      role: professional?.role || 'professional' as UserRole,
      phone: professional?.phone || '',
      profession: professional?.profile?.profession || '',
      specialization: professional?.profile?.specialization || '',
      registration_number: professional?.profile?.registration_number || '',
      bio: professional?.profile?.bio || ''
    });
  }, [professional]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="admin" className="bg-white border-gray-300">
        <DialogHeader>
          <DialogTitle variant="admin" className="text-gray-900 text-xl">
            {professional ? 'Editar Profissional' : 'Novo Profissional'}
          </DialogTitle>
          <DialogDescription variant="admin" className="text-gray-700">
            {professional
              ? 'Edite as informações do profissional'
              : 'Preencha os dados para cadastrar um novo profissional'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 font-medium">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              placeholder="Ex: Dr. João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">Email Profissional</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="profissional@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900 font-medium">Telefone/WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession" className="text-gray-900 font-medium">Profissão</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              placeholder="Ex: Psicólogo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization" className="text-gray-900 font-medium">Especialidade</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              placeholder="Ex: Psicologia Clínica"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration_number" className="text-gray-900 font-medium">Número de Registro</Label>
            <Input
              id="registration_number"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              placeholder="Ex: 123456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-900 font-medium">Biografia</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              placeholder="Ex: Psicólogo com experiência em..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-900 font-medium">Especialidade</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
              <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Profissional Geral</SelectItem>
                <SelectItem value="teacher">Professor</SelectItem>
                <SelectItem value="therapist">Terapeuta</SelectItem>
                <SelectItem value="psychologist">Psicólogo</SelectItem>
                <SelectItem value="specialist">Especialista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {professional ? 'Salvar Alterações' : 'Cadastrar Profissional'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminProfessionals: React.FC = () => {

  
  const { 
    professionals, 
    isLoading, 
    error,
    addProfessional, 
    updateProfessionalData, 
    removeProfessional 
  } = useProfessionalManagement();
  
  console.log('🚀 Hook useProfessionalManagement executado!');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null);

  // Debug logs
  console.log('AdminProfessionals - Estado atual:');
  console.log('\n=== INÍCIO DEBUG AdminProfessionals ===');
  console.log('🔢 professionals.length:', professionals.length);
  console.log('⏳ isLoading:', isLoading);
  console.log('❌ error:', error || 'nenhum erro');
  console.log('📋 professionals array completo:', professionals);
  
  // Debug individual de cada profissional
  professionals.forEach((prof, index) => {
    console.log(`\n👤 PROFISSIONAL ${index + 1} no frontend:`);
    console.log('  - ID:', prof.id);
    console.log('  - Nome:', prof.name);
    console.log('  - Email:', prof.email);
    console.log('  - Role:', prof.role);
    console.log('  - Status:', prof.status);
    console.log('  - Profile existe?', !!prof.profile);
    if (prof.profile) {
      console.log('  - Profile.profession:', prof.profile.profession);
      console.log('  - Profile.specialization:', prof.profile.specialization);
    }
  });
  
  console.log('\n🔍 FILTROS APLICADOS:');
  console.log('  - searchQuery:', searchQuery);
  console.log('  - selectedSpecialty:', selectedSpecialty);
  console.log('  - selectedStatus:', selectedStatus);

  // Aplicar filtros (corrigido para aceitar profissionais sem especialidade)
  const filteredProfessionals = professionals.filter(professional => {
    // Busca por nome, email, profissão ou especialização (aceita valores null)
    const matchesSearch = searchQuery === '' || 
                         professional.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (professional.profile?.profession && professional.profile.profession.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (professional.profile?.specialization && professional.profile.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filtro de especialidade (aceita profissionais sem especialidade quando 'all' está selecionado)
    const matchesSpecialty = selectedSpecialty === 'all' ||
                           professional.role === selectedSpecialty ||
                           (professional.profile?.profession && professional.profile.profession.toLowerCase() === selectedSpecialty.toLowerCase()) ||
                           (professional.profile?.specialization && professional.profile.specialization.toLowerCase() === selectedSpecialty.toLowerCase());

    // Filtro de status
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && professional.status === 'active') ||
                         (selectedStatus === 'inactive' && professional.status === 'inactive') ||
                         (selectedStatus === 'pending' && professional.status === 'pending');

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  // Debug logs dos filtros
  console.log('- filteredProfessionals:', filteredProfessionals);
  console.log('- filteredProfessionals.length:', filteredProfessionals.length);
  console.log('- searchQuery:', searchQuery);
  console.log('- selectedSpecialty:', selectedSpecialty);
  console.log('- selectedStatus:', selectedStatus);
  
  // Verificar se há dados para exibir
  if (professionals.length > 0) {
    console.log('✅ Dados de profissionais carregados:', professionals[0]);
  } else {
    console.log('❌ Nenhum dado de profissional carregado');
  }

  const handleAddProfessional = () => {
    setCurrentProfessional(null);
    setDialogOpen(true);
  };

  const handleEditProfessional = (professional: Professional) => {
    setCurrentProfessional(professional);
    setDialogOpen(true);
  };

  const handleDeleteProfessional = (professionalId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      removeProfessional(professionalId);
    }
  };

  const handleSubmitProfessional = async (professionalData: Partial<Professional>) => {
    if (currentProfessional) {
      // Atualizar profissional existente
      await updateProfessionalData(currentProfessional.id, {
        name: professionalData.name,
        email: professionalData.email,
        role: professionalData.role,
        phone: professionalData.phone,
        profession: professionalData.profile?.profession,
        specialization: professionalData.profile?.specialization,
        registration_number: professionalData.profile?.registration_number,
        bio: professionalData.profile?.bio
      });
    } else {
      // Criar novo profissional
      await addProfessional({
        name: professionalData.name || '',
        email: professionalData.email || '',
        password: '123456', // Senha padrão - deve ser alterada no primeiro login
        role: professionalData.role || 'professional',
        phone: professionalData.phone,
        profession: professionalData.profile?.profession,
        specialization: professionalData.profile?.specialization,
        registration_number: professionalData.profile?.registration_number,
        bio: professionalData.profile?.bio
      });
    }
  };

  const getSpecialtyIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <GraduationCap className="h-4 w-4" />;
      case 'therapist': return <Stethoscope className="h-4 w-4" />;
      case 'psychologist': return <Brain className="h-4 w-4" />;
      case 'specialist': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getSpecialtyColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-green-100 text-green-800 border-green-200';
      case 'therapist': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'psychologist': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'specialist': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestão de Profissionais - Educare+</title>
        <meta name="description" content="Gerencie profissionais da plataforma Educare+" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Gestão de Profissionais
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie professores, terapeutas e especialistas da plataforma
            </p>
          </div>

          <Button onClick={handleAddProfessional} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Profissional
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>Buscar e filtrar profissionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todas as especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as especialidades</SelectItem>
                    <SelectItem value="professional">Profissional Geral</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="therapist">Terapeuta</SelectItem>
                    <SelectItem value="psychologist">Psicólogo</SelectItem>
                    <SelectItem value="specialist">Especialista</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Profissionais</CardTitle>
            <CardDescription>
              {filteredProfessionals.length} profissional(is) encontrado(s) de {professionals.length} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessionals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchQuery || selectedSpecialty !== 'all' || selectedStatus !== 'all'
                          ? 'Nenhum profissional encontrado com os filtros aplicados'
                          : 'Nenhum profissional cadastrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                {getSpecialtyIcon(professional.role)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{professional.name}</div>
                              <div className="text-sm text-gray-500">ID: {professional.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{professional.email}</div>
                            {professional.phone && (
                              <div className="text-sm text-gray-500">{professional.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getSpecialtyColor(professional.role)}
                          >
                            {getRoleName(professional.role as UserRole)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={professional.status === 'active' ? "default" : "secondary"}>
                            {professional.status === 'active' ? 'Ativo' : professional.status === 'inactive' ? 'Inativo' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {professional.last_login_at ? 
                              new Date(professional.last_login_at).toLocaleDateString('pt-BR') : 
                              'Nunca'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {new Date(professional.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8" 
                              onClick={() => handleEditProfessional(professional)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
                              onClick={() => handleDeleteProfessional(professional.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ProfessionalDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        professional={currentProfessional}
        onSubmit={handleSubmitProfessional}
      />
    </>
  );
};

export default AdminProfessionals;
