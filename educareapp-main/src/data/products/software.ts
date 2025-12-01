
import { Product } from '@/types/product';

export const softwareProducts: Product[] = [
  {
    id: 2,
    title: "Licença Smart PEI - Plano Escolar",
    description: "Licença anual para uso do Smart PEI em instituições de ensino com suporte para até 50 alunos.",
    price: "R$ 1.499,90",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    badge: "Recomendado",
    app: "Smart PEI",
    category: "software",
    color: "bg-educare-500",
    rating: 4.9,
    stock: "Em estoque"
  },
  {
    id: 5,
    title: "Smart PEI - Licença Individual",
    description: "Licença anual para profissionais que trabalham com atendimento individual de alunos com necessidades especiais.",
    price: "R$ 399,90",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
    app: "Smart PEI",
    category: "software",
    color: "bg-educare-500",
    rating: 4.8,
    stock: "Últimas unidades"
  }
];
