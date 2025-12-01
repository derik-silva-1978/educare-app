
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsAppBot, UseWhatsAppBotOptions } from '@/hooks/useWhatsAppBot';

interface EnhancedWhatsAppButtonProps {
  productType?: string;
  customMessage?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
  trackingData?: UseWhatsAppBotOptions['trackingData'];
  showIcon?: boolean;
  fullWidth?: boolean;
}

const EnhancedWhatsAppButton: React.FC<EnhancedWhatsAppButtonProps> = ({
  productType,
  customMessage,
  variant = 'default',
  size = 'default',
  className = '',
  children,
  trackingData,
  showIcon = true,
  fullWidth = false
}) => {
  const { sendToBot } = useWhatsAppBot();

  const handleClick = () => {
    sendToBot({
      productType,
      customMessage,
      trackingData
    });
  };

  const whatsappStyles = variant === 'default' 
    ? 'bg-[#25D366] hover:bg-[#128C7E] text-white border-[#25D366]'
    : variant === 'outline'
    ? 'border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white'
    : 'text-[#25D366] hover:bg-[#25D366]/10';

  const buttonText = children || getDefaultButtonText(productType);

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`${whatsappStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {showIcon && <MessageSquare className="mr-2 h-4 w-4" />}
      {buttonText}
    </Button>
  );
};

const getDefaultButtonText = (productType?: string): string => {
  switch (productType) {
    case 'jornada':
      return 'Falar sobre Jornada';
    case 'academia':
      return 'Conhecer Academia';
    case 'loja':
      return 'Ver Produtos';
    case 'suporte':
      return 'Preciso de Ajuda';
    case 'demo':
      return 'Solicitar Demo';
    default:
      return 'Falar no WhatsApp';
  }
};

export default EnhancedWhatsAppButton;
