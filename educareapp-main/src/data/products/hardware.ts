
import { Product } from '@/types/product';

export const hardwareProducts: Product[] = [
  {
    id: 6,
    title: "Tablet Educativo Educare+",
    description: "Tablet com software Educare+ pré-instalado, resistente a impactos e com capa protetora infantil.",
    price: "R$ 799,90",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    badge: "Exclusivo",
    app: "Educare+",
    category: "hardware",
    color: "bg-educare-700",
    rating: 4.5,
    stock: "Em estoque"
  },
  {
    id: 7,
    title: "Sensores de Movimento Adaptáveis",
    description: "Conjunto de sensores de movimento para uso com o kit de robótica, especiais para atividades terapêuticas.",
    price: "R$ 199,90",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-3bdc58448fee?auto=format&fit=crop&w=800&q=80",
    app: "Educare+ Tech",
    category: "hardware",
    color: "bg-educare-400",
    rating: 4.7,
    stock: "Em estoque"
  },
  {
    id: 11,
    title: "Kit de Acessibilidade Digital",
    description: "Conjunto de ferramentas adaptativas para tornar a experiência digital mais acessível, incluindo adaptadores e guia de uso.",
    price: "R$ 129,90",
    imageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80",
    badge: "Acessível",
    app: "Educare App",
    category: "hardware",
    color: "bg-educare-600",
    rating: 4.7,
    stock: "Em estoque"
  }
];
