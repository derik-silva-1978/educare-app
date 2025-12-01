
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PEIProgress } from '@/hooks/usePEI';
import { format, isSameDay, isAfter, isBefore, addMonths, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import ProgressRecordView from './ProgressRecordView';
import { CalendarIcon, Search, Share2, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from '@/components/smart-pei/students/utils/formatters';

interface ProgressCalendarViewProps {
  progressRecords: PEIProgress[];
}

type DateRangeFilter = 'all' | '1m' | '3m' | '6m' | 'custom';

export const ProgressCalendarView: React.FC<ProgressCalendarViewProps> = ({ 
  progressRecords 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('all');
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(undefined);
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(undefined);
  const [isCustomDateFilterOpen, setIsCustomDateFilterOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Filter records by date range
  const filteredByDateRange = React.useMemo(() => {
    if (dateRangeFilter === 'all') {
      return progressRecords;
    }

    const now = new Date();
    let fromDate: Date;

    switch (dateRangeFilter) {
      case '1m':
        fromDate = subMonths(now, 1);
        break;
      case '3m':
        fromDate = subMonths(now, 3);
        break;
      case '6m':
        fromDate = subMonths(now, 6);
        break;
      case 'custom':
        if (customDateFrom && customDateTo) {
          return progressRecords.filter(record => {
            const recordDate = new Date(record.date);
            return (
              (isAfter(recordDate, startOfMonth(customDateFrom)) || isSameDay(recordDate, customDateFrom)) && 
              (isBefore(recordDate, endOfMonth(customDateTo)) || isSameDay(recordDate, customDateTo))
            );
          });
        }
        return progressRecords;
      default:
        return progressRecords;
    }

    return progressRecords.filter(record => {
      const recordDate = new Date(record.date);
      return isAfter(recordDate, fromDate) || isSameDay(recordDate, fromDate);
    });
  }, [progressRecords, dateRangeFilter, customDateFrom, customDateTo]);
  
  // Sort progress records by date
  const sortedRecords = [...filteredByDateRange].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Get all dates with progress records
  const progressDates = filteredByDateRange.map(record => new Date(record.date));
  
  // Get records for selected date
  const selectedDateRecords = selectedDate 
    ? filteredByDateRange.filter(record => 
        isSameDay(new Date(record.date), selectedDate)
      )
    : [];

  // Filter records by search query
  const filteredRecords = filteredByDateRange.filter(record => {
    if (!searchQuery) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (record.notes && record.notes.toLowerCase().includes(searchLower)) ||
      (record.evidence && record.evidence.toLowerCase().includes(searchLower)) ||
      (record.author && record.author.toLowerCase().includes(searchLower)) ||
      getStatusName(record.status).toLowerCase().includes(searchLower)
    );
  });

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy');
  };

  // Get status name in Portuguese
  const getStatusName = (status: string): string => {
    const statusNames: Record<string, string> = {
      regression: 'Regressão',
      no_change: 'Sem Mudança',
      minor_progress: 'Progresso Menor',
      significant_progress: 'Progresso Significativo',
      achieved: 'Alcançado'
    };
    return statusNames[status] || status;
  };
  
  // Custom day component to show indicators for dates with progress
  const CustomDay = (props: any) => {
    const date = props.date;
    const hasProgress = progressDates.some(d => isSameDay(d, date));
    
    // Get progress status for the date if it exists
    const getStatusForDay = (date: Date) => {
      const record = filteredByDateRange.find(r => isSameDay(new Date(r.date), date));
      if (!record) return null;
      
      return record.status;
    };
    
    const status = getStatusForDay(date);
    
    // Define status colors
    const statusColors: Record<string, string> = {
      regression: 'bg-red-500',
      no_change: 'bg-gray-500',
      minor_progress: 'bg-yellow-500',
      significant_progress: 'bg-green-500',
      achieved: 'bg-blue-500'
    };
    
    return (
      <div className="relative">
        <props.components.Day {...props} />
        {hasProgress && (
          <div 
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${status ? statusColors[status] : 'bg-primary'}`}
          />
        )}
      </div>
    );
  };
  
  // Get earliest and latest dates from records
  const earliestDate = sortedRecords.length > 0 
    ? new Date(sortedRecords[0].date) 
    : new Date();
    
  const latestDate = sortedRecords.length > 0 
    ? new Date(sortedRecords[sortedRecords.length - 1].date) 
    : new Date();

  // Handle search result selection
  const handleSearchResultSelect = (record: PEIProgress) => {
    setSelectedDate(new Date(record.date));
    setIsSearchOpen(false);
  };

  // Apply custom date range filter
  const applyCustomDateFilter = () => {
    if (customDateFrom && customDateTo) {
      setDateRangeFilter('custom');
      setIsCustomDateFilterOpen(false);
    } else {
      toast({
        title: "Erro ao aplicar filtro",
        description: "Por favor, selecione datas de início e fim para o filtro personalizado.",
        variant: "destructive"
      });
    }
  };

  // Reset date range filter
  const resetDateFilter = () => {
    setDateRangeFilter('all');
    setCustomDateFrom(undefined);
    setCustomDateTo(undefined);
  };

  // Format custom date range for display
  const getCustomDateRangeText = () => {
    if (customDateFrom && customDateTo) {
      return `${format(customDateFrom, 'dd/MM/yyyy')} - ${format(customDateTo, 'dd/MM/yyyy')}`;
    }
    return "Personalizado";
  };

  // Sharing functionality
  const generateShareableContent = () => {
    if (!selectedDate || selectedDateRecords.length === 0) {
      toast({
        title: "Nenhum conteúdo para compartilhar",
        description: "Selecione uma data com registros de progresso para compartilhar.",
        variant: "destructive"
      });
      return null;
    }

    // Format the date for display
    const formattedDate = format(selectedDate, 'PPP', { locale: pt });
    
    // Create a text representation of the progress records
    let shareText = `Registros de Progresso - ${formattedDate}\n\n`;
    
    selectedDateRecords.forEach((record, index) => {
      shareText += `Registro ${index + 1}:\n`;
      shareText += `Status: ${getStatusName(record.status)}\n`;
      shareText += `Notas: ${record.notes || 'N/A'}\n`;
      if (record.evidence) shareText += `Evidências: ${record.evidence}\n`;
      if (record.author) shareText += `Autor: ${record.author}\n`;
      shareText += '\n';
    });
    
    return shareText;
  };

  // Share via clipboard
  const handleShareClipboard = () => {
    const shareText = generateShareableContent();
    if (!shareText) return;
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        toast({
          title: "Conteúdo copiado!",
          description: "Os registros de progresso foram copiados para a área de transferência.",
          variant: "default"
        });
      })
      .catch(err => {
        console.error('Erro ao copiar para área de transferência:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o conteúdo para a área de transferência.",
          variant: "destructive"
        });
      });
  };

  // Share via email
  const handleShareEmail = () => {
    const shareText = generateShareableContent();
    if (!shareText) return;
    
    const formattedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';
    const subject = encodeURIComponent(`Registros de Progresso - ${formattedDate}`);
    const body = encodeURIComponent(shareText);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    toast({
      title: "Preparando e-mail",
      description: "Seu aplicativo de e-mail será aberto com os registros de progresso.",
      variant: "default"
    });
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const shareText = generateShareableContent();
    if (!shareText) return;
    
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    
    toast({
      title: "Compartilhando via WhatsApp",
      description: "O WhatsApp Web será aberto com os registros de progresso.",
      variant: "default"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-4 w-4 mr-1" />
                Pesquisar registros
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Pesquisar por texto, status..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>Nenhum registro encontrado.</CommandEmpty>
                  <CommandGroup heading="Resultados">
                    {filteredRecords.map((record) => (
                      <CommandItem 
                        key={record.id}
                        onSelect={() => handleSearchResultSelect(record)}
                        className="flex flex-col items-start"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{formatDateDisplay(record.date)}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                            {getStatusName(record.status)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate w-full">
                          {record.notes?.substring(0, 60)}{record.notes?.length > 60 ? '...' : ''}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover
            open={isCustomDateFilterOpen}
            onOpenChange={setIsCustomDateFilterOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 mr-1" />
                {dateRangeFilter === 'all' ? 'Todos' : 
                 dateRangeFilter === '1m' ? 'Último mês' : 
                 dateRangeFilter === '3m' ? 'Últimos 3 meses' : 
                 dateRangeFilter === '6m' ? 'Últimos 6 meses' : 
                 getCustomDateRangeText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Filtrar por período</h4>
                
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={dateRangeFilter === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDateRangeFilter('all')}
                    >
                      Todos
                    </Button>
                    <Button 
                      variant={dateRangeFilter === '1m' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDateRangeFilter('1m')}
                    >
                      Último mês
                    </Button>
                    <Button 
                      variant={dateRangeFilter === '3m' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDateRangeFilter('3m')}
                    >
                      Últimos 3 meses
                    </Button>
                    <Button 
                      variant={dateRangeFilter === '6m' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDateRangeFilter('6m')}
                    >
                      Últimos 6 meses
                    </Button>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <h5 className="text-sm font-medium">Período personalizado</h5>
                    
                    <div className="grid gap-2">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-muted-foreground">De:</span>
                        <Calendar
                          mode="single"
                          selected={customDateFrom}
                          onSelect={setCustomDateFrom}
                          className="rounded-md border p-2"
                          initialFocus
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-muted-foreground">Até:</span>
                        <Calendar
                          mode="single"
                          selected={customDateTo}
                          onSelect={setCustomDateTo}
                          className="rounded-md border p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={resetDateFilter}
                      >
                        Limpar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={applyCustomDateFilter}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Share dropdown button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              disabled={!selectedDate || selectedDateRecords.length === 0}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShareClipboard}>
              Copiar para área de transferência
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareEmail}>
              Compartilhar via E-mail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareWhatsApp}>
              Compartilhar via WhatsApp
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {dateRangeFilter !== 'all' && (
        <div className="flex items-center mb-2">
          <div className="flex items-center bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full">
            <span className="mr-1">Filtro de data:</span>
            <span className="font-medium">
              {dateRangeFilter === '1m' ? 'Último mês' : 
               dateRangeFilter === '3m' ? 'Últimos 3 meses' : 
               dateRangeFilter === '6m' ? 'Últimos 6 meses' : 
               getCustomDateRangeText()}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-primary/20" 
              onClick={resetDateFilter}
            >
              <span>×</span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
              components={{
                Day: CustomDay
              }}
              fromDate={new Date(earliestDate.getFullYear() - 1, earliestDate.getMonth(), 1)}
              toDate={new Date(latestDate.getFullYear() + 1, latestDate.getMonth() + 1, 0)}
              showOutsideDays={true}
            />
            
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs">Regressão</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-xs">Sem Mudança</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs">Progresso Menor</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs">Progresso Significativo</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs">Alcançado</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="p-4">
            {selectedDate ? (
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  Registros para {format(selectedDate, 'PPP', { locale: pt })}
                </h3>
                
                {selectedDateRecords.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateRecords.map((record) => (
                      <ProgressRecordView
                        key={record.id}
                        progress={record}
                        showAuthor={true}
                        showCopyButton={false}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Não há registros para esta data
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Selecione uma data no calendário para ver os registros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressCalendarView;
