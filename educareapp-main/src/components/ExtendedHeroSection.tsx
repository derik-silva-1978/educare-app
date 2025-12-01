
import React from 'react';
import { Button } from '@/components/ui/button';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCTAText?: string;
  secondaryCTALink?: string;
  image?: string;
  gradient?: string;
  onCtaClick?: () => void;
}

const ExtendedHeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  secondaryCTAText,
  secondaryCTALink,
  image,
  gradient,
  onCtaClick
}) => {
  return (
    <section className={`py-20 ${gradient ? `bg-gradient-to-br ${gradient}` : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
              <p className="mt-3 text-xl text-primary font-medium">{subtitle}</p>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                size="lg" 
                onClick={onCtaClick ? onCtaClick : () => window.location.href = ctaLink}
                className="px-8"
              >
                {ctaText}
              </Button>
              
              {secondaryCTAText && secondaryCTALink && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    // If it's an anchor link (starts with #), use smooth scrolling
                    if (secondaryCTALink.startsWith('#')) {
                      const element = document.querySelector(secondaryCTALink);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      window.location.href = secondaryCTALink;
                    }
                  }}
                  className="px-8"
                >
                  {secondaryCTAText}
                </Button>
              )}
            </div>
          </div>
          
          {image && (
            <div className="md:w-1/2 flex justify-center">
              <img 
                src={image} 
                alt={title}
                className="max-w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExtendedHeroSection;
