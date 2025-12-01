
import { supabase } from '@/integrations/supabase/client';

export interface JourneyBotQuestionData {
  question_text: string;
  dimension: 'motor_grosso' | 'motor_fino' | 'linguagem' | 'cognitivo' | 'social_emocional' | 'autocuidado';
  age_min_months: number;
  age_max_months: number;
  order_index?: number;
  feedback_yes: string;
  feedback_no: string;
  feedback_unknown: string;
  tips_yes: string[];
  tips_no: string[];
  tips_unknown: string[];
  concern_level: number;
  active?: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  skipped: number;
}

export class JourneyBotQuestionImporter {
  private validateDimension(dimension: string): boolean {
    return ['motor_grosso', 'motor_fino', 'linguagem', 'cognitivo', 'social_emocional', 'autocuidado'].includes(dimension);
  }

  private validateAgeRange(minMonths: number, maxMonths: number): boolean {
    return minMonths >= 0 && maxMonths > minMonths && maxMonths <= 60; // Up to 5 years
  }

  private validateConcernLevel(level: number): boolean {
    return level >= 0 && level <= 2;
  }

  private parseTipsArray(tipsString: string): string[] {
    if (!tipsString) return [];
    return tipsString.split('|').map(tip => tip.trim()).filter(tip => tip.length > 0);
  }

  async previewCsv(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          
          const preview = lines.slice(1, 6).map((line, index) => {
            const values = this.parseCsvLine(line);
            const row: any = {};
            headers.forEach((header, i) => {
              row[header] = values[i] || '';
            });
            return row;
          }).filter(row => row.question_text);

          resolve(preview);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }

  private parseCsvLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i - 1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  async importFromCsv(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          
          let imported = 0;
          let skipped = 0;
          const errors: string[] = [];

          for (let i = 1; i < lines.length; i++) {
            try {
              onProgress?.(Math.round((i / (lines.length - 1)) * 100));

              const values = this.parseCsvLine(lines[i]);
              const rowData: any = {};
              
              headers.forEach((header, index) => {
                rowData[header] = values[index] || '';
              });

              // Skip empty rows
              if (!rowData.question_text || !rowData.question_text.trim()) {
                skipped++;
                continue;
              }

              // Validate required fields
              const validationError = this.validateRow(rowData, i + 1);
              if (validationError) {
                errors.push(validationError);
                continue;
              }

              // Transform data with proper dimension casting
              const questionData: JourneyBotQuestionData = {
                question_text: rowData.question_text.trim(),
                dimension: rowData.dimension.toLowerCase() as 'motor_grosso' | 'motor_fino' | 'linguagem' | 'cognitivo' | 'social_emocional' | 'autocuidado',
                age_min_months: parseInt(rowData.age_min_months),
                age_max_months: parseInt(rowData.age_max_months),
                order_index: parseInt(rowData.order_index) || imported + 1,
                feedback_yes: rowData.feedback_yes.trim(),
                feedback_no: rowData.feedback_no.trim(),
                feedback_unknown: rowData.feedback_unknown.trim(),
                tips_yes: this.parseTipsArray(rowData.tips_yes),
                tips_no: this.parseTipsArray(rowData.tips_no),
                tips_unknown: this.parseTipsArray(rowData.tips_unknown),
                concern_level: parseInt(rowData.concern_level) || 0,
                active: true
              };

              // Insert into database
              const { error } = await supabase
                .from('journey_bot_questions')
                .insert(questionData);

              if (error) {
                errors.push(`Linha ${i + 1}: Erro ao inserir no banco - ${error.message}`);
              } else {
                imported++;
              }

            } catch (error) {
              errors.push(`Linha ${i + 1}: Erro de processamento - ${error}`);
            }
          }

          resolve({
            success: errors.length === 0,
            imported,
            errors,
            skipped
          });

        } catch (error) {
          resolve({
            success: false,
            imported: 0,
            errors: [`Erro geral: ${error}`],
            skipped: 0
          });
        }
      };

      reader.readAsText(file);
    });
  }

  private validateRow(rowData: any, lineNumber: number): string | null {
    // Required fields validation
    const requiredFields = [
      'question_text', 'dimension', 'age_min_months', 'age_max_months',
      'feedback_yes', 'feedback_no', 'feedback_unknown'
    ];

    for (const field of requiredFields) {
      if (!rowData[field] || !rowData[field].toString().trim()) {
        return `Linha ${lineNumber}: Campo obrigatório '${field}' está vazio`;
      }
    }

    // Dimension validation
    if (!this.validateDimension(rowData.dimension.toLowerCase())) {
      return `Linha ${lineNumber}: Dimensão '${rowData.dimension}' inválida. Use: motor_grosso, motor_fino, linguagem, cognitivo, social_emocional, autocuidado`;
    }

    // Age validation
    const minMonths = parseInt(rowData.age_min_months);
    const maxMonths = parseInt(rowData.age_max_months);
    
    if (isNaN(minMonths) || isNaN(maxMonths)) {
      return `Linha ${lineNumber}: Idades devem ser números`;
    }

    if (!this.validateAgeRange(minMonths, maxMonths)) {
      return `Linha ${lineNumber}: Faixa etária inválida (${minMonths}-${maxMonths} meses)`;
    }

    // Concern level validation
    const concernLevel = parseInt(rowData.concern_level) || 0;
    if (!this.validateConcernLevel(concernLevel)) {
      return `Linha ${lineNumber}: Nível de preocupação deve ser 0, 1 ou 2`;
    }

    return null;
  }
}
