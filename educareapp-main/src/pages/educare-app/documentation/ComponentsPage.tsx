
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const ComponentsPage: React.FC = () => {
  const components = [
    {
      name: "AI Assistant Components",
      description: "Intelligent support components providing personalized guidance throughout the platform",
      category: "AI",
      path: "/docs/components/ai-assistant",
      count: 12
    },
    {
      name: "Assessment Components",
      description: "Framework for creating, managing, and analyzing developmental assessments",
      category: "Core",
      path: "/docs/components/assessment",
      count: 18
    },
    {
      name: "Quiz Components",
      description: "Interactive developmental quizzes with age-appropriate questions and feedback",
      category: "Core",
      path: "/docs/components/quiz",
      count: 24
    },
    {
      name: "Dashboard Components",
      description: "Analytics and visualization components for progress tracking",
      category: "UI",
      path: "/docs/components/dashboard",
      count: 10
    },
    {
      name: "Form Components",
      description: "Structured data collection components with validation",
      category: "UI",
      path: "/docs/components/forms",
      count: 8
    }
  ];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'AI': return 'bg-purple-100 text-purple-800';
      case 'Core': return 'bg-blue-100 text-blue-800';
      case 'UI': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Componentes | Documentação Educare</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Documentação de Componentes</h1>
          <Button variant="outline">
            <Layout className="mr-2 h-4 w-4" />
            Ver Todos
          </Button>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600 max-w-3xl">
            A plataforma Educare é construída com componentes reutilizáveis que implementam 
            funcionalidades específicas. Explore a documentação detalhada de cada grupo de componentes.
          </p>
        </div>

        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component, idx) => (
            <Card key={idx} className="border-t-4 border-t-blue-600 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{component.name}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(component.category)}`}>
                    {component.category}
                  </span>
                </div>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">{component.count}</span>
                  <span className="ml-1">componentes</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={() => window.location.href = component.path}
                >
                  Ver documentação
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ComponentsPage;
