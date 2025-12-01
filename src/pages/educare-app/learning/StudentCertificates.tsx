
import React from 'react';
import { Award, Download, Share2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentCertificates: React.FC = () => {
  const certificates = [
    {
      id: '1',
      title: 'Arte e Criatividade na Primeira Infância',
      completionDate: '5 de outubro, 2024',
      certificateId: 'EC-2024-001234',
      instructor: 'Ana Carolina',
      duration: '5 horas',
      skills: ['Arte Infantil', 'Criatividade', 'Desenvolvimento Motor Fino']
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Certificados</h1>
        <p className="text-gray-600">Visualize e baixe seus certificados de conclusão</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">{cert.title}</CardTitle>
                      <p className="text-gray-600 mt-1">Concluído em {cert.completionDate}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">ID do Certificado:</span>
                    <p className="font-mono text-gray-900">{cert.certificateId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Instrutor:</span>
                    <p className="text-gray-900">{cert.instructor}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Carga Horária:</span>
                    <p className="text-gray-900">{cert.duration}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="font-medium text-gray-500 text-sm">Competências Desenvolvidas:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cert.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum certificado ainda</h3>
            <p className="text-gray-600 mb-6">Complete seus cursos para receber certificados de conclusão</p>
            <Button onClick={() => window.location.href = '/educare-app/aprendizado/courses'}>
              Explore Cursos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentCertificates;
