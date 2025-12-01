
import { Course } from '@/components/CourseCard';

export const featuredCourses: Course[] = [
  {
    id: 1,
    title: "Desenvolvimento Infantil",
    description: "Curso completo sobre as etapas de desenvolvimento infantil, avaliações e intervenções recomendadas.",
    duration: "8 semanas",
    level: "Intermediário",
    students: 352,
    imageUrl: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80",
    category: "app",
    badge: "Bestseller",
    app: "Educare App",
    color: "bg-educare-600"
  },
  {
    id: 3,
    title: "Planos Educacionais Individualizados",
    description: "Aprenda a criar e gerenciar PEIs eficazes para alunos com necessidades educacionais especiais.",
    duration: "6 semanas",
    level: "Avançado",
    students: 289,
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    category: "pei",
    badge: "Certificado",
    app: "Smart PEI",
    color: "bg-educare-500"
  },
  {
    id: 5,
    title: "Introdução à Robótica Educacional",
    description: "Fundamentos de robótica e programação para aplicação em ambiente educacional inclusivo.",
    duration: "10 semanas",
    level: "Básico",
    students: 432,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    category: "robotics",
    badge: "Novo",
    app: "Educare+ Robótica",
    color: "bg-educare-400"
  },
  {
    id: 7,
    title: "Capacitação para Educadores Especiais",
    description: "Treinamento completo para profissionais que trabalham com educação especial e inclusiva.",
    duration: "12 semanas",
    level: "Profissional",
    students: 378,
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    category: "professional",
    badge: "Acreditado",
    app: "Educare+",
    color: "bg-educare-700"
  }
];
