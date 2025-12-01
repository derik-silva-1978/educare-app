
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UserSettings } from '@/components/smart-pei/settings/UserSettings';
import { TitibotProvider } from '@/components/smart-pei/titibot/TitibotProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

const SettingsPage: React.FC = () => {
  return (
    <TitibotProvider>
      <Helmet>
        <title>Configurações | Smart PEI</title>
        <meta name="description" content="Configurações de conta e preferências do sistema Smart PEI" />
      </Helmet>
      
      <TooltipProvider>
        <UserSettings />
      </TooltipProvider>
    </TitibotProvider>
  );
};

export default SettingsPage;
