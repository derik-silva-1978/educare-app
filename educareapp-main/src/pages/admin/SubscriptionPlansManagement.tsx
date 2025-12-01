import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { subscriptionPlansService, type SubscriptionPlan as APISubscriptionPlan } from '@/services/subscriptionPlansService';
import { debugAuthStatus, testAuthEndpoint } from '@/utils/authDebug';
import { getStoredAuthToken } from '@/utils/authStorage';

// Usar o tipo da API
type SubscriptionPlan = APISubscriptionPlan;

interface PlanFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  trial_days: number;
  features: Record<string, boolean>;
  limits: Record<string, number | string>;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
}

const defaultFeatures = {
  blogAccess: false,
  chatSupport: false,
  basicReports: false,
  tiriNautaWeb: false,
  educareAcademy: false,
  whatsappGroups: false,
  advancedReports: false,
  detailedReports: false,
  prioritySupport: false,
  basicAssessments: false,
  journeyDashboard: false,
  monthlyMentoring: false,
  livesAndMentoring: false,
  tiriNautaBusiness: false,
  tiriNautaComplete: false,
  tiriNautaWhatsapp: false,
  professionalSharing: false,
  progressNotifications: false,
  educareAcademyComplete: false
};

const defaultLimits = {
  maxChildren: 1,
  maxQuizzes: 5,
  maxJourneys: 2,
  maxDocuments: 10,
  maxProfessionals: 0
};

const SubscriptionPlansManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Aplicar estilo CSS global para overlay branco do modal
  React.useEffect(() => {
    const styleId = 'subscription-modal-overlay';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Estilo específico para overlay branco do modal */
        [data-radix-dialog-overlay] {
          background-color: white !important;
          opacity: 0.98 !important;
        }
        /* Garantir que funcione em todos os estados */
        .radix-dialog-overlay,
        [data-state="open"][data-radix-dialog-overlay],
        [data-radix-dialog-overlay][data-state="open"] {
          background-color: white !important;
          opacity: 0.98 !important;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: 0,
    currency: 'BRL',
    billing_cycle: 'monthly',
    trial_days: 0,
    features: { ...defaultFeatures },
    limits: { ...defaultLimits },
    is_active: true,
    is_public: true,
    sort_order: 1
  });

  // Verificar autenticação e permissões
  useEffect(() => {
    const token = getStoredAuthToken();
    
    // Se não há token, redirecionar para login
    if (!token) {
      console.warn('⚠️ No JWT token found - redirecting to login');
      toast({
        title: "Sessão Expirada",
        description: "Você precisa fazer login novamente para acessar esta página.",
        variant: "destructive",
      });
      navigate('/educare-app/login');
      return;
    }
    
    console.log('SubscriptionPlansManagement - User:', user);
    console.log('SubscriptionPlansManagement - User role:', user?.role);
    
    // Debug de autenticação
    const authStatus = debugAuthStatus();
    console.log('Auth Status:', authStatus);
    
    // Se o usuário está logado mas não tem permissão
    if (user && !['owner', 'admin'].includes(user.role)) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      navigate('/educare-app/dashboard');
      return;
    }
  }, [user, navigate, toast]);

  // Carregar planos
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await subscriptionPlansService.getAllPlans();
        setPlans(plansData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os planos de assinatura.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (user && ['owner', 'admin'].includes(user.role)) {
      loadPlans();
    }
  }, [user, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'BRL',
      billing_cycle: 'monthly',
      trial_days: 0,
      features: { ...defaultFeatures },
      limits: { ...defaultLimits },
      is_active: true,
      is_public: true,
      sort_order: 1
    });
    setEditingPlan(null);
  };

  const handleCreatePlan = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      trial_days: plan.trial_days,
      features: { ...defaultFeatures, ...plan.features },
      limits: { ...defaultLimits, ...plan.limits },
      is_active: plan.is_active,
      is_public: plan.is_public,
      sort_order: plan.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      let savedPlan: SubscriptionPlan;
      
      if (editingPlan) {
        // Atualizar plano existente
        savedPlan = await subscriptionPlansService.updatePlan(editingPlan.id, formData);
        const updatedPlans = plans.map(plan => 
          plan.id === editingPlan.id ? savedPlan : plan
        );
        setPlans(updatedPlans);
        toast({
          title: "Sucesso",
          description: "Plano atualizado com sucesso!",
        });
      } else {
        // Criar novo plano
        savedPlan = await subscriptionPlansService.createPlan(formData);
        setPlans([...plans, savedPlan]);
        toast({
          title: "Sucesso",
          description: "Plano criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível salvar o plano.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await subscriptionPlansService.deletePlan(planId);
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      setPlans(updatedPlans);
      
      toast({
        title: "Sucesso",
        description: "Plano excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível excluir o plano.",
        variant: "destructive",
      });
    }
  };

  const handleFeatureChange = (feature: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };

  const handleLimitChange = (limit: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limit]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestão de Planos | EducareApp</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Planos de Assinatura</h1>
            <p className="text-gray-600">Gerencie os planos e preços da plataforma</p>
          </div>
          <Button onClick={handleCreatePlan} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Plano</span>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Planos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{plans.length}</div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Planos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{plans.filter(p => p.is_active).length}</div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Planos Públicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{plans.filter(p => p.is_public).length}</div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(plans.reduce((sum, plan) => {
                    const price = typeof plan.price === 'number' && !isNaN(plan.price) ? plan.price : 0;
                    return sum + price;
                  }, 0))}
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Planos */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o plano "{plan.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePlan(plan.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
                    <Badge variant={plan.billing_cycle === 'monthly' ? 'default' : 'secondary'}>
                      {plan.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                      {plan.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Badge variant={plan.is_public ? 'outline' : 'secondary'}>
                      {plan.is_public ? 'Público' : 'Privado'}
                    </Badge>
                  </div>

                  {plan.trial_days > 0 && (
                    <div className="text-sm text-gray-600">
                      {plan.trial_days} dias de teste grátis
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    Ordem: {plan.sort_order}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog para Criar/Editar Plano */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Editar Plano' : 'Novo Plano'}
              </DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Edite as informações do plano de assinatura.' : 'Crie um novo plano de assinatura.'}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="features">Recursos</TabsTrigger>
                <TabsTrigger value="limits">Limites</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nome do Plano</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Plano Premium"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Moeda</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                        <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="billing_cycle">Ciclo de Cobrança</Label>
                    <Select value={formData.billing_cycle} onValueChange={(value: 'monthly' | 'yearly') => setFormData(prev => ({ ...prev, billing_cycle: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>



                  <div>
                    <Label htmlFor="trial_days">Dias de Teste Grátis</Label>
                    <Input
                      id="trial_days"
                      type="number"
                      value={formData.trial_days}
                      onChange={(e) => setFormData(prev => ({ ...prev, trial_days: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sort_order">Ordem de Exibição</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva os benefícios e características do plano..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Plano Ativo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_public"
                      checked={formData.is_public}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                    />
                    <Label htmlFor="is_public">Visível Publicamente</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {Object.entries(defaultFeatures).map(([feature, defaultValue]) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Switch
                        id={feature}
                        checked={formData.features[feature] || false}
                        onCheckedChange={(checked) => handleFeatureChange(feature, checked)}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="limits" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {Object.entries(defaultLimits).map(([limit, defaultValue]) => (
                    <div key={limit}>
                      <Label htmlFor={limit} className="text-sm">
                        {limit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <Input
                        id={limit}
                        type="number"
                        value={formData.limits[limit] || defaultValue}
                        onChange={(e) => handleLimitChange(limit, parseInt(e.target.value) || 0)}
                        placeholder={defaultValue.toString()}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSavePlan}>
                <Save className="h-4 w-4 mr-2" />
                {editingPlan ? 'Atualizar' : 'Criar'} Plano
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SubscriptionPlansManagement;
