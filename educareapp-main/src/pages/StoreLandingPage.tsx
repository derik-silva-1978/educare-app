
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Search, Filter, ShoppingCart, Heart, Eye, Star, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const StoreLandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [cartCount, setCartCount] = useState(0);

  // Mock product data
  const products = [
    {
      id: 1,
      name: "Kit de Robótica Educacional Básico",
      description: "Kit inicial para alunos de 6-10 anos com blocos de programação e montagem simples.",
      price: 349.90,
      discountPrice: 299.90,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1535378273068-9bb67d5bb299?q=80&w=500&auto=format&fit=crop",
      category: "kits",
      bestseller: true,
      inStock: true,
    },
    {
      id: 2,
      name: "Jogo Pedagógico de Alfabetização Inclusiva",
      description: "Conjunto de materiais táteis e visuais para apoio à alfabetização de crianças com necessidades especiais.",
      price: 189.90,
      discountPrice: null,
      rating: 5.0,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=500&auto=format&fit=crop",
      category: "materials",
      bestseller: false,
      inStock: true,
    },
    {
      id: 3,
      name: "Assinatura Smart PEI - Plano Anual",
      description: "Acesso a todas as funcionalidades da plataforma Smart PEI por 12 meses, com suporte premium.",
      price: 1199.90,
      discountPrice: 999.90,
      rating: 4.9,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1661956601349-f61c959a8fd4?q=80&w=500&auto=format&fit=crop",
      category: "subscriptions",
      bestseller: true,
      inStock: true,
    },
    {
      id: 4,
      name: "Comunicador Alternativo Visual",
      description: "Dispositivo para comunicação alternativa com cartões visuais e saída de áudio para crianças não verbais.",
      price: 499.90,
      discountPrice: null,
      rating: 4.7,
      reviews: 56,
      image: "https://images.unsplash.com/photo-1611791484670-ce19b801d192?q=80&w=500&auto=format&fit=crop",
      category: "assistive",
      bestseller: false,
      inStock: true,
    },
    {
      id: 5,
      name: "Coleção de Livros Infantis Inclusivos",
      description: "Kit com 5 livros infantis abordando temas de inclusão e diversidade, com ilustrações coloridas.",
      price: 259.90,
      discountPrice: 229.90,
      rating: 4.8,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop",
      category: "books",
      bestseller: true,
      inStock: true,
    },
    {
      id: 6,
      name: "Kit de Avaliação Sensorial",
      description: "Conjunto de materiais para estímulo e avaliação sensorial em crianças com diferentes perfis sensoriais.",
      price: 379.90,
      discountPrice: null,
      rating: 4.6,
      reviews: 41,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop",
      category: "materials",
      bestseller: false,
      inStock: false,
    },
    {
      id: 7,
      name: "Tapete Interativo de Atividades",
      description: "Tapete educativo com elementos táteis e sonoros para estimulação precoce e desenvolvimento infantil.",
      price: 219.90,
      discountPrice: 189.90,
      rating: 4.7,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=500&auto=format&fit=crop",
      category: "materials",
      bestseller: false,
      inStock: true,
    },
    {
      id: 8,
      name: "Curso Online Completo sobre PEI",
      description: "Acesso vitalício ao curso detalhado sobre criação e implementação de Planos de Ensino Individualizados.",
      price: 599.90,
      discountPrice: 499.90,
      rating: 4.9,
      reviews: 176,
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=500&auto=format&fit=crop",
      category: "courses",
      bestseller: true,
      inStock: true,
    }
  ];

  // Product categories
  const categories = [
    { id: "all", name: "Todos os Produtos" },
    { id: "kits", name: "Kits Educacionais" },
    { id: "materials", name: "Materiais Pedagógicos" },
    { id: "assistive", name: "Tecnologias Assistivas" },
    { id: "books", name: "Livros e Publicações" },
    { id: "subscriptions", name: "Assinaturas Digitais" },
    { id: "courses", name: "Cursos Online" }
  ];

  // Function to add to cart
  const addToCart = (productId: number) => {
    console.log(`Added product ID ${productId} to cart`);
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Loja Educare+ - Produtos Educacionais e Recursos Pedagógicos</title>
        <meta 
          name="description" 
          content="Produtos educacionais, kits de robótica, materiais didáticos e recursos para necessidades especiais." 
        />
      </Helmet>
      
      {/* Header with cart */}
      <div className="bg-white shadow-sm py-4 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Loja Educare+</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Banner */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-amber-50/60 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-4">
                Produtos Educacionais
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Recursos para Transformar a Experiência de Aprendizagem
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Encontre os melhores recursos educacionais, kits de robótica, produtos personalizados 
                e soluções digitais para necessidades especiais.
              </p>
              
              {/* Search Bar */}
              <div className="flex max-w-md mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10 rounded-l-full rounded-r-none border-r-0" 
                    placeholder="Busque por produtos, categorias ou kits" 
                  />
                </div>
                <Button className="rounded-l-none rounded-r-full bg-orange-600 hover:bg-orange-700">
                  Buscar
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Buscas populares:</span>
                {["Robótica", "Sensorial", "Livros", "Comunicação", "Assinatura"].map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-white hover:bg-orange-50 cursor-pointer">{tag}</Badge>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535350356005-fd52b3b524fb?q=80&w=600&auto=format&fit=crop" 
                  alt="Kit Educacional" 
                  className="rounded-lg shadow-2xl mx-auto"
                />
                
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Produtos disponíveis</p>
                      <p className="text-lg font-semibold">+250 itens</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Product Categories Tabs */}
      <section className="py-10 bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Nossos Produtos</h2>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                  <Filter className="h-4 w-4" /> Filtros
                </Button>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Ordenar por:</span>
                  <select className="border rounded p-1 bg-transparent">
                    <option>Mais Relevantes</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                  </select>
                </div>
              </div>
            </div>
            
            <TabsList className="mb-8 w-full h-auto flex flex-nowrap overflow-x-auto space-x-2 pb-2 justify-start bg-transparent">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 flex-shrink-0"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="m-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products
                    .filter(p => category.id === 'all' || p.category === category.id)
                    .map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="h-full flex flex-col overflow-hidden border shadow-sm group">
                          <div className="aspect-square w-full relative overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/500x500/F9A826/ffffff?text=Produto+${product.id}`;
                              }}
                            />
                            {product.bestseller && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-orange-500 hover:bg-orange-600">Mais Vendido</Badge>
                              </div>
                            )}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <p className="text-white font-medium">Indisponível</p>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                              <div className="flex justify-center space-x-2">
                                <Button variant="secondary" size="sm" className="rounded-full" onClick={() => addToCart(product.id)}>
                                  <ShoppingCart className="h-4 w-4 mr-1" /> Adicionar
                                </Button>
                                <Button variant="secondary" size="icon" className="rounded-full w-8 h-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" size="icon" className="rounded-full w-8 h-8">
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="flex-grow pt-4">
                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-center mb-2">
                              <div className="flex mr-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{product.rating}</span>
                              <span className="mx-1 text-gray-400">|</span>
                              <span className="text-sm text-muted-foreground">{product.reviews} avaliações</span>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-0">
                            <div>
                              {product.discountPrice ? (
                                <>
                                  <span className="text-sm line-through text-muted-foreground mr-2">
                                    R$ {product.price.toFixed(2).replace('.', ',')}
                                  </span>
                                  <span className="font-bold text-lg text-orange-600">
                                    R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-lg">
                                  R$ {product.price.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">Em até 12x sem juros</p>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
                
                {/* Show more button */}
                {category.id !== 'all' && products.filter(p => p.category === category.id).length >= 4 && (
                  <div className="text-center mt-10">
                    <Button variant="outline" className="rounded-full">
                      Ver mais produtos <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* Featured Collection */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50/60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Kits Especiais</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conjuntos completos de materiais educativos desenvolvidos para necessidades específicas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5">
                  <img 
                    src="https://images.unsplash.com/photo-1566694271453-390536dd1f0d?q=80&w=400&auto=format&fit=crop" 
                    alt="Kit Educação Especial"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/F9A826/ffffff?text=Kit+Especial';
                    }}
                  />
                </div>
                <div className="md:w-3/5 p-6">
                  <Badge className="mb-2 bg-orange-500 hover:bg-orange-600">Lançamento</Badge>
                  <h3 className="text-xl font-bold mb-2">Kit Completo de Educação Sensorial</h3>
                  <p className="text-muted-foreground mb-4">
                    Conjunto com 15 itens para estimulação sensorial, incluindo materiais táteis, 
                    sonoros e visuais para desenvolvimento de crianças com diferentes perfis sensoriais.
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="mr-2">
                      <span className="font-bold text-2xl text-orange-600">R$ 659,90</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-600">Frete Grátis</Badge>
                  </div>
                  <Button className="w-full md:w-auto bg-orange-600 hover:bg-orange-700" onClick={() => addToCart(100)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5">
                  <img 
                    src="https://images.unsplash.com/photo-1516962126636-27ad087061cc?q=80&w=400&auto=format&fit=crop" 
                    alt="Kit Robótica Avançada"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/F9A826/ffffff?text=Kit+Robótica';
                    }}
                  />
                </div>
                <div className="md:w-3/5 p-6">
                  <Badge className="mb-2 bg-purple-500 hover:bg-purple-600">Destaque</Badge>
                  <h3 className="text-xl font-bold mb-2">Kit Robótica Educacional Avançado</h3>
                  <p className="text-muted-foreground mb-4">
                    Kit completo para construção de robôs programáveis com mais de 300 peças, 
                    sensores avançados e software educacional para crianças de 10-16 anos.
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="mr-2">
                      <span className="text-sm line-through text-muted-foreground">R$ 899,90</span>
                      <span className="font-bold text-2xl text-orange-600 ml-2">R$ 799,90</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-600">Frete Grátis</Badge>
                  </div>
                  <Button className="w-full md:w-auto bg-orange-600 hover:bg-orange-700" onClick={() => addToCart(101)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Transforme a Experiência de Aprendizagem</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Temos kits de lembrancinhas a partir de R$ 29,90 e produtos educacionais para todas as necessidades.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full bg-white text-orange-600 hover:bg-orange-50">
              Ver Catálogo Completo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" className="rounded-full bg-orange-800 hover:bg-orange-900">
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreLandingPage;
