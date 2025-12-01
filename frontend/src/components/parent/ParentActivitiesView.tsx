import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Filter, 
  Search,
  Baby,
  Heart,
  Brain,
  Gamepad2,
  Palette,
  MessageCircle,
  Activity,
  RefreshCw,
  ChevronRight,
  Star
} from 'lucide-react';

// Interfaces
interface Child {
  id: string;
  name: string;
  age_in_months: number;
  birth_date: string;
}

interface ActivityRecommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  min_age_months: number;
  max_age_months: number;
  duration_minutes: number;
  materials: string[];
  instructions: string;
  difficulty?: string;
}

interface ChildWithActivities extends Child {
  recommended_activities: ActivityRecommendation[];
  activities_count: number;
}

// Dados mockados de atividades para demonstração
const mockActivities: ActivityRecommendation[] = [
  {
    id: 1,
    title: 'Brincadeira com Blocos',
    description: 'Atividade de construção para desenvolvimento motor fino e coordenação',
    category: 'Motor',
    min_age_months: 12,
    max_age_months: 36,
    duration_minutes: 30,
    materials: ['Blocos de madeira', 'Tapete macio', 'Caixa organizadora'],
    instructions: 'Deixe a criança explorar os blocos livremente. Demonstre como empilhar e depois permita que ela tente. Celebre cada conquista!',
    difficulty: 'Fácil'
  },
  {
    id: 2,
    title: 'Leitura Interativa',
    description: 'Desenvolvimento da linguagem através de histórias e perguntas',
    category: 'Cognitivo',
    min_age_months: 18,
    max_age_months: 60,
    duration_minutes: 20,
    materials: ['Livros ilustrados', 'Almofadas confortáveis'],
    instructions: 'Leia com entonação variada. Faça perguntas sobre as imagens: "Onde está o gato?", "Que cor é esta?". Permita que a criança vire as páginas.',
    difficulty: 'Fácil'
  },
  {
    id: 3,
    title: 'Pintura com Dedos',
    description: 'Expressão artística e desenvolvimento sensorial',
    category: 'Criativo',
    min_age_months: 18,
    max_age_months: 48,
    duration_minutes: 45,
    materials: ['Tinta atóxica', 'Papel grande', 'Aventais', 'Toalhas'],
    instructions: 'Vista roupas velhas ou aventais. Deixe a criança explorar as cores e texturas. Não se preocupe com o resultado, foque no processo!',
    difficulty: 'Médio'
  },
  {
    id: 4,
    title: 'Música e Movimento',
    description: 'Desenvolvimento rítmico e coordenação corporal',
    category: 'Motor',
    min_age_months: 6,
    max_age_months: 36,
    duration_minutes: 15,
    materials: ['Música infantil', 'Instrumentos simples', 'Lenços coloridos'],
    instructions: 'Toque músicas animadas e dance junto com a criança. Use instrumentos simples como chocalhos. Imite movimentos de animais.',
    difficulty: 'Fácil'
  },
  {
    id: 5,
    title: 'Exploração Sensorial',
    description: 'Estimulação dos sentidos através de texturas e materiais',
    category: 'Sensorial',
    min_age_months: 6,
    max_age_months: 24,
    duration_minutes: 25,
    materials: ['Tecidos diferentes', 'Objetos texturizados', 'Caixa sensorial'],
    instructions: 'Apresente diferentes texturas: liso, áspero, macio, duro. Deixe a criança tocar e explorar. Descreva as sensações: "Que macio!", "Que áspero!"',
    difficulty: 'Fácil'
  }
];

// Dados mockados de crianças para demonstração
const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Ana Clara',
    age_in_months: 24,
    birth_date: '2022-01-15'
  },
  {
    id: '2', 
    name: 'Pedro Miguel',
    age_in_months: 15,
    birth_date: '2022-10-10'
  }
];

// Função para filtrar atividades por idade
const getActivitiesForChild = (ageInMonths: number): ActivityRecommendation[] => {
  return mockActivities.filter(activity => 
    ageInMonths >= activity.min_age_months && ageInMonths <= activity.max_age_months
  );
};

// Função para formatar idade
const formatAge = (ageInMonths: number): string => {
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  }
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  
  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  return `${years}a ${months}m`;
};

// Ícones por categoria
const getCategoryIcon = (category: string) => {
  const icons = {
    'Motor': Activity,
    'Cognitivo': Brain,
    'Criativo': Palette,
    'Sensorial': Heart,
    'Comunicação': MessageCircle,
    'Social': Users
  };
  return icons[category as keyof typeof icons] || Gamepad2;
};

// Cores por categoria
const getCategoryColor = (category: string) => {
  const colors = {
    'Motor': 'bg-blue-100 text-blue-800',
    'Cognitivo': 'bg-purple-100 text-purple-800',
    'Criativo': 'bg-pink-100 text-pink-800',
    'Sensorial': 'bg-green-100 text-green-800',
    'Comunicação': 'bg-yellow-100 text-yellow-800',
    'Social': 'bg-indigo-100 text-indigo-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

// Componente principal
export const ParentActivitiesView: React.FC = () => {
  const [children, setChildren] = useState<ChildWithActivities[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar dados das crianças e atividades
  useEffect(() => {
    const loadChildrenWithActivities = () => {
      setLoading(true);
      
      // Simular carregamento
      setTimeout(() => {
        const childrenWithActivities = mockChildren.map(child => ({
          ...child,
          recommended_activities: getActivitiesForChild(child.age_in_months),
          activities_count: getActivitiesForChild(child.age_in_months).length
        }));
        
        setChildren(childrenWithActivities);
        setLoading(false);
      }, 1000);
    };

    loadChildrenWithActivities();
  }, []);

  // Filtrar atividades
  const getFilteredActivities = () => {
    const child = children.find(c => c.id === selectedChild);
    if (!child) return [];

    let activities = child.recommended_activities;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      activities = activities.filter(activity => 
        activity.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      activities = activities.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return activities;
  };

  // Obter categorias únicas
  const getCategories = () => {
    const allActivities = children.flatMap(child => child.recommended_activities);
    const categories = [...new Set(allActivities.map(activity => activity.category))];
    return categories;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                Atividades para seus Filhos
              </h1>
              <p className="text-gray-600 mt-2">
                Descubra atividades personalizadas baseadas na idade de cada criança
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg">
              <Star className="h-5 w-5" />
              <span className="font-medium">
                {children.reduce((total, child) => total + child.activities_count, 0)} atividades disponíveis
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Lista de Crianças */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Baby className="h-5 w-5 text-blue-600" />
                Suas Crianças
              </h2>
              
              <div className="space-y-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedChild === child.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-600">{formatAge(child.age_in_months)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {child.activities_count}
                        </div>
                        <div className="text-xs text-gray-500">atividades</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {children.length === 0 && (
                <div className="text-center py-8">
                  <Baby className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma criança cadastrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {selectedChild ? (
              <>
                {/* Filtros */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Busca */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar atividades..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Filtro por categoria */}
                    <div className="sm:w-48">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Todas as categorias</option>
                        {getCategories().map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Lista de Atividades */}
                <div className="space-y-6">
                  {getFilteredActivities().map((activity) => {
                    const IconComponent = getCategoryIcon(activity.category);
                    
                    return (
                      <div key={activity.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-blue-100 rounded-lg">
                                <IconComponent className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {activity.title}
                                </h3>
                                <p className="text-gray-600 mb-3">{activity.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {activity.duration_minutes} min
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {activity.min_age_months === activity.max_age_months 
                                      ? formatAge(activity.min_age_months)
                                      : `${formatAge(activity.min_age_months)} - ${formatAge(activity.max_age_months)}`
                                    }
                                  </div>
                                  {activity.difficulty && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {activity.difficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(activity.category)}`}>
                              {activity.category}
                            </span>
                          </div>

                          {/* Materiais */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Materiais necessários:</h4>
                            <div className="flex flex-wrap gap-2">
                              {activity.materials.map((material, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Instruções */}
                          <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Como fazer:</h4>
                            <p className="text-gray-700 leading-relaxed">{activity.instructions}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {getFilteredActivities().length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma atividade encontrada
                      </h3>
                      <p className="text-gray-600">
                        Tente ajustar os filtros ou selecionar outra criança
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Baby className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma criança
                </h3>
                <p className="text-gray-600">
                  Escolha uma criança na lista ao lado para ver as atividades recomendadas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentActivitiesView;
