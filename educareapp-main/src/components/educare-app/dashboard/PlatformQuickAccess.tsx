import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, ShoppingBag, MessageSquare, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const PlatformQuickAccess: React.FC = () => {
  const { user } = useAuth();

  const platformAreas = [
    {
      title: 'Gerenciar Crianças',
      description: 'Adicione ou edite informações',
      icon: BookOpen,
      href: '/educare-app/children',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      available: true
    },
    {
      title: 'Jornada Bot',
      description: 'Avalie o desenvolvimento',
      icon: GraduationCap,
      href: '/educare-app/journey-bot',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      available: true
    },
    {
      title: 'Loja Educare+',
      description: 'Materiais educacionais',
      icon: ShoppingBag,
      href: '/educare-app/loja',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      available: false
    },
    {
      title: 'Suporte',
      description: 'Ajuda e documentação',
      icon: MessageSquare,
      href: '/educare-app/support',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      available: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Acesso Rápido à Plataforma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformAreas.map((area, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl bg-gradient-to-br ${area.bgColor} border border-gray-100 hover:shadow-md transition-all duration-200 ${
                !area.available ? 'opacity-75' : ''
              }`}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${area.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <area.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{area.title}</h3>
              <p className="text-xs text-gray-600 mb-3">{area.description}</p>
              
              {area.available ? (
                <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                  <Link to={area.href}>
                    Acessar <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="w-full text-xs" disabled>
                  Em breve
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformQuickAccess;