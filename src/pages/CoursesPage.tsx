
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Book, ArrowRight, Clock, Award, Users, GraduationCap, ArrowLeft, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Same course categories from CourseSection
const courseCategories = [
  { id: "all", label: "Todos os Cursos" },
  { id: "app", label: "Educare App" },
  { id: "pei", label: "Smart PEI" },
  { id: "robotics", label: "Educare+ Robótica" },
  { id: "professional", label: "Desenvolvimento Profissional" }
];

// Using the same course data from CourseSection
const allCourses = [
  // Educare App Courses
  {
    id: 1,
    title: "Desenvolvimento Infantil",
    description: "Curso completo sobre as etapas de desenvolvimento infantil, avaliações e intervenções recomendadas.",
    duration: "8 semanas",
    level: "Intermediário",
    students: 352,
    rating: 4.8,
    imageUrl: "/images/course-child-dev.webp",
    category: "app",
    badge: "Bestseller",
    instructor: "Dra. Ana Moreira",
    app: "Educare App",
    color: "bg-educare-600"
  },
  {
    id: 2,
    title: "Técnicas de Avaliação Precoce",
    description: "Aprenda a identificar sinais de atraso de desenvolvimento e aplicar instrumentos de avaliação adequados.",
    duration: "6 semanas",
    level: "Avançado",
    students: 215,
    rating: 4.7,
    imageUrl: "/images/course-assessment.webp",
    category: "app",
    instructor: "Dr. Ricardo Souza",
    app: "Educare App",
    color: "bg-educare-600"
  },
  
  // Smart PEI Courses
  {
    id: 3,
    title: "Planos Educacionais Individualizados",
    description: "Aprenda a criar e gerenciar PEIs eficazes para alunos com necessidades educacionais especiais.",
    duration: "6 semanas",
    level: "Avançado",
    students: 289,
    rating: 4.9,
    imageUrl: "/images/course-pei.webp",
    category: "pei",
    badge: "Certificado",
    instructor: "Profa. Carla Mendes",
    app: "Smart PEI",
    color: "bg-educare-500"
  },
  {
    id: 4,
    title: "Inclusão Escolar na Prática",
    description: "Estratégias práticas para promover a inclusão efetiva de alunos com necessidades especiais em sala de aula.",
    duration: "5 semanas",
    level: "Intermediário",
    students: 187,
    rating: 4.6,
    imageUrl: "/images/course-inclusion.webp",
    category: "pei",
    instructor: "Prof. Paulo Oliveira",
    app: "Smart PEI",
    color: "bg-educare-500"
  },
  
  // Robotics Courses
  {
    id: 5,
    title: "Introdução à Robótica Educacional",
    description: "Fundamentos de robótica e programação para aplicação em ambiente educacional inclusivo.",
    duration: "10 semanas",
    level: "Básico",
    students: 432,
    rating: 4.7,
    imageUrl: "/images/course-robotics.webp",
    category: "robotics",
    badge: "Novo",
    instructor: "Eng. Felipe Martins",
    app: "Educare+ Robótica",
    color: "bg-educare-400"
  },
  {
    id: 6,
    title: "Robótica Terapêutica",
    description: "Como utilizar a robótica como ferramenta terapêutica para crianças com transtornos do desenvolvimento.",
    duration: "8 semanas",
    level: "Intermediário",
    students: 156,
    rating: 4.8,
    imageUrl: "/images/course-therapeutic.webp",
    category: "robotics",
    badge: "Destaque",
    instructor: "Dra. Marina Lima",
    app: "Educare+ Robótica",
    color: "bg-educare-400"
  },
  
  // Professional Development
  {
    id: 7,
    title: "Capacitação para Educadores Especiais",
    description: "Treinamento completo para profissionais que trabalham com educação especial e inclusiva.",
    duration: "12 semanas",
    level: "Profissional",
    students: 378,
    rating: 4.9,
    imageUrl: "/images/course-special-ed.webp",
    category: "professional",
    badge: "Acreditado",
    instructor: "Profa. Dra. Juliana Vasconcelos",
    app: "Educare+",
    color: "bg-educare-700"
  },
  {
    id: 8,
    title: "Neurociência e Aprendizagem",
    description: "Entenda como o cérebro aprende e aplique esse conhecimento para otimizar o ensino de todos os alunos.",
    duration: "7 semanas",
    level: "Avançado",
    students: 298,
    rating: 4.8,
    imageUrl: "/images/course-neuroscience.webp",
    category: "professional",
    instructor: "Dr. André Campos",
    app: "Educare+",
    color: "bg-educare-700"
  },
  // Additional courses for pagination demo
  {
    id: 9,
    title: "Comunicação Alternativa",
    description: "Métodos e recursos para estabelecer comunicação efetiva com crianças com dificuldades na fala.",
    duration: "6 semanas",
    level: "Intermediário",
    students: 245,
    rating: 4.7,
    imageUrl: "/images/course-communication.webp",
    category: "app",
    instructor: "Dra. Beatriz Almeida",
    app: "Educare App",
    color: "bg-educare-600"
  },
  {
    id: 10,
    title: "Análise de Dados em Educação Especial",
    description: "Aprenda a coletar, analisar e interpretar dados para tomar decisões baseadas em evidências.",
    duration: "8 semanas",
    level: "Avançado",
    students: 176,
    rating: 4.6,
    imageUrl: "/images/course-data.webp",
    category: "pei",
    instructor: "Prof. Marcos Pereira",
    app: "Smart PEI",
    color: "bg-educare-500"
  },
  {
    id: 11,
    title: "Programação para Crianças",
    description: "Como ensinar conceitos básicos de programação para crianças utilizando recursos tecnológicos e robótica.",
    duration: "9 semanas",
    level: "Básico",
    students: 321,
    rating: 4.9,
    imageUrl: "/images/course-programming.webp",
    category: "robotics",
    badge: "Popular",
    instructor: "Eng. Lucas Santos",
    app: "Educare+ Robótica",
    color: "bg-educare-400"
  },
  {
    id: 12,
    title: "Liderança em Ambientes Educacionais Inclusivos",
    description: "Desenvolva habilidades de liderança para coordenar equipes em contextos educacionais inclusivos.",
    duration: "10 semanas",
    level: "Profissional",
    students: 198,
    rating: 4.7,
    imageUrl: "/images/course-leadership.webp",
    category: "professional",
    instructor: "Dra. Camila Rodrigues",
    app: "Educare+",
    color: "bg-educare-700"
  }
];

const CoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter courses based on active category and search query
  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Cursos Educare+ | Conhecimento Especializado</title>
        <meta name="description" content="Explore nossa variedade de cursos especializados em desenvolvimento infantil, educação inclusiva e tecnologias assistivas." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header Section */}
        <section className="bg-gradient-to-b from-educare-50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Button asChild variant="ghost" size="sm" className="mr-2">
                    <Link to="/">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </Link>
                  </Button>
                  <Badge variant="outline" className="bg-educare-100 text-educare-800 border-educare-200">
                    Cursos Especializados
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Plataforma de Cursos Educare+</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Expanda seus conhecimentos com nossos cursos especializados em desenvolvimento infantil, 
                  educação inclusiva e tecnologias assistivas.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Buscar cursos..." 
                    className="pl-8 w-[200px] md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Courses Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Category Tabs */}
            <div className="mb-10">
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full rounded-xl bg-muted/50 p-1">
                  {courseCategories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="text-xs sm:text-sm md:text-base"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border border-border/50 overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Book className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className={`absolute top-0 right-0 ${course.color} text-white text-xs font-medium px-3 py-1 m-2 rounded-full`}>
                      {course.app}
                    </div>
                    {course.badge && (
                      <div className="absolute top-0 left-0 m-2">
                        <Badge variant="secondary" className="font-medium bg-background/80 backdrop-blur-sm">
                          {course.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Por {course.instructor}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2 flex-grow">
                    <CardDescription className="line-clamp-3 mb-4">
                      {course.description}
                    </CardDescription>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{course.students} alunos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-500">
                          {'★'.repeat(Math.floor(course.rating))}
                          {course.rating % 1 !== 0 && '☆'}
                        </div>
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 mt-auto">
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      <Link to="/auth?action=course">
                        Ver detalhes
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>
                      <ArrowRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            
            {/* Call to Action Banner */}
            <div className="mt-16 bg-educare-50 rounded-2xl p-8 text-center">
              <GraduationCap size={48} className="text-educare-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Torne-se um especialista Educare+</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Obtenha nossos certificados profissionais e destaque-se no mercado de educação especial e desenvolvimento infantil.
              </p>
              <Button asChild size="lg" className="rounded-full bg-educare-600 hover:bg-educare-700">
                <Link to="/auth?action=register">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoursesPage;
