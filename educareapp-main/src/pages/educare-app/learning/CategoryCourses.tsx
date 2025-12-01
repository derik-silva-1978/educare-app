
import React from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Monitor, Palette, Lightbulb, Users } from 'lucide-react';
import CourseCatalog from './CourseCatalog';

const CategoryCourses: React.FC = () => {
  const { category } = useParams();

  const categoryMap = {
    'desenvolvimento': { name: 'Desenvolvimento Infantil', icon: Heart, color: 'text-red-600' },
    'tecnologia': { name: 'Tecnologia Educacional', icon: Monitor, color: 'text-blue-600' },
    'arte': { name: 'Arte & Criatividade', icon: Palette, color: 'text-purple-600' },
    'psicologia': { name: 'Psicologia Infantil', icon: Lightbulb, color: 'text-yellow-600' },
    'familia': { name: 'Educação Familiar', icon: Users, color: 'text-green-600' },
  };

  const currentCategory = categoryMap[category as keyof typeof categoryMap];
  const Icon = currentCategory?.icon || Heart;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Icon className={`h-8 w-8 ${currentCategory?.color || 'text-gray-600'}`} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentCategory?.name || 'Categoria'}
          </h1>
          <p className="text-gray-600">
            Cursos especializados em {(currentCategory?.name || 'esta área').toLowerCase()}
          </p>
        </div>
      </div>
      
      <CourseCatalog />
    </div>
  );
};

export default CategoryCourses;
