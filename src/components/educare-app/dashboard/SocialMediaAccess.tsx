import React from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

const SocialMediaAccess: React.FC = () => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o Educare.',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/educare_oficial',
      bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
      hoverColor: 'hover:opacity-90',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/educare.oficial',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground mr-1">Siga-nos:</span>
      {socialLinks.map((social) => (
        <button
          key={social.name}
          onClick={() => window.open(social.url, '_blank')}
          className={`w-10 h-10 rounded-full ${social.bgColor} ${social.hoverColor} text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg`}
          title={social.name}
        >
          <social.icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
};

export default SocialMediaAccess;
