
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Home, 
  User, 
  Award, 
  Grid3X3,
  Monitor,
  Palette,
  Lightbulb,
  Heart,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LearningSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: 'Desenvolvimento Infantil', icon: Heart, path: '/educare-app/aprendizado/categories/desenvolvimento' },
    { name: 'Tecnologia Educacional', icon: Monitor, path: '/educare-app/aprendizado/categories/tecnologia' },
    { name: 'Arte & Criatividade', icon: Palette, path: '/educare-app/aprendizado/categories/arte' },
    { name: 'Psicologia Infantil', icon: Lightbulb, path: '/educare-app/aprendizado/categories/psicologia' },
    { name: 'Educação Familiar', icon: Users, path: '/educare-app/aprendizado/categories/familia' },
  ];

  const menuItems = [
    { name: 'Início', icon: Home, path: '/educare-app/aprendizado' },
    { name: 'Todos os Cursos', icon: Grid3X3, path: '/educare-app/aprendizado/courses' },
    { name: 'Meu Dashboard', icon: User, path: '/educare-app/aprendizado/dashboard' },
    { name: 'Certificados', icon: Award, path: '/educare-app/aprendizado/certificates' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Main Navigation */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Navegação
          </h3>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full justify-start text-left",
                  isActive(item.path) 
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>

        {/* Course Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Categorias
          </h3>
          <nav className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                onClick={() => navigate(category.path)}
                className={cn(
                  "w-full justify-start text-left text-sm",
                  isActive(category.path) 
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <category.icon className="h-4 w-4 mr-3" />
                {category.name}
              </Button>
            ))}
          </nav>
        </div>

        {/* Quick Access */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => navigate('/educare-app/dashboard')}
            className="w-full"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Voltar ao App Principal
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default LearningSidebar;
