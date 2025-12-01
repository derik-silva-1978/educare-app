
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AccessDenied from '../auth/AccessDenied';

export const MainContent: React.FC = () => {
  return (
    <main className="flex-1 overflow-auto bg-gray-50 p-4">
      <div className="container mx-auto">
        <Routes>
          <Route path="/access-denied" element={<AccessDenied requiredRoles={['admin']} />} />
          {/* Routes have been removed as the smart-pei components are no longer used */}
        </Routes>
      </div>
    </main>
  );
};

export default MainContent;
