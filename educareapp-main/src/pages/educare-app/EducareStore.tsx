
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  CreditCard,
  Package,
  Zap,
  Heart,
  BookOpen,
  Gamepad2,
  Puzzle,
  Music
} from 'lucide-react';

const EducareStore: React.FC = () => {
  const productCategories = [
    {
      title: 'Materiais Educativos',
      icon: <BookOpen className="h-6 w-6" />,
      count: 156,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Jogos e Brinquedos',
      icon: <Gamepad2 className="h-6 w-6" />,
      count: 89,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Materiais Sensoriais',
      icon: <Puzzle className="h-6 w-6" />,
      count: 67,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Música e Movimento',
      icon: <Music className="h-6 w-6" />,
      count: 43,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const featuredProducts = [
    {
      name: 'Kit Desenvolvimento Motor 0-6 meses',
      price: 'R$ 189,90',
      originalPrice: 'R$ 239,90',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 124,
      badge: 'Mais Vendido'
    },
    {
      name: 'Blocos Sensoriais Montessori',
      price: 'R$ 89,90',
      originalPrice: 'R$ 119,90',
      image: 'https://images.unsplash.com/photo-1558877385-68c4c74e7d27?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      badge: 'Oferta'
    },
    {
      name: 'Kit Estimulação Cognitiva',
      price: 'R$ 159,90',
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 76,
      badge: 'Novidade'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Loja Educare+ | Materiais Educativos</title>
        <meta name="description" content="Loja especializada em materiais educativos, jogos e recursos para desenvolvimento infantil" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Loja Educare+
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Materiais educativos cuidadosamente selecionados para potencializar 
                o desenvolvimento infantil em todas as fases.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Explorar Produtos
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-emerald-600">
                  <Package className="mr-2 h-5 w-5" />
                  Ver Kits Completos
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-white border-b py-4 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="font-medium">Frete Grátis acima de R$ 199</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Compra 100% Segura</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Parcele em até 12x</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Entrega Express</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
              Categorias de Produtos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {productCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-800">
                        {category.title}
                      </h3>
                      <p className="text-gray-600">
                        {category.count} produtos
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Produtos em Destaque
              </h2>
              <p className="text-xl text-gray-600">
                Os produtos mais amados pelas famílias e profissionais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${
                          product.badge === 'Mais Vendido' ? 'bg-red-500' :
                          product.badge === 'Oferta' ? 'bg-green-500' :
                          'bg-blue-500'
                        } text-white font-semibold`}>
                          {product.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-800 leading-tight">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews} avaliações)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-emerald-600">
                            {product.price}
                          </div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </div>
                          )}
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto max-w-4xl text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Fique por dentro das novidades
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Receba ofertas exclusivas,  lançamentos e dicas educativas diretamente no seu e-mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Inscrever-se
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EducareStore;
