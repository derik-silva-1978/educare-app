
import { Product } from '@/types/product';

export const subscriptionProducts: Product[] = [
  {
    id: 3,
    title: "Educare App - Assinatura Premium",
    description: "Acesso a todas as ferramentas de avaliação e acompanhamento do desenvolvimento infantil por 12 meses.",
    price: "R$ 199,90",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    badge: "Novo",
    app: "Educare App",
    category: "subscription",
    color: "bg-educare-600",
    rating: 4.7,
    stock: "Em estoque"
  },
  {
    id: 8,
    title: "Kit de Produtos Educacionais Educare+",
    description: "Kit com agenda 2025, mousepad, ecobag, camiseta e garrafa térmica personalizados com o mascote Educare+.",
    price: "R$ 299,90",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    badge: "Economia",
    app: "Educare+",
    category: "subscription",
    color: "bg-educare-600",
    rating: 4.9,
    stock: "Em estoque"
  },
  {
    id: 10,
    title: "Titibot Turbo - Assistente Avançado",
    description: "Upgrade para o assistente virtual avançado com análises detalhadas, estratégias personalizadas e suporte prioritário.",
    price: "R$ 49,90",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80",
    badge: "Premium",
    app: "Smart PEI",
    category: "subscription",
    color: "bg-yellow-500",
    rating: 4.8,
    stock: "Em estoque"
  }
];
