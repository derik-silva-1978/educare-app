
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import EducareNavbar from '@/components/educare-app/EducareNavbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <EducareNavbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
