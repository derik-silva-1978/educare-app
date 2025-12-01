
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define the ChartExportMenuProps interface
interface ChartExportMenuProps {
  chartId?: string;
}

// Define the ChartExportMenu component
const ChartExportMenu: React.FC<ChartExportMenuProps> = ({ chartId }) => {
  const handleExport = (format: string) => {
    console.log(`Exporting chart ${chartId} as ${format}`);
    // Export logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-educare-navy hover:text-educare-red">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-educare-blue/20">
        <DropdownMenuItem onClick={() => handleExport('png')} className="hover:bg-educare-blue/10">
          <ArrowDownToLine className="mr-2 h-4 w-4 text-educare-navy" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="hover:bg-educare-blue/10">
          <ArrowDownToLine className="mr-2 h-4 w-4 text-educare-navy" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  id: string;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, id, className }) => {
  return (
    <Card className={`shadow-sm border border-educare-blue/10 hover:border-educare-blue/20 transition-all duration-300 ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-educare-navy">{title}</CardTitle>
        <ChartExportMenu chartId={id} />
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
