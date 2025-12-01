
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Book, HelpCircle, Video, FileText, Settings } from 'lucide-react';
import { HelpSidebarNav } from './HelpSidebarNav';
import { HelpOnboardingStepper } from './HelpOnboardingStepper';
import { HelpFAQ } from './HelpFAQ';

const HelpCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Primeiros Passos com o Educare</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao Centro de Ajuda do Educare! Aqui você encontrará recursos para utilizar nossa plataforma
              ao máximo potencial. Comece com nosso guia passo a passo abaixo.
            </p>
            <HelpOnboardingStepper />
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium">Documentação</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore nossa documentação detalhada sobre o funcionamento do Educare.
                </p>
                <button 
                  className="text-sm font-medium text-blue-600 hover:underline"
                  onClick={() => setActiveTab('guias')}
                >
                  Ver Documentação →
                </button>
              </div>
              
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Video className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium">Tutoriais em Vídeo</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Assista a nossos tutoriais para aprender como usar recursos específicos.
                </p>
                <button 
                  className="text-sm font-medium text-blue-600 hover:underline"
                  onClick={() => window.open('/educare-app/tutorials', '_blank')}
                >
                  Ver Tutoriais →
                </button>
              </div>
            </div>
          </div>
        );
      case 'faq':
        return <HelpFAQ />;
      case 'guias':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Guias Rápidos</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Guia para Pais", icon: <FileText className="h-5 w-5" />, link: "/docs/user-guides/parent-guide" },
                { title: "Guia para Profissionais", icon: <FileText className="h-5 w-5" />, link: "/docs/user-guides/professional-guide" },
                { title: "Guia do Administrador", icon: <Settings className="h-5 w-5" />, link: "/docs/user-guides/admin-guide" },
                { title: "Sistema de Quiz", icon: <HelpCircle className="h-5 w-5" />, link: "/docs/quiz-system" },
                { title: "Assistente AI", icon: <HelpCircle className="h-5 w-5" />, link: "/docs/components/ai-assistant" },
              ].map((guide, idx) => (
                <div key={idx} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      {guide.icon}
                    </div>
                    <h3 className="font-medium">{guide.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Documentação completa para {guide.title.toLowerCase()}.
                  </p>
                  <a 
                    href={guide.link}
                    className="text-sm font-medium text-blue-600 hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Acessar Guia →
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      case 'suporte':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Entre em Contato</h2>
              <p className="mb-6">Nossa equipe de suporte está disponível para ajudar com qualquer dúvida ou problema que você esteja enfrentando.</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-sm text-gray-500">+55 (11) 4123-4567</p>
                    <p className="text-xs text-gray-500">Segunda a sexta, das 8h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-gray-500">suporte@educare.com</p>
                    <p className="text-xs text-gray-500">Resposta em até 24 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Base de Conhecimento</h3>
                    <p className="text-sm text-gray-500">Consulte nossa base de conhecimento para soluções de problemas comuns</p>
                    <a href="/educare-app/knowledge-base" className="text-sm text-blue-600 hover:underline">Acessar Base de Conhecimento</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Conteúdo não encontrado</div>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Centro de Ajuda | Educare</title>
        <meta name="description" content="Centro de ajuda e documentação do Educare" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <HelpSidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 bg-white rounded-lg border p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
