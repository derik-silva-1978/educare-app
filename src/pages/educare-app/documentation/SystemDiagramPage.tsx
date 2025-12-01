import React from 'react';
import { Helmet } from 'react-helmet-async';

const SystemDiagramPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Diagrama do Sistema | Documentação Educare</title>
      </Helmet>
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Arquitetura do Sistema Educare</h1>
        
        <div className="bg-white p-6 rounded-lg border mb-10">
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <div className="bg-blue-600 text-white rounded-lg px-6 py-3 font-medium">
                  Interface do Usuário React
                </div>
              </div>
              
              <div className="mt-2 flex justify-center">
                <svg height="40" width="2">
                  <line x1="1" y1="0" x2="1" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 w-full mb-8">
              {[
                { title: "Componentes de UI", color: "bg-green-500" },
                { title: "Lógica de Estado", color: "bg-purple-500" },
                { title: "Serviços", color: "bg-orange-500" }
              ].map((box, i) => (
                <div key={i} className={`${box.color} text-white rounded-lg px-4 py-3 text-center`}>
                  {box.title}
                </div>
              ))}
            </div>
            
            <div className="mb-2 w-full flex justify-center">
              <svg height="40" width="2">
                <line x1="1" y1="0" x2="1" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
              </svg>
            </div>
            
            <div className="bg-cyan-600 text-white rounded-lg px-6 py-3 font-medium mb-8 text-center max-w-xs">
              API Layer (Supabase)
            </div>
            
            <div className="mb-2 w-full flex justify-center">
              <svg height="40" width="2">
                <line x1="1" y1="0" x2="1" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
              </svg>
            </div>
            
            <div className="bg-gray-800 text-white rounded-lg px-6 py-3 font-medium text-center max-w-xs">
              Banco de Dados PostgreSQL
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Fluxo de Dados</h2>
            <ol className="list-decimal pl-4 space-y-3">
              <li>Cliente faz requisição através da interface React</li>
              <li>Hooks de dados processam a requisição</li>
              <li>Chamada API é enviada para o backend Supabase</li>
              <li>Políticas RLS validam permissões</li>
              <li>Operações de banco de dados são executadas</li>
              <li>Resultados são devolvidos para o cliente</li>
              <li>Estado do React é atualizado com os novos dados</li>
              <li>Interface é renderizada novamente</li>
            </ol>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Integração de Módulos</h2>
            <div className="relative h-60 border border-gray-200 rounded-lg p-4">
              {/* Core Module */}
              <div className="absolute top-4 left-0 right-0 mx-auto w-32 bg-blue-100 border border-blue-300 rounded p-2 text-center text-sm">
                Core Module
              </div>
              
              {/* Other modules with connecting lines */}
              <div className="absolute top-24 left-4 w-28 bg-green-100 border border-green-300 rounded p-2 text-center text-sm">
                Quiz System
              </div>
              <svg className="absolute top-16 left-32" height="20" width="20">
                <line x1="0" y1="0" x2="20" y2="20" stroke="#94a3b8" strokeWidth="1" />
              </svg>
              
              <div className="absolute top-24 right-4 w-28 bg-purple-100 border border-purple-300 rounded p-2 text-center text-sm">
                Assessment
              </div>
              <svg className="absolute top-16 right-32" height="20" width="20">
                <line x1="20" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="1" />
              </svg>
              
              <div className="absolute bottom-4 left-1/4 w-28 bg-orange-100 border border-orange-300 rounded p-2 text-center text-sm">
                AI Assistant
              </div>
              <svg className="absolute bottom-16 left-1/3" height="20" width="20">
                <line x1="0" y1="0" x2="20" y2="20" stroke="#94a3b8" strokeWidth="1" />
              </svg>
              
              <div className="absolute bottom-4 right-1/4 w-28 bg-cyan-100 border border-cyan-300 rounded p-2 text-center text-sm">
                User Mgmt
              </div>
              <svg className="absolute bottom-16 right-1/3" height="20" width="20">
                <line x1="20" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemDiagramPage;
