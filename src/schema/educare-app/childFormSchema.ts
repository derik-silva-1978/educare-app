
import { z } from 'zod';
import { isValidCPF } from '@/utils/educare-app/formatters';
import { isValidBirthdate } from '@/utils/educare-app/calculateAge';

export const childFormSchema = z.object({
  first_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  last_name: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  birthDate: z.string({
    required_error: 'Data de nascimento é obrigatória',
  }).refine((val) => isValidBirthdate(val), {
    message: 'Data de nascimento inválida ou no futuro',
  }),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Por favor, selecione um gênero',
  }),
  cpf: z.string()
    .optional()
    .refine((val) => !val || val === '' || isValidCPF(val), {
      message: 'CPF inválido',
    }),
  nationality: z.string().optional(),
  city: z.string().optional(),
  bloodtype: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  observations: z.string().optional(),
});

export type ChildFormValues = z.infer<typeof childFormSchema>;
