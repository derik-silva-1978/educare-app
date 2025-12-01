
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Olá! Gostaria de saber mais sobre a Educare+ Tech",
  variant = 'default',
  size = 'default',
  className = '',
  children
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const whatsappStyles = variant === 'default' 
    ? 'bg-[#25D366] hover:bg-[#128C7E] text-white border-[#25D366]'
    : variant === 'outline'
    ? 'border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white'
    : 'text-[#25D366] hover:bg-[#25D366]/10';

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant}
      size={size}
      className={`${whatsappStyles} ${className}`}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {children || 'Falar no WhatsApp'}
    </Button>
  );
};

export default WhatsAppButton;
