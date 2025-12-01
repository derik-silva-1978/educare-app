import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { FileDown, Image, FileJson, FileSpreadsheet, Table, Download } from 'lucide-react';
import { 
  exportChartDataAsJSON, 
  exportChartDataAsCSV,
  exportChartDataAsExcel,
  exportChartAsPNG
} from './exporters/ChartExporter';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-mobile';

interface ChartExportMenuProps {
  data: any[];
  chartRef: React.RefObject<HTMLDivElement>;
  title?: string;
}

export const ChartExportMenu: React.FC<ChartExportMenuProps> = ({ 
  data,
  chartRef,
  title = 'Gráfico'
}) => {
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  const handleExportJSON = () => {
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-dados.json`;
    const success = exportChartDataAsJSON(data, fileName);
    
    if (success) {
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados em formato JSON com sucesso",
      });
    } else {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados em formato JSON",
        variant: "destructive"
      });
    }
  };
  
  const handleExportCSV = () => {
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-dados.csv`;
    const success = exportChartDataAsCSV(data, fileName);
    
    if (success) {
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados em formato CSV com sucesso",
      });
    } else {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados em formato CSV",
        variant: "destructive"
      });
    }
  };
  
  const handleExportExcel = () => {
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-dados.xlsx`;
    const success = exportChartDataAsExcel(data, fileName);
    
    if (success) {
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados em formato Excel com sucesso",
      });
    } else {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados em formato Excel",
        variant: "destructive"
      });
    }
  };
  
  const handleExportPNG = async () => {
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
    const success = await exportChartAsPNG(chartRef, { fileName });
    
    if (success) {
      toast({
        title: "Exportação concluída",
        description: "A imagem do gráfico foi exportada com sucesso",
      });
    } else {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar a imagem do gráfico",
        variant: "destructive"
      });
    }
  };
  
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="pb-0">
          <SheetHeader className="mb-4">
            <SheetTitle>Exportar {title}</SheetTitle>
            <SheetDescription>
              Escolha um formato para exportar os dados
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 mb-6">
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportPNG}>
                <Image className="h-4 w-4 mr-2" />
                Imagem (PNG)
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportCSV}>
                <Table className="h-4 w-4 mr-2" />
                Dados (CSV)
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Dados (Excel)
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                Dados (JSON)
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileDown className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportPNG} className="gap-2">
          <Image className="h-4 w-4" />
          Imagem (PNG)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2">
          <Table className="h-4 w-4" />
          Dados (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Dados (Excel)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} className="gap-2">
          <FileJson className="h-4 w-4" />
          Dados (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChartExportMenu;
