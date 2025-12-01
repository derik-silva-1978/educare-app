
import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'Todos os Posts', count: 12 },
  { id: 'desenvolvimento-infantil', name: 'Desenvolvimento Infantil', count: 5 },
  { id: 'tecnologia-educacional', name: 'Tecnologia Educacional', count: 3 },
  { id: 'dicas-pais', name: 'Dicas para Pais', count: 4 },
  { id: 'recursos-educacionais', name: 'Recursos Educacionais', count: 2 },
  { id: 'novidades-plataforma', name: 'Novidades da Plataforma', count: 1 },
];

interface BlogCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const BlogCategories: React.FC<BlogCategoriesProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Categorias</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <span>{category.name}</span>
              <span className="text-sm text-gray-500">({category.count})</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
