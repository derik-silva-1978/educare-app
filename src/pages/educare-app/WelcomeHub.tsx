import React, { useState } from 'react';
import { 
  IconToolbar,
  WelcomeHero, 
  NewsCarousel, 
  TrainingSection,
  AcademyCourses, 
  TitiNautaWidget, 
  FeedbackPanel, 
  DonationCTA 
} from '@/components/educare-app/welcome';
import { useNavigate } from 'react-router-dom';

const WelcomeHub: React.FC = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
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

        <NewsCarousel />

        <TrainingSection />

        <AcademyCourses />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2" />
          <div className="space-y-6">
            <TitiNautaWidget />
            {showFeedback && <FeedbackPanel />}
            <DonationCTA />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomeHub;
