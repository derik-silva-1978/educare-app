import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PEIViewer } from '@/components/smart-pei/pei/PEIViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PEIViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Visualizar PEI | Smart PEI</title>
        <meta name="description" content="Visualização do Plano de Ensino Individualizado" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Visualização do PEI</h1>
        </div>
        
        {id ? (
          <PEIViewer />
        ) : (
          <div className="p-8 text-center">
            <p>ID do PEI não especificado</p>
            <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
              Voltar
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PEIViewerPage;
