
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NotificationsSection from '@/components/smart-pei/sections/NotificationsSection';

const NotificationsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Notificações | Smart PEI</title>
        <meta name="description" content="Centro de notificações do Smart PEI" />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-8 pb-12">
          <NotificationsSection />
        </div>
      </main>
    </>
  );
};

export default NotificationsPage;
