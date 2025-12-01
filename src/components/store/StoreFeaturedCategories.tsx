
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Category {
  title: string;
  description: string;
  image: string;
  color: string;
  link: string;
}

const StoreFeaturedCategories: React.FC = () => {
  const categories: Category[] = [
    {
      title: "Kits de Robótica",
      description: "Ferramentas educacionais completas para atividades terapêuticas e desenvolvimento infantil.",
      image: "/images/category-robotics.webp",
      color: "bg-educare-400",
      link: "#kits"
    },
    {
      title: "Software Educacional",
      description: "Soluções digitais para avaliação, acompanhamento e planejamento educacional individualizado.",
      image: "/images/category-software.webp",
      color: "bg-educare-500",
      link: "#software"
    },
    {
      title: "Assinaturas",
      description: "Acesso contínuo às nossas plataformas com atualizações regulares e suporte especializado.",
      image: "/images/category-subscription.webp",
      color: "bg-educare-600",
      link: "#subscription"
    }
  ];

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Categorias em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="overflow-hidden group h-full">
            <div className="h-40 overflow-hidden">
              <img 
                src={category.image || "/images/placeholder.svg"} 
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <CardHeader className={`${category.color} text-white`}>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription className="text-white/80">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-card">
              <Button asChild variant="ghost" className="w-full justify-between">
                <Link to={category.link}>
                  Ver produtos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoreFeaturedCategories;
