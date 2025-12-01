import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, MessageCircle, ExternalLink } from 'lucide-react';

const SocialMediaAccess: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/educare_oficial',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:from-pink-600 hover:to-purple-700',
      description: 'Siga nosso Instagram'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/educare.oficial',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      description: 'Curta nossa página'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o Educare.',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      description: 'Fale conosco'
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <ExternalLink className="h-5 w-5" />
          Conecte-se Conosco
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              onClick={() => window.open(social.url, '_blank')}
              className={`h-auto p-4 flex flex-col items-center gap-3 bg-gradient-to-r ${social.color} ${social.hoverColor} text-white transition-all duration-200 hover:scale-105`}
            >
              <social.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">{social.name}</div>
                <div className="text-xs opacity-90">{social.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaAccess;