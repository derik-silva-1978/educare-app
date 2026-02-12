import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const LandingHeroSection: React.FC = () => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: '/images/hero/familia-caminhando.png',
      alt: 'Família caminhando com bebê'
    },
    {
      src: '/images/hero/mae-lendo-bebe.png',
      alt: 'Mãe lendo livro com bebê'
    },
    {
      src: '/images/hero/bebe-brinquedos-suspensos.png',
      alt: 'Bebê explorando brinquedos'
    },
    {
      src: '/images/hero/bebe-brincando-chao.png',
      alt: 'Bebê brincando no chão'
    },
    {
      src: '/images/hero/familia-recem-nascido.png',
      alt: 'Família com recém-nascido'
    },
    {
      src: '/images/hero/gemeos-brinquedos.png',
      alt: 'Gêmeos com brinquedos educativos'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap');
        
        .carousel-image {
          transition: opacity 0.8s ease-in-out;
        }
      `}</style>
      
      <section className="relative py-12 md:py-20 overflow-hidden pt-16 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50/50 to-green-50/30 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 
                className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Seu filho está se desenvolvendo bem?
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl leading-relaxed">
                Acompanhe o desenvolvimento do seu filho com base em evidências científicas. Avaliações rápidas, orientações personalizadas e suporte de especialistas em um só lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {user ? (
                  <Button 
                    size="lg" 
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    asChild
                  >
                    <Link to="/educare-app/dashboard">
                      Acessar Meu Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    asChild
                  >
                    <Link to="/educare-app/auth?action=register">
                      Fazer Avaliação Gratuita <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400"
                  asChild
                >
                  <Link to="/blog">
                    Explorar Conteúdo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-3"
              >
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  Baseado em OMS e SBP • Tecnologia exclusiva • 100% gratuito para começar
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square md:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className="carousel-image absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: currentImageIndex === index ? 1 : 0
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x500/E8F3FF/91D8F7?text=${encodeURIComponent(image.alt)}`;
                    }}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex gap-1.5 justify-center">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentImageIndex === index 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 w-2 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingHeroSection;
