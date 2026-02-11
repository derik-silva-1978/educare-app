
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, ShoppingCart, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { pricingPlans } from '@/components/pricing/PricingPlans';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
  imageUrl?: string;
}

const PaymentPage: React.FC = () => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | 'boleto'>('credit');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 199.9 ? 0 : 19.9) : 0;
  const total = subtotal + shipping;
  
  useEffect(() => {
    // Parse URL parameters to pre-fill cart
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const product = params.get('product');
    
    if (category === 'smart-pei') {
      // Add Smart PEI plan from plans
      const plan = pricingPlans[2]; // Default to Individual Premium plan
      setCartItems([
        {
          id: `smartpei-${plan.id}`,
          name: plan.name,
          price: parseFloat(plan.price.replace('R$ ', '').replace(',', '.')),
          quantity: 1,
          type: 'subscription'
        }
      ]);
    } else if (product) {
      // Add specific product
      const productDetails = getProductDetails(product);
      if (productDetails) {
        setCartItems([productDetails]);
      }
    }
    
    // If no parameters, cart starts empty
  }, [location]);
  
  const getProductDetails = (productId: string): CartItem | null => {
    // Map product IDs to details
    const productMap: Record<string, CartItem> = {
      'educare-app-family': {
        id: 'educare-app-family',
        name: 'Educare App - Plano Familiar',
        price: 29.9,
        quantity: 1,
        type: 'subscription'
      },
      'educare-app-educator': {
        id: 'educare-app-educator',
        name: 'Educare App - Plano Educador',
        price: 59.9,
        quantity: 1,
        type: 'subscription'
      },
      'educare-app-institutional': {
        id: 'educare-app-institutional',
        name: 'Educare App - Plano Institucional',
        price: 199.9,
        quantity: 1,
        type: 'subscription'
      },
      'robotics-starter': {
        id: 'robotics-starter',
        name: 'Kit Robótica - Iniciante',
        price: 299.9,
        quantity: 1,
        type: 'physical'
      },
      'robotics-intermediate': {
        id: 'robotics-intermediate',
        name: 'Kit Robótica - Intermediário',
        price: 499.9,
        quantity: 1,
        type: 'physical'
      },
      'robotics-advanced': {
        id: 'robotics-advanced',
        name: 'Kit Robótica - Avançado',
        price: 899.9,
        quantity: 1,
        type: 'physical'
      },
      'robotics-institutional': {
        id: 'robotics-institutional',
        name: 'Kit Robótica - Institucional',
        price: 2999.9,
        quantity: 1,
        type: 'physical'
      },
      'course-inclusive': {
        id: 'course-inclusive',
        name: 'Curso - Educação Inclusiva',
        price: 397,
        quantity: 1,
        type: 'digital'
      },
      'course-development': {
        id: 'course-development',
        name: 'Curso - Desenvolvimento Infantil',
        price: 497,
        quantity: 1,
        type: 'digital'
      },
      'course-robotics': {
        id: 'course-robotics',
        name: 'Curso - Robótica para Educadores',
        price: 597,
        quantity: 1,
        type: 'digital'
      }
    };
    
    return productMap[productId] || null;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for the current step
    if (step === 'shipping') {
      if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step === 'payment') {
      if (paymentMethod === 'credit' && (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCVC)) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, preencha todos os dados do cartão.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Move to next step
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      if (step === 'cart') {
        setStep('shipping');
      } else if (step === 'shipping') {
        setStep('payment');
      } else if (step === 'payment') {
        // Here you would typically send the order to a payment processor
        setStep('confirmation');
      }
    }, 1000);
  };
  
  const handleBackToShopping = () => {
    navigate('/');
  };
  
  // Cart is empty state
  if (cartItems.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen bg-background py-12">
        <Helmet>
          <title>Carrinho | Educare+</title>
        </Helmet>
        
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">
              Explore nossos produtos e adicione itens ao seu carrinho para continuar
            </p>
            <Button onClick={handleBackToShopping} className="rounded-full">
              Voltar para compras
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Confirmation page
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background py-12">
        <Helmet>
          <title>Pedido Confirmado | Educare+</title>
        </Helmet>
        
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              <div className="rounded-full bg-green-100 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Pedido Confirmado!</h1>
              <p className="text-muted-foreground mb-8">
                Seu pedido foi processado com sucesso. Você receberá um e-mail com os detalhes da compra.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium mb-2">Resumo do Pedido</h3>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-8">
                <p><span className="font-medium">Número do Pedido:</span> EDP-{Math.floor(Math.random() * 10000)}</p>
                <p><span className="font-medium">Data:</span> {new Date().toLocaleDateString('pt-BR')}</p>
                <p><span className="font-medium">Método de Pagamento:</span> {
                  paymentMethod === 'credit' ? 'Cartão de Crédito' : 
                  paymentMethod === 'pix' ? 'PIX' : 'Boleto Bancário'
                }</p>
              </div>
              
              <Button onClick={handleBackToShopping} className="rounded-full">
                Voltar para a loja
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Checkout | Educare+</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Checkout Educare+</h1>
            <div className="flex items-center">
              <div className={`flex-1 ${step === 'cart' ? 'text-primary font-medium' : ''}`}>
                Carrinho
              </div>
              <div className="w-4 h-0.5 bg-muted"></div>
              <div className={`flex-1 ${step === 'shipping' ? 'text-primary font-medium' : ''}`}>
                Entrega
              </div>
              <div className="w-4 h-0.5 bg-muted"></div>
              <div className={`flex-1 ${step === 'payment' ? 'text-primary font-medium' : ''}`}>
                Pagamento
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Checkout Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              {step === 'cart' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Itens no Carrinho</CardTitle>
                    <CardDescription>Revise os itens selecionados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain" />
                            ) : (
                              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.type === 'subscription' ? 'Assinatura' : 
                               item.type === 'digital' ? 'Produto Digital' : 'Produto Físico'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <button 
                              className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input 
                              type="text" 
                              className="w-10 h-8 text-center border-t border-b"
                              value={item.quantity}
                              readOnly
                            />
                            <button 
                              className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </div>
                            <button 
                              className="text-sm text-red-500 hover:underline"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBackToShopping}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continuar Comprando
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Processando...' : 'Prosseguir para Entrega'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Shipping Information */}
              {step === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Entrega</CardTitle>
                    <CardDescription>Preencha seus dados para entrega</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Seu nome completo" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            placeholder="seu@email.com" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">CEP</Label>
                          <Input 
                            id="zipCode" 
                            name="zipCode" 
                            value={formData.zipCode} 
                            onChange={handleInputChange} 
                            placeholder="00000-000" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder="Rua, número, complemento" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange} 
                            placeholder="Sua cidade" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado</Label>
                          <Select 
                            value={formData.state} 
                            onValueChange={(value) => handleSelectChange('state', value)}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AC">Acre</SelectItem>
                              <SelectItem value="AL">Alagoas</SelectItem>
                              <SelectItem value="AP">Amapá</SelectItem>
                              <SelectItem value="AM">Amazonas</SelectItem>
                              <SelectItem value="BA">Bahia</SelectItem>
                              <SelectItem value="CE">Ceará</SelectItem>
                              <SelectItem value="DF">Distrito Federal</SelectItem>
                              <SelectItem value="ES">Espírito Santo</SelectItem>
                              <SelectItem value="GO">Goiás</SelectItem>
                              <SelectItem value="MA">Maranhão</SelectItem>
                              <SelectItem value="MT">Mato Grosso</SelectItem>
                              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                              <SelectItem value="MG">Minas Gerais</SelectItem>
                              <SelectItem value="PA">Pará</SelectItem>
                              <SelectItem value="PB">Paraíba</SelectItem>
                              <SelectItem value="PR">Paraná</SelectItem>
                              <SelectItem value="PE">Pernambuco</SelectItem>
                              <SelectItem value="PI">Piauí</SelectItem>
                              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                              <SelectItem value="RO">Rondônia</SelectItem>
                              <SelectItem value="RR">Roraima</SelectItem>
                              <SelectItem value="SC">Santa Catarina</SelectItem>
                              <SelectItem value="SP">São Paulo</SelectItem>
                              <SelectItem value="SE">Sergipe</SelectItem>
                              <SelectItem value="TO">Tocantins</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('cart')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar ao Carrinho
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Processando...' : 'Prosseguir para Pagamento'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Payment Information */}
              {step === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Método de Pagamento</CardTitle>
                    <CardDescription>Escolha como deseja pagar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="credit">Cartão de Crédito</TabsTrigger>
                        <TabsTrigger value="pix">PIX</TabsTrigger>
                        <TabsTrigger value="boleto">Boleto</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="credit">
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Número do Cartão</Label>
                            <Input 
                              id="cardNumber" 
                              name="cardNumber" 
                              value={formData.cardNumber} 
                              onChange={handleInputChange} 
                              placeholder="0000 0000 0000 0000" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Nome no Cartão</Label>
                            <Input 
                              id="cardName" 
                              name="cardName" 
                              value={formData.cardName} 
                              onChange={handleInputChange} 
                              placeholder="Nome como aparece no cartão" 
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Validade</Label>
                              <Input 
                                id="cardExpiry" 
                                name="cardExpiry" 
                                value={formData.cardExpiry} 
                                onChange={handleInputChange} 
                                placeholder="MM/AA" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCVC">Código de Segurança</Label>
                              <Input 
                                id="cardCVC" 
                                name="cardCVC" 
                                value={formData.cardCVC} 
                                onChange={handleInputChange} 
                                placeholder="CVC" 
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Opções de Parcelamento</h4>
                            <Select defaultValue="1">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1x de R$ {total.toFixed(2).replace('.', ',')} sem juros</SelectItem>
                                <SelectItem value="2">2x de R$ {(total / 2).toFixed(2).replace('.', ',')} sem juros</SelectItem>
                                <SelectItem value="3">3x de R$ {(total / 3).toFixed(2).replace('.', ',')} sem juros</SelectItem>
                                <SelectItem value="4">4x de R$ {(total / 4).toFixed(2).replace('.', ',')} sem juros</SelectItem>
                                <SelectItem value="5">5x de R$ {(total / 5).toFixed(2).replace('.', ',')} sem juros</SelectItem>
                                <SelectItem value="6">6x de R$ {(total / 6).toFixed(2).replace('.', ',')} sem juros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="pix">
                        <div className="text-center p-6">
                          <div className="w-48 h-48 bg-muted mx-auto flex items-center justify-center mb-4">
                            <p className="text-center text-sm text-muted-foreground">
                              Código QR do PIX
                              <br/>
                              (simulação)
                            </p>
                          </div>
                          <p className="mb-4 text-sm text-muted-foreground">
                            Escaneie o código QR ou copie o código PIX para pagar.
                            <br/>Pagamento instantâneo.
                          </p>
                          <Button variant="outline" className="w-full">
                            Copiar Código PIX
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="boleto">
                        <div className="text-center p-6">
                          <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="font-medium mb-2">Boleto Bancário</h3>
                          <p className="mb-6 text-sm text-muted-foreground">
                            O boleto será gerado após a conclusão do pedido e enviado para seu e-mail.
                            <br/>O prazo de compensação é de até 3 dias úteis.
                          </p>
                          <div className="bg-muted/30 p-4 rounded-lg text-sm mb-4">
                            <p className="font-medium">Informações importantes:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                              <li>Produtos digitais e assinaturas serão liberados após compensação</li>
                              <li>Produtos físicos serão enviados após confirmação do pagamento</li>
                              <li>O boleto vence em 3 dias úteis</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('shipping')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para Entrega
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Processando...' : 'Finalizar Pedido'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name}
                        {item.quantity > 1 && ` (x${item.quantity})`}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Grátis</span>
                      ) : (
                        `R$ ${shipping.toFixed(2).replace('.', ',')}`
                      )}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="bg-muted/30 p-4 w-full rounded-lg">
                    <h4 className="font-medium mb-2 text-sm">Informações de Entrega</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>Produtos digitais: acesso imediato após pagamento</li>
                      <li>Produtos físicos: prazo de entrega de 5 a 10 dias úteis</li>
                      <li>Frete grátis para compras acima de R$ 199,90</li>
                    </ul>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Precisa de ajuda?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">E-mail:</span> suporte@educareapp.com.br</p>
                      <p><span className="font-medium">Telefone:</span> (11) 3456-7890</p>
                      <p><span className="font-medium">Horário:</span> Seg-Sex, 9h às 18h</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
