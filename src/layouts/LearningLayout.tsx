
import React from 'react';
import { Outlet } from 'react-router-dom';
import LearningHeader from '@/components/learning/LearningHeader';
import LearningSidebar from '@/components/learning/LearningSidebar';
import { Toaster } from '@/components/ui/toaster';

const LearningLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LearningHeader />
      
      <div className="flex">
        <LearningSidebar />
        
        <main className="flex-1 ml-64 pt-16">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default LearningLayout;
