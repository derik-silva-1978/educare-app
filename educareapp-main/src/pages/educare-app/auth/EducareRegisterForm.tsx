
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import type { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { validateRegisterForm } from '@/utils/form-validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Phone, CreditCard } from 'lucide-react';
import { subscriptionPlansService, type SubscriptionPlan } from '@/services/subscriptionPlansService';

const EducareRegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  
  const { handleRegister } = useAuth();
  const { toast } = useToast();

  // Carregar planos públicos disponíveis
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        const plans = await subscriptionPlansService.getPublicPlans();
        setAvailablePlans(plans);
        
        // Selecionar o primeiro plano por padrão se houver
        if (plans.length > 0) {
          setSelectedPlan(plans[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos disponíveis.",
        });
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, [toast]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!name.trim()) {
        toast({
          variant: "destructive",
          title: "Nome obrigatório",
          description: "Por favor, informe seu nome completo.",
        });
        setIsLoading(false);
        return;
      }

      if (!email.trim()) {
        toast({
          variant: "destructive",
          title: "Email obrigatório",
          description: "Por favor, informe seu email.",
        });
        setIsLoading(false);
        return;
      }

      if (!password.trim() || password.length < 6) {
        toast({
          variant: "destructive",
          title: "Senha inválida",
          description: "A senha deve ter pelo menos 6 caracteres.",
        });
        setIsLoading(false);
        return;
      }

      if (!phone.trim()) {
        toast({
          variant: "destructive",
          title: "Telefone obrigatório",
          description: "Por favor, informe seu telefone/WhatsApp.",
        });
        setIsLoading(false);
        return;
      }

      if (!selectedPlan) {
        toast({
          variant: "destructive",
          title: "Plano obrigatório",
          description: "Por favor, selecione um plano de assinatura.",
        });
        setIsLoading(false);
        return;
      }

      if (!agreeTerms) {
        toast({
          variant: "destructive",
          title: "Termos obrigatórios",
          description: "Você deve aceitar os Termos de Uso e Política de Privacidade.",
        });
        setIsLoading(false);
        return;
      }

      // Integrar telefone e plano no registro
      console.log('=== DEBUG FORMULARIO - Chamando handleRegister ===');
      console.log('name:', name);
      console.log('email:', email);
      console.log('password:', '***');
      console.log('role:', role);
      console.log('agreeTerms:', agreeTerms);
      console.log('phone:', phone);
      console.log('selectedPlan:', selectedPlan);
      console.log('selectedPlan type:', typeof selectedPlan);
      console.log('selectedPlan length:', selectedPlan?.length);
      console.log('availablePlans:', availablePlans.map(p => ({ id: p.id, name: p.name })));
      console.log('=== FIM DEBUG FORMULARIO ===');
      
      await handleRegister(name, email, password, 'parent', agreeTerms, phone, selectedPlan);
      
      // Set app-specific login flag
      localStorage.setItem('educareAppLoggedIn', 'true');
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode acessar o Educare App.",
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Não foi possível completar seu cadastro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">
            <Phone className="inline w-4 h-4 mr-1" />
            Telefone/WhatsApp *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Usado para comunicação e suporte via WhatsApp
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Perfil</Label>
          <Select 
            value={role} 
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Responsável (Mãe)</SelectItem>
              <SelectItem value="professional">Profissional</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {role === 'parent' ? 
              'Como Responsável, você terá acesso aos dados do seu filho.' : 
              'Como Profissional, você poderá acompanhar múltiplas crianças e seus responsáveis.'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plan">
            <CreditCard className="inline w-4 h-4 mr-1" />
            Plano de Assinatura *
          </Label>
          {loadingPlans ? (
            <div className="flex items-center justify-center p-4 border rounded-md">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Carregando planos...
            </div>
          ) : (
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => setSelectedPlan(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {availablePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-sm text-gray-500">
                        R$ {plan.price.toFixed(2)}/{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                        {plan.trial_days > 0 && ` • ${plan.trial_days} dias grátis`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedPlan && availablePlans.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-md">
              {(() => {
                const plan = availablePlans.find(p => p.id === selectedPlan);
                return plan ? (
                  <div>
                    <p className="text-sm font-medium text-blue-900">{plan.name}</p>
                    <p className="text-xs text-blue-700 mt-1">{plan.description}</p>
                    {plan.trial_days > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        ✨ Teste grátis por {plan.trial_days} dias
                      </p>
                    )}
                  </div>
                ) : null;
              })()
              }
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          />
          <Label 
            htmlFor="terms" 
            className="text-sm text-gray-700"
          >
            Eu aceito os Termos de Uso e Política de Privacidade
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default EducareRegisterForm;
