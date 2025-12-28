import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  IconToolbar,
  ProfessionalWelcomeHero, 
  NewsCarousel, 
  TrainingSection
} from '@/components/educare-app/welcome';

const ProfessionalWelcomeHub: React.FC = () => {
  const [messageCount] = useState(2);

  return (
    <>
      <Helmet>
        <title>Boas Vindas | Portal Profissional | Educare+</title>
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 py-3 max-w-6xl flex justify-end">
            <IconToolbar messageCount={messageCount} />
          </div>
        </div>

        <main className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
          <ProfessionalWelcomeHero />

          <NewsCarousel audienceFilter="professionals" />

          <TrainingSection audienceFilter="professionals" />
        </main>
      </div>
    </>
  );
};

export default ProfessionalWelcomeHub;
