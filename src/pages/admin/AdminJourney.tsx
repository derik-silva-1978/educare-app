
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit2, Trash2, Eye, ArrowUpDown } from 'lucide-react';

// Mock journey data
const journeyData = [
  {
    id: '1',
    title: '0-12 meses',
    description: 'Primeiros passos do desenvolvimento infantil',
    ageRange: '0-12 meses',
    phasesCount: 4,
    questionsCount: 25,
    status: 'active',
  },
  {
    id: '2',
    title: '1-2 anos',
    description: 'Descobertas e primeiras palavras',
    ageRange: '12-24 meses',
    phasesCount: 3,
    questionsCount: 18,
    status: 'active',
  },
  {
    id: '3',
    title: '2-3 anos',
    description: 'Explorando o mundo ao redor',
    ageRange: '24-36 meses',
    phasesCount: 3,
    questionsCount: 20,
    status: 'active',
  },
  {
    id: '4',
    title: '3-4 anos',
    description: 'Imaginação e comunicação',
    ageRange: '36-48 meses',
    phasesCount: 3,
    questionsCount: 22,
    status: 'active',
  },
  {
    id: '5',
    title: '4-5 anos',
    description: 'Preparação para a educação formal',
    ageRange: '48-60 meses',
    phasesCount: 4,
    questionsCount: 24,
    status: 'draft',
  },
];

interface JourneyFormProps {
  journey: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (journey: any) => void;
}

const JourneyForm: React.FC<JourneyFormProps> = ({ journey, open, onOpenChange, onSubmit }) => {
  const [title, setTitle] = useState(journey?.title || '');
  const [description, setDescription] = useState(journey?.description || '');
  const [ageRange, setAgeRange] = useState(journey?.ageRange || '');
  const [status, setStatus] = useState(journey?.status || 'draft');
  
  const resetForm = () => {
    if (journey) {
      setTitle(journey.title);
      setDescription(journey.description);
      setAgeRange(journey.ageRange);
      setStatus(journey.status);
    } else {
      setTitle('');
      setDescription('');
      setAgeRange('');
      setStatus('draft');
    }
  };
  
  React.useEffect(() => {
    resetForm();
  }, [journey]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: journey?.id || Date.now().toString(),
      title,
      description,
      ageRange,
      status,
      phasesCount: journey?.phasesCount || 0,
      questionsCount: journey?.questionsCount || 0,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-slate-900">{journey ? 'Editar Jornada' : 'Nova Jornada'}</DialogTitle>
          <DialogDescription className="text-slate-600">
            {journey 
              ? 'Edite os detalhes da jornada de desenvolvimento' 
              : 'Crie uma nova jornada de desenvolvimento'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-800">Título</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 0-12 meses"
              required
              className="border-slate-300 bg-white text-slate-900 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-800">Descrição</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva brevemente esta jornada..."
              required
              className="border-slate-300 bg-white text-slate-900 focus:border-blue-500 min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ageRange" className="text-slate-800">Faixa Etária</Label>
            <Input 
              id="ageRange" 
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              placeholder="Ex: 0-12 meses"
              required
              className="border-slate-300 bg-white text-slate-900 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-slate-800">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="border-slate-300 bg-white text-slate-900">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="draft" className="text-slate-900">Rascunho</SelectItem>
                <SelectItem value="active" className="text-slate-900">Ativo</SelectItem>
                <SelectItem value="archived" className="text-slate-900">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {journey ? 'Salvar Alterações' : 'Criar Jornada'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminJourney: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'title' | 'ageRange'>('title');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentJourney, setCurrentJourney] = useState<any | null>(null);
  
  const handleSort = (field: 'title' | 'ageRange') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const sortedAndFilteredJourneys = [...journeyData]
    .filter(journey => 
      journey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.ageRange.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField].localeCompare(b[sortField]);
      } else {
        return b[sortField].localeCompare(a[sortField]);
      }
    });
  
  const handleAddJourney = () => {
    setCurrentJourney(null);
    setDialogOpen(true);
  };
  
  const handleEditJourney = (journey: any) => {
    setCurrentJourney(journey);
    setDialogOpen(true);
  };
  
  const handleDeleteJourney = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta jornada? Esta ação não pode ser desfeita.')) {
      toast({
        title: 'Jornada excluída',
        description: 'A jornada foi excluída com sucesso.',
      });
    }
  };
  
  const handleJourneySubmit = (journey: any) => {
    if (currentJourney) {
      toast({
        title: 'Jornada atualizada',
        description: `As alterações na jornada "${journey.title}" foram salvas.`,
      });
    } else {
      toast({
        title: 'Jornada criada',
        description: `A nova jornada "${journey.title}" foi criada com sucesso.`,
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300 font-medium">Ativo</Badge>;
      case 'draft':
        return <Badge variant="outline" className="border-slate-400 text-slate-700 font-medium">Rascunho</Badge>;
      case 'archived':
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-medium">Arquivado</Badge>;
      default:
        return <Badge variant="outline" className="font-medium">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Gerenciar Jornadas | Admin Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Jornadas</h1>
          
          <Button 
            onClick={handleAddJourney}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Jornada
          </Button>
        </div>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-white border-b pb-4">
            <CardTitle className="text-slate-900">Jornadas de Desenvolvimento</CardTitle>
            <CardDescription className="text-slate-600">
              Gerenciamento das jornadas de desenvolvimento infantil
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Buscar jornada..."
                    className="pl-9 border-slate-300 text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-100">
                      <TableHead className="w-[200px] text-slate-700">
                        <Button variant="ghost" className="p-0 h-8 font-medium text-slate-700" onClick={() => handleSort('title')}>
                          Título
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-slate-700">Descrição</TableHead>
                      <TableHead className="text-slate-700">
                        <Button variant="ghost" className="p-0 h-8 font-medium text-slate-700" onClick={() => handleSort('ageRange')}>
                          Faixa Etária
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-slate-700">Fases</TableHead>
                      <TableHead className="text-slate-700">Questões</TableHead>
                      <TableHead className="text-slate-700">Status</TableHead>
                      <TableHead className="w-[100px] text-slate-700">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredJourneys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-600">
                          Nenhuma jornada encontrada com os critérios de busca atuais.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedAndFilteredJourneys.map((journey) => (
                        <TableRow key={journey.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-900">{journey.title}</TableCell>
                          <TableCell className="hidden md:table-cell text-slate-700">{journey.description}</TableCell>
                          <TableCell className="text-slate-700">{journey.ageRange}</TableCell>
                          <TableCell className="hidden md:table-cell text-slate-700">{journey.phasesCount}</TableCell>
                          <TableCell className="text-slate-700">{journey.questionsCount}</TableCell>
                          <TableCell>{getStatusBadge(journey.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Visualizar"
                                className="text-slate-700 hover:bg-slate-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Editar"
                                className="text-slate-700 hover:bg-slate-100"
                                onClick={() => handleEditJourney(journey)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Excluir"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteJourney(journey.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <JourneyForm 
        journey={currentJourney}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleJourneySubmit}
      />
    </>
  );
};

export default AdminJourney;
