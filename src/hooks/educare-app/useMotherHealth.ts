import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as maternalHealthService from '@/services/api/maternalHealthService';

export const useMotherDashboard = () => {
  return useQuery({
    queryKey: ['maternal-health', 'dashboard'],
    queryFn: async () => {
      const response = await maternalHealthService.getDashboardSummary();
      if (response.success && response.data) {
        return response.data;
      }
      return response as any;
    },
    staleTime: 2 * 60 * 1000,
    retry: 1
  });
};

export const useMotherProfile = () => {
  return useQuery({
    queryKey: ['maternal-health', 'profile'],
    queryFn: async () => {
      const response = await maternalHealthService.getProfile();
      if (response.success && response.data) return response.data;
      return response as any;
    }
  });
};

export const useUpdateMotherProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<maternalHealthService.MaternalProfile>) => maternalHealthService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-health'] });
    }
  });
};

export const useAddDailyHealth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<maternalHealthService.MaternalDailyHealth>) => maternalHealthService.addDailyHealth(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-health'] });
    }
  });
};

export const useAddMentalHealth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<maternalHealthService.MaternalMentalHealth>) => maternalHealthService.addMentalHealth(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-health'] });
    }
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<maternalHealthService.MaternalAppointment>) => maternalHealthService.addAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-health'] });
    }
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<maternalHealthService.MaternalAppointment> }) => maternalHealthService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maternal-health'] });
    }
  });
};
