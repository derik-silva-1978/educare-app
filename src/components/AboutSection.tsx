
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="bg-educare-100 absolute -top-6 -left-6 w-72 h-72 rounded-full opacity-20"></div>
              <div className="bg-educare-300 absolute -bottom-6 -right-6 w-60 h-60 rounded-full opacity-20"></div>
              <div className="relative bg-gradient-to-r from-educare-500 to-educare-400 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/images/children-learning.webp" 
                  alt="Crianças aprendendo com a plataforma Educare+" 
                  className="w-full h-auto mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-4xl font-bold text-white">Educare+</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-educare-100 text-educare-800 inline-block mb-4">
              Sobre Nós
            </span>
            <h2 className="section-title mb-6">Nossa Missão e Valores</h2>
            <p className="text-lg text-muted-foreground mb-6">
              A Educare+ nasceu da visão de transformar a educação infantil através da tecnologia e de abordagens pedagógicas inovadoras. Acreditamos que cada criança possui um potencial único que merece ser desenvolvido com atenção e cuidado.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-foreground mb-1">Inclusão</h3>
                  <p className="text-muted-foreground">Desenvolvemos ferramentas que atendem às necessidades de todas as crianças, independentemente de suas condições.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-foreground mb-1">Inovação</h3>
                  <p className="text-muted-foreground">Buscamos constantemente novas maneiras de melhorar a experiência educacional através da tecnologia.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-foreground mb-1">Colaboração</h3>
                  <p className="text-muted-foreground">Trabalhamos em parceria com educadores, famílias e especialistas para criar soluções verdadeiramente eficazes.</p>
                </div>
              </div>
            </div>
            <Button asChild className="rounded-full px-8 py-6 bg-educare-600 hover:bg-educare-700">
              <a href="#features">
                Conheça nossas iniciativas
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
