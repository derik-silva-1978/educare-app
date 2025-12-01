import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemporaryPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalName: string;
  professionalEmail: string;
  temporaryPassword: string;
}

const TemporaryPasswordModal: React.FC<TemporaryPasswordModalProps> = ({
  isOpen,
  onClose,
  professionalName,
  professionalEmail,
  temporaryPassword,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const { toast } = useToast();

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Senha temporária copiada para a área de transferência",
        variant: "default",
      });
      
      // Reset do ícone após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive",
      });
    }
  };

  const handleCopyCredentials = async () => {
    const credentials = `Credenciais de Acesso - ${professionalName}

Email: ${professionalEmail}
Senha Temporária: ${temporaryPassword}

⚠️ IMPORTANTE: Esta é uma senha temporária que deve ser alterada no primeiro acesso.

Acesse: ${window.location.origin}/educare-app/auth
`;

    try {
      await navigator.clipboard.writeText(credentials);
      toast({
        title: "Credenciais Copiadas!",
        description: "Todas as informações foram copiadas para envio",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar as credenciais",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            Profissional Cadastrado com Sucesso!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Profissional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Profissional Cadastrado:</h3>
            <p className="text-sm text-gray-600">
              <strong>Nome:</strong> {professionalName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {professionalEmail}
            </p>
          </div>

          {/* Alerta de Segurança */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Senha Temporária Gerada</p>
                <p className="text-amber-700">
                  Esta senha deve ser enviada ao profissional e alterada no primeiro acesso.
                </p>
              </div>
            </div>
          </div>

          {/* Campo da Senha */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Senha Temporária:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={temporaryPassword}
                  readOnly
                  className="font-mono text-center text-lg bg-red-50 border-red-200 text-red-700 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleCopyPassword}
                variant="outline"
                size="sm"
                className="px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleCopyCredentials}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Credenciais Completas para Envio
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          </div>

          {/* Instruções */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">💡 Como proceder:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Clique em "Copiar Credenciais Completas" acima</li>
              <li>Envie as informações ao profissional via email/WhatsApp</li>
              <li>Oriente o profissional a alterar a senha no primeiro acesso</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemporaryPasswordModal;
