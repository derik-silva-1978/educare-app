
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInYears } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { childFormSchema, ChildFormValues } from '@/schema/educare-app/childFormSchema';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidBirthdate } from '@/utils/educare-app/calculateAge';
import { createChild, getChild, updateChild, deleteChild } from '@/services/api/childService';

export const useChildForm = (id?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradePlanInfo, setUpgradePlanInfo] = useState<{ currentPlan?: string; currentLimit?: number }>({});
  const isEditMode = !!id;
  
  // Initialize the form with Zod validation
  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      birthDate: new Date().toISOString().split('T')[0],
      gender: 'male',
      cpf: '',
      nationality: '',
      city: '',
      bloodtype: undefined,
      observations: '',
    },
    mode: 'onChange'
  });

  // Track form changes to set isDirty state
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Function to load child data
  const loadChildData = async () => {
    if (!user || !id) return;

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading child data for ID:', id);
      
      const response = await getChild(id);

      if (!response.success) {
        console.error('Error loading child data:', response.error);
        throw new Error(response.error || 'Erro ao carregar dados da criança');
      }

      if (response.data) {
        console.log('Child data loaded:', response.data);
        
        const data = response.data;
        const birthDate = new Date(data.birthDate);
        const formattedDate = birthDate.toISOString().split('T')[0];
        
        // Extrair firstName e lastName do name
        const nameParts = data.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Set the form values
        form.reset({
          first_name: firstName,
          last_name: lastName,
          birthDate: formattedDate,
          gender: data.gender as 'male' | 'female' | 'other',
          cpf: '',
          nationality: '',
          city: '',
          bloodtype: undefined,
          observations: '',
        });
        
        setIsDirty(false);
      }
    } catch (error: unknown) {
      console.error('Error loading child data:', error);
      const errorMessage = (error instanceof Error ? error.message : 'Erro desconhecido') || 'Não foi possível carregar os dados da criança';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load child data on component mount if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadChildData();
    }
  }, [id, user, isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to save child data
  const saveChildData = async (data: ChildFormValues) => {
    if (!user) {
      toast({
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para salvar',
        variant: 'destructive',
      });
      return false;
    }

    // Validate birthdate
    if (!isValidBirthdate(data.birthDate)) {
      setError('Data de nascimento inválida ou no futuro');
      toast({
        title: 'Data inválida',
        description: 'A data de nascimento não pode ser no futuro',
        variant: 'destructive',
      });
      return false;
    }
    
    setError(null);
    
    try {
      console.log('Saving child data:', data);
      
      // Prepare the data object for backend API
      const childData = {
        name: `${data.first_name} ${data.last_name}`.trim(),
        birthDate: data.birthDate,
        gender: data.gender,
      };

      let response;
      
      if (id) {
        // Update existing child
        response = await updateChild(id, childData);
      } else {
        // Create new child
        response = await createChild(childData);
      }

      if (!response.success) {
        if (response.error?.includes('Limite de crianças') || response.error?.includes('Assinatura não encontrada')) {
          setUpgradePlanInfo({});
          setShowUpgradeDialog(true);
          return false;
        }
        throw new Error(response.error || 'Erro ao salvar dados da criança');
      }
      
      toast({
        title: 'Sucesso',
        description: id ? 'Dados atualizados com sucesso' : 'Criança cadastrada com sucesso',
      });
      
      if (!id && response.data?.id) {
        localStorage.setItem('educare_last_selected_child', response.data.id);
      }
      
      setIsDirty(false);
      return true;
    } catch (error: unknown) {
      console.error('Error saving child data:', error);
      
      const errorMessage = (error instanceof Error ? error.message : 'Erro desconhecido') || 'Não foi possível salvar os dados';
      
      if (errorMessage.includes('Limite de crianças') || errorMessage.includes('Assinatura não encontrada')) {
        setShowUpgradeDialog(true);
        return false;
      }
      
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Form submission handler
  const onSubmit = async (values: ChildFormValues) => {
    console.log('Form submission:', values);
    setIsLoading(true);
    
    try {
      const success = await saveChildData(values);
      if (success) {
        navigate('/educare-app/children');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete handler
  const onDelete = async () => {
    if (!user || !id) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await deleteChild(id);

      if (!response.success) {
        throw new Error(response.error || 'Erro ao remover criança');
      }

      toast({
        title: 'Sucesso',
        description: 'Criança removida com sucesso',
      });
      
      navigate('/educare-app/children');
    } catch (error: unknown) {
      console.error('Error deleting child:', error);
      const errorMessage = (error instanceof Error ? error.message : 'Erro desconhecido') || 'Não foi possível remover a criança';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isEditMode,
    isDirty,
    error,
    loadChildData,
    saveChildData,
    onSubmit,
    onDelete,
    showUpgradeDialog,
    setShowUpgradeDialog,
    upgradePlanInfo,
  };
};
