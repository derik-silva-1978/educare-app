
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Video, Download } from 'lucide-react';

const MaterialApoioPage: React.FC = () => {
  // Placeholder support materials
  const materials = [
    {
      id: 1,
      title: 'Guia de Desenvolvimento Infantil',
      description: 'Manual completo sobre marcos do desenvolvimento',
      type: 'PDF',
      icon: FileText,
      color: 'text-red-500'
    },
    {
      id: 2,
      title: 'Atividades por Faixa Etária',
      description: 'Conjunto de atividades organizadas por idade',
      type: 'Guia',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      id: 3,
      title: 'Vídeos Educativos',
      description: 'Série de vídeos sobre estimulação precoce',
      type: 'Vídeo',
      icon: Video,
      color: 'text-green-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Material de Apoio | Educare</title>
      </Helmet>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Material de Apoio</h1>
          <p className="text-gray-600 mt-2">
            Recursos e materiais para apoiar o desenvolvimento infantil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => {
            const IconComponent = material.icon;
            return (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-8 w-8 ${material.color}`} />
                    <div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <span className="text-sm text-gray-500">{material.type}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{material.description}</p>
                  
                  <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full justify-center">
                    <Download className="h-4 w-4" />
                    Acessar Material
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                Biblioteca em Expansão
              </h3>
              <p className="text-purple-600">
                Nossa equipe está constantemente adicionando novos materiais e recursos. 
                Em breve, você encontrará ainda mais conteúdo personalizado para suas necessidades.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MaterialApoioPage;
