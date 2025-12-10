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
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  const [selectedDonation, setSelectedDonation] = useState<number>(10);
  const [donationEmail, setDonationEmail] = useState('');
  const [isProcessingDonation, setIsProcessingDonation] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Array<{role: 'assistant' | 'user', content: string}>>([
    { role: 'assistant', content: 'Olá! Sou o assistente do Educare+. Como posso te ajudar hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

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
      const feedbackData = {
        type: feedbackType,
        message: feedbackText,
        rating: feedbackRating,
        timestamp: new Date().toISOString(),
      };
      console.log('Feedback enviado:', feedbackData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Obrigado pela sua opinião! Ela nos ajuda a melhorar cada vez mais.');
      setFeedbackText('');
      setFeedbackRating(5);
      setShowFeedbackModal(false);
    } catch (error) {
      toast.error('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDonation = async () => {
    if (!donationEmail.trim()) {
      toast.error('Por favor, informe um e-mail para receber confirmação');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donationEmail)) {
      toast.error('Por favor, informe um e-mail válido');
      return;
    }
    
    setIsProcessingDonation(true);
    try {
      const donationData = {
        amount: selectedDonation,
        email: donationEmail,
        timestamp: new Date().toISOString(),
      };
      console.log('Doação registrada:', donationData);
      
      toast.success(`Obrigado por apoiar o Educare+ com R$ ${selectedDonation}! Redirecionando para pagamento...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowDonationModal(false);
      setDonationEmail('');
      setSelectedDonation(10);
    } catch (error) {
      toast.error('Erro ao processar doação. Tente novamente.');
    } finally {
      setIsProcessingDonation(false);
    }
  };

  const handleChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const responses: { [key: string]: string } = {
        'cadastr': 'Para cadastrar uma criança, clique no botão "Cadastrar uma criança" abaixo! Você precisará informar nome, data de nascimento e outras informações importantes.',
        'titinaut': 'TitiNauta é nosso assistente de IA especializado em desenvolvimento infantil. Ele pode responder suas dúvidas sobre estimulação, marcos de desenvolvimento e muito mais!',
        'dashboard': 'No Dashboard você consegue acompanhar o progresso das suas crianças com gráficos, marcos de desenvolvimento e recomendações personalizadas.',
        'atividade': 'Explore nossa biblioteca de atividades de estimulação separadas por idade e área de desenvolvimento!',
        'ajuda': 'Estou aqui para ajudar! Você pode falar comigo sobre qualquer funcionalidade da plataforma.',
      };
      
      let responseText = 'Como posso te ajudar? Posso orientar sobre cadastro de crianças, TitiNauta, Dashboard, atividades e muito mais!';
      for (const [key, value] of Object.entries(responses)) {
        if (userMessage.toLowerCase().includes(key)) {
          responseText = value;
          break;
        }
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } finally {
      setIsChatLoading(false);
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
              Sua opinião é muito importante para nós
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de feedback</Label>
              <RadioGroup value={feedbackType} onValueChange={(v) => setFeedbackType(v as any)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" />
                  <Label htmlFor="suggestion" className="font-normal cursor-pointer text-sm">Sugestão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="font-normal cursor-pointer text-sm">Problema</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="praise" id="praise" />
                  <Label htmlFor="praise" className="font-normal cursor-pointer text-sm">Elogio</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Como você avalia sua experiência? (1-10)</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setFeedbackRating(num)}
                    className={`flex-1 py-2 text-sm font-medium rounded transition-all ${
                      feedbackRating === num
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
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
            
            <div className="space-y-2">
              <Label htmlFor="donation-email">E-mail para confirmação</Label>
              <input
                id="donation-email"
                type="email"
                placeholder="seu@email.com"
                value={donationEmail}
                onChange={(e) => setDonationEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm"
              />
            </div>
            
            <Button 
              onClick={handleDonation} 
              disabled={isProcessingDonation || !donationEmail.trim()}
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
        <DialogContent className="sm:max-w-lg h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              Assistente de Boas-vindas
            </DialogTitle>
          </DialogHeader>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 py-4 px-1">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs rounded-lg p-3 ${
                  msg.role === 'assistant'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '100ms' }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '200ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          {chatMessages.length === 1 && !isChatLoading && (
            <div className="grid grid-cols-2 gap-2 py-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-auto py-2"
                onClick={() => setChatInput('Como cadastro uma criança?')}
              >
                Cadastrar criança
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-auto py-2"
                onClick={() => setChatInput('O que é TitiNauta?')}
              >
                Conhecer TitiNauta
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-auto py-2"
                onClick={() => setChatInput('Como funciona o dashboard?')}
              >
                Ver Dashboard
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-auto py-2"
                onClick={() => setChatInput('Quais atividades vocês têm?')}
              >
                Explorar Atividades
              </Button>
            </div>
          )}
          
          {/* Chat Input */}
          <div className="flex gap-2 pt-4 border-t">
            <input
              type="text"
              placeholder="Digite sua pergunta..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
              disabled={isChatLoading}
              className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground text-sm"
            />
            <Button
              size="sm"
              onClick={handleChatMessage}
              disabled={isChatLoading || !chatInput.trim()}
              className="px-3"
            >
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconToolbar;
