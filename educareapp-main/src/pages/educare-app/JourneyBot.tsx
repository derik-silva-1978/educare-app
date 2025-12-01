import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useJourneyBotPage } from '@/hooks/educare-app/useJourneyBotPage';
import JourneyBotPageContent from '@/components/educare-app/journey-bot/JourneyBotPageContent';

export default function JourneyBot() {
  const navigate = useNavigate();
  
  const {
    showChildSelector,
    selectedChild,
    children,
    isLoading,
    error,
    handleChildSelect,
    handleBackToSelector,
    setShowChildSelector
  } = useJourneyBotPage();

  const handleBackToDashboard = () => {
    navigate('/educare-app/dashboard');
  };

  const handleShowChildSelector = () => {
    setShowChildSelector(true);
  };

  return (
    <>
      <Helmet>
        <title>Titi Nauta | Educare</title>
        <meta
          name="description"
          content="Acompanhe o desenvolvimento do seu filho com o TitiBOT"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-6">
          <Button 
            onClick={handleBackToDashboard}
            variant="ghost" 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <JourneyBotPageContent
            isLoading={isLoading}
            error={error}
            showChildSelector={showChildSelector}
            selectedChild={selectedChild}
            children={children}
            onChildSelect={handleChildSelect}
            onBackToSelector={handleBackToSelector}
            onBackToDashboard={handleBackToDashboard}
            onShowChildSelector={handleShowChildSelector}
          />
        </motion.div>
      </div>
    </>
  );
}