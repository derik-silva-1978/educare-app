
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Dashboard | Educare+</title>
        <meta name="description" content="Dashboard da plataforma Educare+" />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="section-header mb-6">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Esta página foi migrada para o novo aplicativo Educare.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Aplicativo Educare+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Esta página está desativada. Por favor, utilize o novo aplicativo Educare+.</p>
                
                <Button 
                  onClick={() => navigate('/educare/dashboard')}
                  className="w-full md:w-auto"
                >
                  Ir para o Educare Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
