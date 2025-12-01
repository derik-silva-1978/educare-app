
import React from 'react';

interface AdminQuizLayoutProps {
  children: React.ReactNode;
}

const AdminQuizLayout: React.FC<AdminQuizLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin - Quiz Management</h1>
        <p className="text-muted-foreground">
          Legacy quiz system has been replaced with Journey Bot
        </p>
      </div>
      {children}
    </div>
  );
};

export default AdminQuizLayout;
