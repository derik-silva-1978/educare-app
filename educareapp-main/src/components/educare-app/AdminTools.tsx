
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Database, Upload, Users, Settings, BarChart, BookOpen } from 'lucide-react';

interface AdminToolsProps {
  className?: string;
}

const AdminTools: React.FC<AdminToolsProps> = ({ className }) => {
  const navigate = useNavigate();

  const adminTools = [
    {
      title: 'Gerenciar Usuários',
      description: 'Administre contas de usuários e permissões.',
      icon: <Users className="h-5 w-5 text-blue-600" />,
      onClick: () => navigate('/educare-app/admin/users')
    },
    {
      title: 'Importar Questões',
      description: 'Importe questões para o quiz de desenvolvimento.',
      icon: <Upload className="h-5 w-5 text-green-600" />,
      onClick: () => navigate('/educare-app/admin/import')
    },
    {
      title: 'Configurações do Sistema',
      description: 'Ajuste as configurações globais do sistema.',
      icon: <Settings className="h-5 w-5 text-purple-600" />,
      onClick: () => navigate('/educare-app/admin/settings')
    },
    {
      title: 'Registros e Estatísticas',
      description: 'Visualize dados e estatísticas do sistema.',
      icon: <BarChart className="h-5 w-5 text-amber-600" />,
      onClick: () => navigate('/educare-app/admin/stats')
    },
    {
      title: 'Gerenciar Conteúdo',
      description: 'Edite conteúdos educacionais e informativos.',
      icon: <BookOpen className="h-5 w-5 text-red-600" />,
      onClick: () => navigate('/educare-app/admin/content')
    },
    {
      title: 'Banco de Dados',
      description: 'Acesse operações avançadas do banco de dados.',
      icon: <Database className="h-5 w-5 text-indigo-600" />,
      onClick: () => navigate('/educare-app/admin/database')
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ferramentas de Administração</CardTitle>
        <CardDescription>
          Acesse as ferramentas administrativas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminTools.map((tool, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center text-center space-y-3 border-dashed hover:border-primary hover:bg-primary/5"
              onClick={tool.onClick}
            >
              <div className="bg-primary/10 rounded-full p-3">{tool.icon}</div>
              <div>
                <h3 className="font-medium">{tool.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTools;
