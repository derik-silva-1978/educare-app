
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showClearButton?: boolean;
  onSelect?: (date: Date | undefined) => void;
}

export function DatePicker({
  date,
  setDate,
  disabled,
  className,
  placeholder = "Selecione uma data",
  showClearButton = false,
  onSelect,
}: DatePickerProps) {
  const formattedDate = date ? format(date, "dd/MM/yyyy") : "";

  // Handle date selection with support for both setDate and onSelect
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (setDate) {
      setDate(selectedDate);
    }
    if (onSelect) {
      onSelect(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full min-h-10 justify-start text-left font-normal bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-900",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
          {formattedDate || <span className="text-gray-500 dark:text-gray-400 truncate">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-800 shadow-lg pointer-events-auto max-w-[95vw]" 
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={ptBR}
          initialFocus
          className="pointer-events-auto p-3"
        />
        {showClearButton && date && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleDateSelect(undefined)}
            >
              Limpar data
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
