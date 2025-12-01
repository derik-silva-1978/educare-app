
import React from 'react';

interface HealthFormContainerProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export const HealthFormContainer: React.FC<HealthFormContainerProps> = ({
  header,
  children
}) => {
  return (
    <div className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl shadow-lg overflow-hidden">
      {header}
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
};
