import React, { useState } from 'react';
import { Sun, Moon, MessageCircle, MessageSquarePlus, Coffee, Bot, Camera, LogOut, Settings, HelpCircle, User, Send } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ragService from '@/services/api/ragService';
import RAGProgressBar from '@/components/educare-app/RAGProgressBar';

interface IconToolbarProps {
  messageCount?: number;
  isProfessional?: boolean;
}

const IconToolbar: React.FC<IconToolbarProps> = ({
  messageCount = 0,
  isProfessional = false,
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
  
  const getInitialMessage = () => {
    if (isProfessional) {
      return 'Olá! Sou o TitiNauta Especialista, seu assistente de IA para profissionais de saúde. Posso ajudar com protocolos clínicos, orientações de acompanhamento, marcos de desenvolvimento e práticas baseadas em evidências para a primeira infância.';
    }
    return 'Olá! Sou o TitiNauta, o assistente de IA do Educare+. Posso responder suas dúvidas sobre desenvolvimento infantil, estimulação, marcos de desenvolvimento e muito mais!';
  };

  const [chatMessages, setChatMessages] = useState<Array<{role: 'assistant' | 'user', content: string}>>([
    { role: 'assistant', content: getInitialMessage() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState<'idle' | 'retrieving' | 'processing' | 'generating'>('idle');
  const [ragError, setRagError] = useState<string>('');

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
    setRagError('');
    
    try {
      const moduleType = isProfessional ? 'professional' : 'baby';
      const response = await ragService.askQuestion(userMessage, undefined, {
        module_type: moduleType,
        onProgress: (status) => setRagStatus(status)
      });

      if (response.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
      } else {
        throw new Error(isProfessional ? 'Falha ao obter resposta do TitiNauta Especialista' : 'Falha ao obter resposta do TitiNauta');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao processar pergunta. Tente novamente.';
      setRagError(errorMsg);
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Desculpe, tive um problema ao processar sua pergunta. ${errorMsg}` }]);
    } finally {
      setIsChatLoading(false);
      setRagStatus('idle');
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

        {/* 5. TitiNauta Chat (Especialista for professionals) */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 transition-colors ${
            isProfessional 
              ? 'hover:bg-teal-100 dark:hover:bg-teal-900/30' 
              : 'hover:bg-violet-100 dark:hover:bg-violet-900/30'
          }`}
          title={isProfessional ? "TitiNauta Especialista" : "TitiNauta - Assistente"}
          onClick={() => setShowOnboardingChat(true)}
        >
          <Bot className={`h-5 w-5 ${
            isProfessional 
              ? 'text-teal-600 dark:text-teal-400' 
              : 'text-violet-600 dark:text-violet-400'
          }`} />
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

      {/* TitiNauta AI Chat Sheet (lateral) - Paleta suave e acolhedora */}
      <Sheet open={showOnboardingChat} onOpenChange={setShowOnboardingChat}>
        <SheetContent 
          side="right" 
          className={`w-full sm:max-w-md flex flex-col h-full p-0 ${
            isProfessional 
              ? 'bg-gradient-to-b from-slate-50 to-teal-50/30 dark:from-slate-950 dark:to-teal-950/20' 
              : 'bg-gradient-to-b from-slate-50 to-violet-50/30 dark:from-slate-950 dark:to-violet-950/20'
          }`}
        >
          <SheetHeader className={`px-4 py-4 border-b ${
            isProfessional 
              ? 'bg-gradient-to-r from-teal-100/80 to-emerald-100/60 dark:from-teal-900/30 dark:to-emerald-900/20 border-teal-200/60 dark:border-teal-700/50' 
              : 'bg-gradient-to-r from-violet-100/80 to-fuchsia-100/60 dark:from-violet-900/30 dark:to-fuchsia-900/20 border-violet-200/60 dark:border-violet-700/50'
          }`}>
            <SheetTitle className={`flex items-center gap-2 ${
              isProfessional 
                ? 'text-teal-800 dark:text-teal-100' 
                : 'text-violet-800 dark:text-violet-100'
            }`}>
              <div className={`p-1.5 rounded-lg ${
                isProfessional 
                  ? 'bg-teal-500/20 dark:bg-teal-500/30' 
                  : 'bg-violet-500/20 dark:bg-violet-500/30'
              }`}>
                <Bot className={`h-4 w-4 ${
                  isProfessional 
                    ? 'text-teal-600 dark:text-teal-300' 
                    : 'text-violet-600 dark:text-violet-300'
                }`} />
              </div>
              {isProfessional ? 'TitiNauta Especialista' : 'TitiNauta - Assistente de IA'}
            </SheetTitle>
            <SheetDescription className={`text-xs ${
              isProfessional 
                ? 'text-teal-600 dark:text-teal-300' 
                : 'text-violet-600 dark:text-violet-300'
            }`}>
              {isProfessional 
                ? 'Protocolos clínicos, marcos de desenvolvimento e práticas baseadas em evidências'
                : 'Desenvolvimento infantil, estimulação e marcos de desenvolvimento'}
            </SheetDescription>
          </SheetHeader>
          
          {/* Chat Messages - Fundo suave */}
          <div className={`flex-1 overflow-y-auto space-y-3 p-4 ${
            isProfessional 
              ? 'bg-gradient-to-b from-white to-teal-50/20 dark:from-slate-950 dark:to-teal-950/10' 
              : 'bg-gradient-to-b from-white to-violet-50/20 dark:from-slate-950 dark:to-violet-950/10'
          }`}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.role === 'assistant'
                    ? isProfessional 
                      ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-teal-100 dark:border-teal-800/50'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-violet-100 dark:border-violet-800/50'
                    : isProfessional
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {/* Quick Suggestions - Sugestões com estilo suave */}
            {chatMessages.length === 1 && !isChatLoading && (
              <div className="mt-4 space-y-3">
                <p className={`text-xs font-medium ${
                  isProfessional 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-violet-600 dark:text-violet-400'
                }`}>
                  Sugestões de perguntas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(isProfessional ? [
                    'Marcos de desenvolvimento aos 6 meses',
                    'Sinais de alerta no desenvolvimento motor',
                    'Protocolo de avaliação auditiva neonatal',
                    'Estimulação para bebês prematuros'
                  ] : [
                    'Como estimular meu bebê de 3 meses?',
                    'Quando meu bebê deve começar a sentar?',
                    'Atividades para desenvolvimento motor',
                    'Alimentação complementar: como começar?'
                  ]).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setChatInput(suggestion);
                      }}
                      className={`text-xs px-3 py-2 rounded-xl transition-all duration-200 border shadow-sm ${
                        isProfessional
                          ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 dark:hover:border-teal-600'
                          : 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-300 dark:hover:border-violet-600'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RAG Progress Bar */}
          <div className={`px-4 py-2 ${
            isProfessional 
              ? 'bg-teal-50/50 dark:bg-teal-950/20' 
              : 'bg-violet-50/50 dark:bg-violet-950/20'
          }`}>
            <RAGProgressBar
              isLoading={isChatLoading}
              status={ragStatus}
              message="Consultando base de conhecimento..."
              error={ragError}
            />
          </div>
          
          {/* Chat Input - Área de entrada suave */}
          <div className={`flex gap-2 p-4 border-t ${
            isProfessional 
              ? 'bg-white dark:bg-slate-900 border-teal-100 dark:border-teal-800/50' 
              : 'bg-white dark:bg-slate-900 border-violet-100 dark:border-violet-800/50'
          }`}>
            <Input
              placeholder="Faça uma pergunta..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
              disabled={isChatLoading}
              className={`flex-1 rounded-xl border ${
                isProfessional 
                  ? 'border-teal-200 dark:border-teal-700 focus:border-teal-400 focus:ring-teal-400/30' 
                  : 'border-violet-200 dark:border-violet-700 focus:border-violet-400 focus:ring-violet-400/30'
              }`}
            />
            <Button
              size="sm"
              onClick={handleChatMessage}
              disabled={isChatLoading || !chatInput.trim()}
              className={`px-4 rounded-xl transition-all ${
                isProfessional 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-sm' 
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-sm'
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default IconToolbar;
