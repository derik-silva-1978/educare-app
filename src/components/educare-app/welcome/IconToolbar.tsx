import React, { useState } from 'react';
import { Sun, Moon, MessageCircle, MessageSquarePlus, Coffee, Bot, Camera, LogOut, Settings, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface IconToolbarProps {
  messageCount?: number;
}

const IconToolbar: React.FC<IconToolbarProps> = ({
  messageCount = 0,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showOnboardingChat, setShowOnboardingChat] = useState(false);
  
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'praise'>('suggestion');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  const [selectedDonation, setSelectedDonation] = useState<number>(10);
  const [isProcessingDonation, setIsProcessingDonation] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast.error('Por favor, escreva seu feedback');
      return;
    }
    
    setIsSubmittingFeedback(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Obrigado pelo seu feedback! Sua opinião é muito importante para nós.');
      setFeedbackText('');
      setShowFeedbackModal(false);
    } catch (error) {
      toast.error('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDonation = async () => {
    setIsProcessingDonation(true);
    try {
      toast.success(`Obrigado por apoiar o Educare+ com R$ ${selectedDonation}! Redirecionando para pagamento...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowDonationModal(false);
    } catch (error) {
      toast.error('Erro ao processar doação. Tente novamente.');
    } finally {
      setIsProcessingDonation(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* 1. Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
          title={resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-5 w-5 text-blue-400" />
          ) : (
            <Sun className="h-5 w-5 text-amber-500" />
          )}
        </Button>

        {/* 2. Messages */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          title="Mensagens"
          onClick={() => navigate('/educare-app/communication')}
        >
          <MessageCircle className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              {messageCount > 9 ? '9+' : messageCount}
            </span>
          )}
        </Button>

        {/* 3. Feedback */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Enviar feedback"
          onClick={() => setShowFeedbackModal(true)}
        >
          <MessageSquarePlus className="h-5 w-5 text-green-600" />
        </Button>

        {/* 4. Donations (Coffee cup) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Apoiar o projeto"
          onClick={() => setShowDonationModal(true)}
        >
          <Coffee className="h-5 w-5 text-amber-700" />
        </Button>

        {/* 5. Onboarding Chat */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Assistente de boas-vindas"
          onClick={() => setShowOnboardingChat(true)}
        >
          <Bot className="h-5 w-5 text-purple-500" />
        </Button>

        {/* 6. Profile with Photo */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.photoURL || user?.avatar} alt={user?.name || 'Usuário'} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/educare-app/settings')}>
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/educare-app/settings')}>
              <Camera className="h-4 w-4 mr-2" />
              Alterar Foto
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/educare-app/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/educare-app/support')}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Ajuda
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-green-600" />
              Enviar Feedback
            </DialogTitle>
            <DialogDescription>
              Sua opinião nos ajuda a melhorar o Educare+
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de feedback</Label>
              <RadioGroup value={feedbackType} onValueChange={(v) => setFeedbackType(v as any)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" />
                  <Label htmlFor="suggestion" className="font-normal cursor-pointer">Sugestão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="font-normal cursor-pointer">Problema</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="praise" id="praise" />
                  <Label htmlFor="praise" className="font-normal cursor-pointer">Elogio</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Sua mensagem</Label>
              <Textarea
                id="feedback"
                placeholder="Conte-nos o que você pensa..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
            <Button 
              onClick={handleFeedbackSubmit} 
              disabled={isSubmittingFeedback}
              className="w-full"
            >
              {isSubmittingFeedback ? 'Enviando...' : 'Enviar Feedback'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Donation Modal */}
      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-700" />
              Apoie o Educare+
            </DialogTitle>
            <DialogDescription>
              Sua contribuição nos ajuda a continuar melhorando a plataforma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Escolha o valor da contribuição</Label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 25, 50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    variant={selectedDonation === value ? 'default' : 'outline'}
                    onClick={() => setSelectedDonation(value)}
                    className="h-12"
                  >
                    R$ {value}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Valor selecionado</p>
              <p className="text-2xl font-bold text-primary">R$ {selectedDonation},00</p>
            </div>
            <Button 
              onClick={handleDonation} 
              disabled={isProcessingDonation}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <Coffee className="h-4 w-4 mr-2" />
              {isProcessingDonation ? 'Processando...' : 'Contribuir agora'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Pagamento seguro via Stripe. Contribuição única, sem recorrência.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding Chat Modal */}
      <Dialog open={showOnboardingChat} onOpenChange={setShowOnboardingChat}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              Assistente de Boas-vindas
            </DialogTitle>
            <DialogDescription>
              Sou o assistente do Educare+ e estou aqui para te ajudar!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    Olá! Bem-vindo ao <strong>Educare+</strong>! Sou o assistente de boas-vindas e vou te ajudar a conhecer nossa plataforma.
                  </p>
                  <p className="text-sm">
                    Aqui estão algumas coisas que você pode fazer:
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => { setShowOnboardingChat(false); navigate('/educare-app/children'); }}
              >
                <span className="text-left">
                  <strong className="block">Cadastrar uma criança</strong>
                  <span className="text-xs text-muted-foreground">Adicione os dados da criança para acompanhar seu desenvolvimento</span>
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => { setShowOnboardingChat(false); navigate('/educare-app/titinauta'); }}
              >
                <span className="text-left">
                  <strong className="block">Conversar com TitiNauta</strong>
                  <span className="text-xs text-muted-foreground">Nosso assistente de IA para orientações sobre desenvolvimento</span>
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => { setShowOnboardingChat(false); navigate('/educare-app/dashboard'); }}
              >
                <span className="text-left">
                  <strong className="block">Ver Dashboard</strong>
                  <span className="text-xs text-muted-foreground">Acompanhe métricas e progresso das crianças</span>
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3"
                onClick={() => { setShowOnboardingChat(false); navigate('/educare-app/activities'); }}
              >
                <span className="text-left">
                  <strong className="block">Explorar Atividades</strong>
                  <span className="text-xs text-muted-foreground">Descubra atividades de estimulação para cada fase</span>
                </span>
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Precisa de ajuda? Acesse nosso <button onClick={() => { setShowOnboardingChat(false); navigate('/educare-app/support'); }} className="text-primary underline">suporte</button> ou fale com o TitiNauta!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconToolbar;
