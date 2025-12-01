
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { featuredCourses } from '@/data/featuredCourses';
import SectionHeader from './ui/section-header';

const CourseSection = () => {
  return (
    <section id="courses" className="py-24 bg-white relative">
      {/* Floating Astronaut */}
      <div className="absolute top-10 right-[5%] w-16 h-16 opacity-10 animate-float-medium hidden md:block pointer-events-none">
        <img src="/images/astronaut-logo.svg" alt="" className="w-full h-full object-contain" />
      </div>
      
      {/* Floating Educational Item */}
      <div className="absolute bottom-16 left-[7%] w-28 h-28 opacity-15 animate-float-slow hidden lg:block pointer-events-none transform rotate-6">
        <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-contain" />
      </div>
      
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Cursos Especializados"
          title="Capacitação para Profissionais e Famílias"
          description="Amplie seus conhecimentos e habilidades com nossos cursos de desenvolvimento infantil, educação inclusiva e tecnologias assistivas."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/courses">
              Ver todos os cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
