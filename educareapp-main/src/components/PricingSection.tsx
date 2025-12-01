
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { calculateEnterpriseCost } from '@/utils/pricing-utils';
import PricingHeader from './pricing/PricingHeader';
import PricingPlans from './pricing/PricingPlans';
import EnterpriseCalculator from './pricing/EnterpriseCalculator';

// Define product categories for pricing
const productCategories = [
  { id: 'smart-pei', name: 'Smart PEI', description: 'Planos para criação e gestão de PEIs' },
  { id: 'educare-app', name: 'Educare App', description: 'Plataforma de desenvolvimento infantil' },
  { id: 'robotics', name: 'Robótica', description: 'Licenças e kits de robótica educacional' },
  { id: 'courses', name: 'Cursos', description: 'Capacitação para profissionais e famílias' },
  { id: 'store', name: 'Loja', description: 'Produtos educacionais e recursos didáticos' }
];

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState('smart-pei');
  const [students, setStudents] = useState(50);
  const [users, setUsers] = useState(5);
  const [customPrice, setCustomPrice] = useState(calculateEnterpriseCost(50, 5));
  
  const handleStudentsChange = (value: number[]) => {
    const newStudents = value[0];
    setStudents(newStudents);
    setCustomPrice(calculateEnterpriseCost(newStudents, users));
  };
  
  const handleUsersChange = (value: number[]) => {
    const newUsers = value[0];
    setUsers(newUsers);
    setCustomPrice(calculateEnterpriseCost(students, newUsers));
  };
  
  const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 50;
    const newStudents = Math.max(50, Math.min(500, value));
    setStudents(newStudents);
    setCustomPrice(calculateEnterpriseCost(newStudents, users));
  };
  
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 5;
    const newUsers = Math.max(5, Math.min(100, value));
    setUsers(newUsers);
    setCustomPrice(calculateEnterpriseCost(students, newUsers));
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-educare-50 via-background to-background pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-educare-100 text-educare-800 inline-block mb-3 sm:mb-4">
            Planos e Preços
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Escolha os produtos ideais para você
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos opções flexíveis para atender às necessidades de profissionais independentes, 
            pais, educadores e instituições de ensino, com diferentes soluções integradas.
          </p>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 max-w-4xl mx-auto mb-8">
            {productCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs md:text-sm py-2"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="smart-pei">
            <PricingPlans activeTab="plans" />
            
            <div className="mt-10 text-center">
              <Button asChild className="rounded-full bg-educare-600 hover:bg-educare-700">
                <Link to="/payment?category=smart-pei">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Adquirir Smart PEI
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="educare-app">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PricingCard
                title="Plano Familiar"
                price="R$ 29,90"
                period="mensal"
                description="Ideal para famílias acompanharem o desenvolvimento de seus filhos"
                features={[
                  "Até 3 perfis infantis",
                  "Avaliações completas",
                  "Atividades recomendadas",
                  "Relatórios mensais",
                  "Suporte via chat"
                ]}
                cta="Assinar Plano Familiar"
                link="/payment?product=educare-app-family"
                popular={false}
              />
              
              <PricingCard
                title="Plano Educador"
                price="R$ 59,90"
                period="mensal"
                description="Perfeito para profissionais que atendem múltiplas crianças"
                features={[
                  "Até 20 perfis infantis",
                  "Avaliações avançadas",
                  "Atividades personalizadas",
                  "Relatórios semanais",
                  "Compartilhamento com pais",
                  "Suporte prioritário"
                ]}
                cta="Assinar Plano Educador"
                link="/payment?product=educare-app-educator"
                popular={true}
              />
              
              <PricingCard
                title="Plano Institucional"
                price="R$ 199,90"
                period="mensal"
                description="Solução completa para escolas e clínicas"
                features={[
                  "Perfis ilimitados",
                  "Até 5 profissionais",
                  "Dashboard institucional",
                  "Análises detalhadas",
                  "Suporte dedicado",
                  "Personalização com marca"
                ]}
                cta="Assinar Plano Institucional"
                link="/payment?product=educare-app-institutional"
                popular={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="robotics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PricingCard
                title="Kit Iniciante"
                price="R$ 299,90"
                period="à vista"
                description="Para crianças de 7 a 10 anos iniciarem na robótica"
                features={[
                  "15 peças modulares",
                  "Manual de atividades",
                  "App de programação",
                  "3 projetos guiados",
                  "Suporte online"
                ]}
                cta="Comprar Kit Iniciante"
                link="/payment?product=robotics-starter"
                popular={false}
              />
              
              <PricingCard
                title="Kit Intermediário"
                price="R$ 499,90"
                period="à vista"
                description="Para crianças de 10 a 14 anos aprofundarem conhecimentos"
                features={[
                  "35 peças modulares",
                  "Sensores básicos",
                  "Manual avançado",
                  "App de programação",
                  "10 projetos guiados",
                  "Suporte dedicado"
                ]}
                cta="Comprar Kit Intermediário"
                link="/payment?product=robotics-intermediate"
                popular={true}
              />
              
              <PricingCard
                title="Kit Avançado"
                price="R$ 899,90"
                period="à vista"
                description="Para adolescentes de 14+ anos desenvolverem projetos complexos"
                features={[
                  "70 peças modulares",
                  "Sensores avançados",
                  "Motores de precisão",
                  "Plataforma de programação",
                  "20 projetos desafiadores",
                  "Suporte prioritário"
                ]}
                cta="Comprar Kit Avançado"
                link="/payment?product=robotics-advanced"
                popular={false}
              />
              
              <PricingCard
                title="Kit Institucional"
                price="R$ 2.999,90"
                period="à vista"
                description="Para instituições educacionais implementarem aulas de robótica"
                features={[
                  "5 kits completos",
                  "Material didático",
                  "Treinamento para professor",
                  "Planos de aula",
                  "Certificação",
                  "Suporte dedicado"
                ]}
                cta="Comprar Kit Institucional"
                link="/payment?product=robotics-institutional"
                popular={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PricingCard
                title="Educação Inclusiva"
                price="R$ 397,00"
                period="curso completo"
                description="Especialização em práticas inclusivas para educadores"
                features={[
                  "40 horas de conteúdo",
                  "Certificado reconhecido",
                  "Materiais complementares",
                  "Acesso vitalício",
                  "Fórum de dúvidas"
                ]}
                cta="Matricular-se Agora"
                link="/payment?product=course-inclusive"
                popular={false}
              />
              
              <PricingCard
                title="Desenvolvimento Infantil"
                price="R$ 497,00"
                period="curso completo"
                description="Aprofundamento nas etapas do desenvolvimento infantil"
                features={[
                  "60 horas de conteúdo",
                  "Estudos de caso",
                  "Avaliações práticas",
                  "Certificado reconhecido",
                  "Mentoria em grupo",
                  "Materiais complementares"
                ]}
                cta="Matricular-se Agora"
                link="/payment?product=course-development"
                popular={true}
              />
              
              <PricingCard
                title="Robótica para Educadores"
                price="R$ 597,00"
                period="curso completo"
                description="Capacitação para implementar aulas de robótica"
                features={[
                  "80 horas de conteúdo",
                  "Kit de iniciação incluído",
                  "Projetos práticos",
                  "Planos de aula prontos",
                  "Mentoria individual",
                  "Certificado reconhecido"
                ]}
                cta="Matricular-se Agora"
                link="/payment?product=course-robotics"
                popular={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="store">
            <div className="flex flex-col items-center space-y-8">
              <div className="bg-primary/10 rounded-lg p-6 text-center max-w-2xl">
                <h3 className="text-xl font-bold mb-2">Acesse nossa loja completa</h3>
                <p className="mb-4">
                  Descubra nossa variedade de produtos educacionais, materiais didáticos, 
                  jogos pedagógicos e recursos para necessidades especiais.
                </p>
                <Button asChild className="rounded-full">
                  <Link to="/store">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Visitar Loja Educare+
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="bg-educare-50 rounded-lg p-6 flex-1">
                  <h4 className="font-semibold mb-2">Destaques</h4>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-educare-600 mr-2"></div> Kits sensoriais a partir de R$ 89,90</li>
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-educare-600 mr-2"></div> Jogos de alfabetização a partir de R$ 59,90</li>
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-educare-600 mr-2"></div> Recursos visuais a partir de R$ 29,90</li>
                  </ul>
                </div>
                
                <div className="bg-educare-50 rounded-lg p-6 flex-1">
                  <h4 className="font-semibold mb-2">Vantagens</h4>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-educare-600 mr-2"></div> Frete grátis acima de R$ 199,90</li>
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-educare-600 mr-2"></div> Parcelamento em até 12x</li>
                    <li className="flex items-center"><div className="w-2 h-2 rounded-full bg-educare-600 mr-2"></div> Descontos para instituições</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-6">Checkout Integrado</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Adquira qualquer combinação de produtos Educare+ em um único processo de pagamento,
            simplificando sua experiência de compra.
          </p>
          <Button asChild size="lg" className="rounded-full bg-educare-600 hover:bg-educare-700">
            <Link to="/payment">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Central de Pagamentos Educare+
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Pricing Card Component for other product categories
interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  popular: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  cta, 
  link, 
  popular 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col ${
        popular ? 'border-2 border-educare-500' : 'border-border'
      }`}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-educare-500 text-white text-xs font-medium px-3 py-1 rounded-bl-md">
            Mais Popular
          </div>
        </div>
      )}
      
      <div className={`p-6 pb-4 ${popular ? 'pt-8' : 'pt-6'}`}>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="mb-4">
          <span className="text-2xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1 text-sm">/{period}</span>
        </div>
      </div>
      
      <div className="px-6 py-4 flex-grow">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start text-sm">
              <svg className="h-5 w-5 text-educare-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-6 pb-6 mt-auto">
        <Button asChild className={`w-full rounded-full ${
          popular ? 'bg-educare-500 hover:bg-educare-600 text-white' : 'bg-primary/10 hover:bg-primary/20 text-primary'
        }`}>
          <Link to={link}>
            {cta}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingSection;
