
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Informações de Contato</h2>
        <p className="text-muted-foreground mb-6">
          Utilize qualquer um dos canais abaixo para entrar em contato conosco. Nossa equipe está pronta para atendê-lo.
        </p>
      </div>
      
      <div className="space-y-4">
        <ContactCard 
          icon={<Mail className="h-5 w-5 text-educare-600" />}
          title="Email"
          description="contato@educareapp.com.br"
          link="mailto:contato@educareapp.com.br"
        />
        
        <ContactCard 
          icon={<Phone className="h-5 w-5 text-educare-600" />}
          title="Telefone"
          description="+55 (11) 4002-8922"
          link="tel:+551140028922"
        />
        
        <ContactCard 
          icon={<MessageSquare className="h-5 w-5 text-educare-600" />}
          title="Whatsapp"
          description="+55 (91) 9201-8206"
          link="https://wa.me/559192018206"
          isWhatsApp={true}
        />
        
        <ContactCard 
          icon={<MapPin className="h-5 w-5 text-educare-600" />}
          title="Endereço"
          description="Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100"
          link="https://maps.google.com/?q=Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100"
        />
        
        <ContactCard 
          icon={<Clock className="h-5 w-5 text-educare-600" />}
          title="Horário de Atendimento"
          description="Segunda a Sexta: 9h às 18h"
        />
      </div>
      
      {/* WhatsApp Direct Button */}
      <div className="mt-8">
        <a 
          href="https://wa.me/559192018206?text=Olá,%20gostaria%20de%20mais%20informações%20sobre%20o%20Educare+." 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
            <MessageSquare className="mr-2 h-5 w-5" />
            Fale Conosco pelo WhatsApp
          </Button>
        </a>
      </div>
      
      <div className="bg-educare-50 rounded-lg p-5 border border-educare-100 mt-8">
        <h3 className="font-medium mb-2">Suporte Prioritário</h3>
        <p className="text-sm text-muted-foreground">
          Assinantes dos planos Premium e Empresarial possuem canais de atendimento exclusivos
          com suporte prioritário.
        </p>
      </div>
    </div>
  );
};

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  isWhatsApp?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, description, link, isWhatsApp }) => {
  const content = (
    <CardContent className={`flex items-start p-4 ${isWhatsApp ? "border-l-4 border-l-[#25D366]" : ""}`}>
      <div className="mr-4 mt-1">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </CardContent>
  );

  if (link) {
    return (
      <Card className={`hover:shadow-md transition-all duration-300 ${isWhatsApp ? "border border-[#25D366]/20" : ""}`}>
        <a href={link} target={link.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
          {content}
        </a>
      </Card>
    );
  }

  return <Card>{content}</Card>;
};

export default ContactInfo;
