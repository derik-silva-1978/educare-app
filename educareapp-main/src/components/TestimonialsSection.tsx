
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay: number;
}

const Testimonial = ({ quote, author, role, company, delay }: TestimonialProps) => (
  <motion.div 
    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Quote className="h-8 w-8 text-educare-400 mb-4" />
    <p className="text-gray-700 mb-4">{quote}</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600 font-medium">
        {author.charAt(0)}
      </div>
      <div className="ml-3">
        <p className="font-medium">{author}</p>
        <p className="text-sm text-gray-500">{role}, {company}</p>
      </div>
    </div>
  </motion.div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "O sistema Educare+ transformou a maneira como gerenciamos o desenvolvimento das crianças em nossa escola. A interface intuitiva e os recursos abrangentes tornaram todo o processo muito mais eficiente.",
      author: "Ana Silva",
      role: "Diretora Pedagógica",
      company: "Escola Novo Caminho",
    },
    {
      quote: "Como pai, posso acompanhar o desenvolvimento do meu filho de forma clara e objetiva. As recomendações de atividades são personalizadas e realmente ajudam no crescimento dele.",
      author: "Carlos Mendes",
      role: "Pai",
      company: "Educare App",
    },
    {
      quote: "Os planos de ensino individualizados do Smart PEI são extremamente eficazes para crianças com necessidades especiais. A plataforma nos ajudou a estruturar intervenções mais precisas.",
      author: "Patrícia Oliveira",
      role: "Psicopedagoga",
      company: "Centro de Apoio Educacional",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-educare-100 text-educare-800 mb-4 inline-block">
            Depoimentos
          </span>
          <h2 className="text-3xl font-bold mb-4">O que nossos usuários dizem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubra como o Educare+ está transformando a experiência educacional de famílias e instituições em todo o Brasil
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              delay={0.2 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
