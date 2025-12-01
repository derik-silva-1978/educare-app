
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { featuredProducts } from '@/data/featuredProducts';
import SectionHeader from './ui/section-header';

const StoreSection = () => {
  return (
    <section id="store" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: "url('/images/pattern.svg')", 
          backgroundSize: "30px" 
        }}
      ></div>
      
      {/* Floating Astronaut */}
      <div className="absolute bottom-10 left-[5%] w-20 h-20 opacity-10 animate-float-slow hidden md:block pointer-events-none">
        <img src="/images/astronaut-logo.svg" alt="" className="w-full h-full object-contain rotate-12" />
      </div>
      
      {/* Floating Merchandise */}
      <div className="absolute top-20 right-[8%] w-24 h-24 opacity-20 animate-float-medium hidden lg:block pointer-events-none">
        <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-contain" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader 
          badge="Loja Educare+"
          title="Produtos e Assinaturas"
          description="Encontre os melhores recursos educacionais, kits de robótica, produtos personalizados e soluções digitais para transformar a experiência de aprendizagem."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Temos kits de lembrancinhas a partir de R$ 29,90</p>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/store">
              Visitar loja completa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
