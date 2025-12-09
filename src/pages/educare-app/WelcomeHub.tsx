import React, { useState } from 'react';
import { 
  IconToolbar, 
  WelcomeHero, 
  NewsCarousel, 
  AcademyCourses, 
  TitiNautaWidget, 
  FeedbackPanel, 
  DonationCTA 
} from '@/components/educare-app/welcome';
import { useNavigate } from 'react-router-dom';

const WelcomeHub: React.FC = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E+</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Educare+</span>
          </div>
          <IconToolbar
            notificationCount={3}
            onFeedbackClick={() => setShowFeedback(!showFeedback)}
            onTitiNautaClick={() => navigate('/educare-app/titinauta')}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
        <WelcomeHero />

        <NewsCarousel />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AcademyCourses />
          </div>
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
