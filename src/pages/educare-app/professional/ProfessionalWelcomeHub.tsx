import React, { useState } from 'react';
import { 
  IconToolbar,
  WelcomeHero, 
  NewsCarousel, 
  TrainingSection
} from '@/components/educare-app/welcome';

const ProfessionalWelcomeHub: React.FC = () => {
  const [messageCount] = useState(2);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Icon Toolbar - Fixed at top */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex justify-end">
          <IconToolbar messageCount={messageCount} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
        <WelcomeHero />

        <NewsCarousel audienceFilter="professionals" />

        <TrainingSection audienceFilter="professionals" />
      </main>
    </div>
  );
};

export default ProfessionalWelcomeHub;
