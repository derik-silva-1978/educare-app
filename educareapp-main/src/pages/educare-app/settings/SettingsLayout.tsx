import React from 'react';
import { Outlet } from 'react-router-dom';

const SettingsLayout: React.FC = () => {
  return (
    <div className="container mx-auto">
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
